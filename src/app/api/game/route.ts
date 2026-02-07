import { MemUClient, waitForMemorizeSuccess } from "@/lib/memu"
import { MASTER_SYSTEM_PROMPT } from "@/lib/prompt";

type RequestBody = {
  action: string
  user_id: string
  agent_id: string
}

type LlmResult = {
  narration: string
  choices: string[]
  memu_updates?: Array<{ type: string; content: string }>
}

function extractJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch { }
    }
    return null
  }
}

async function callLLM(systemPrompt: string, payload: any) {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"
  if (!apiKey) {
    const fallback: LlmResult = {
      narration:
        "The chamber hums with latent power. Your choice ripples through the Grimoire, inscribing fate upon midnight parchment.",
      choices: ["Advance", "Observe", "Retreat"],
      memu_updates: [{ type: "world_event", content: "Player made an action" }]
    }
    return fallback
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(payload) }
      ],
      response_format: { type: "json_object" }
    })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM error: ${res.status} ${err}`)
  }
  const data = await res.json()
  const content =
    data?.choices?.[0]?.message?.content ??
    JSON.stringify({
      narration: "The Grimoire speaks in fallback tongues.",
      choices: ["Advance", "Observe", "Retreat"],
      memu_updates: [{ type: "world_event", content: "Fallback update" }]
    })
  const parsed = extractJson(content)
  return parsed ?? { narration: String(content), choices: [], memu_updates: [] }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<RequestBody>
    if (!body?.action || !body?.user_id || !body?.agent_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: action, user_id, agent_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }
    const client = new MemUClient()

    let memory = "No previous history yet. This is the beginning of the journey.";

    try {
      // On définit une recherche simple si l'action est "start" ou vide
      const isStart = body.action?.toLowerCase() === "start" || body.action?.toLowerCase() === "start_game";

      const searchQuery = isStart
        ? "Summarize the current world state and player history."
        : `Context for: ${body.action}`;

      const memoryData = await client.retrieve({
        user_id: body.user_id,
        agent_id: body.agent_id,
        // Utilise une string simple plutôt qu'un tableau pour éviter l'erreur 500 "INVALID"
        query: searchQuery
      });
      console.log("🔍 Contenu actuel de la mémoire :", JSON.stringify(memoryData.items));
      // On extrait le contenu si memU renvoie des résultats
      if (memoryData?.items && memoryData.items.length > 0) {
        memory = memoryData.items.map(i => i.content).join("\n");
      }
    } catch (error) {
      // Si memU échoue (500, 503, ou vide), on log l'erreur mais on ne bloque pas le jeu !
      console.warn("MemU retrieve failed or is empty, continuing with default memory context.", error);
    }

    const systemPrompt = MASTER_SYSTEM_PROMPT;

    const llmResult = await callLLM(systemPrompt, {
      action: body.action,
      memory
    })

    let memuTaskId: string | undefined
    let memuStatus: string | undefined

    if (llmResult?.memu_updates && llmResult.memu_updates.length > 0) {
      const conv = [
        { role: "user" as const, content: `Action: ${body.action}` },
        {
          role: "assistant" as const,
          content: `MemU updates:\n${llmResult.memu_updates
            .map((u: { type: string; content: string }) => `- [${u.type}] ${u.content}`)
            .join("\n")}`
        }
      ]

      const { task_id } = await client.memorize({
        conversation: conv,
        user_id: body.user_id,
        agent_id: body.agent_id
      })
      memuTaskId = task_id
      const status = await waitForMemorizeSuccess(client, task_id, {
        timeoutMs: 10000,
        pollMs: 1500
      })
      memuStatus = status.status
    }

    return new Response(
      JSON.stringify({
        narration: llmResult.narration,
        choices: llmResult.choices,
        memu_task_id: memuTaskId,
        memu_status: memuStatus ?? "SKIPPED"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
