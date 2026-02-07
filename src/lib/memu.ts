type ConversationMessage = {
  role: "user" | "assistant"
  name?: string
  created_at?: string
  content: string
}

export type MemorizePayload = {
  conversation: ConversationMessage[]
  user_id: string
  user_name?: string
  agent_id: string
  agent_name?: string
  session_date?: string
}

export type RetrievePayload =
  | {
    user_id: string
    agent_id: string
    query: string
  }
  | {
    user_id: string
    agent_id: string
    query: ConversationMessage[]
  }

export type MemUCategoriesPayload = {
  user_id: string
  agent_id: string
}

export class MemUClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey = process.env.MEMU_API_KEY ?? "", baseUrl = process.env.MEMU_API_URL ?? "") {
    if (!apiKey) {
      throw new Error("Missing MEMU_API_KEY")
    }
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    }
  }

  async memorize(payload: MemorizePayload) {
    const res = await fetch(`${this.baseUrl}/api/v3/memory/memorize`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`MemU memorize failed: ${res.status} ${err}`)
    }
    return (await res.json()) as { task_id: string; status: string; message: string }
  }

  async getMemorizeStatus(taskId: string) {
    const res = await fetch(`${this.baseUrl}/api/v3/memory/memorize/status/${taskId}`, {
      method: "GET",
      headers: this.headers()
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`MemU status failed: ${res.status} ${err}`)
    }
    return (await res.json()) as {
      task_id: string
      status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED"
      created_at?: string
      completed_at?: string
    }
  }

  async listCategories(payload: MemUCategoriesPayload) {
    const res = await fetch(`${this.baseUrl}/api/v3/memory/categories`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`MemU categories failed: ${res.status} ${err}`)
    }
    return (await res.json()) as {
      categories: Array<{
        name: string
        description?: string
        user_id: string
        agent_id: string
        summary?: string
      }>
    }
  }

  async retrieve(payload: RetrievePayload) {
    const res = await fetch(`${this.baseUrl}/api/v3/memory/retrieve`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`MemU retrieve failed: ${res.status} ${err}`)
    }
    return (await res.json()) as {
      rewritten_query?: string
      categories?: Array<{ name: string; description?: string; summary?: string }>
      items?: Array<{ memory_type: string; content: string }>
      resources?: Array<{
        modality: string
        resource_url: string
        caption?: string
        content?: string
      }>
    }
  }

  async delete(payload: { user_id: string; agent_id?: string }) {
    const res = await fetch(`${this.baseUrl}/api/v3/memory/delete`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`MemU delete failed: ${res.status} ${err}`)
    }
    return await res.json()
  }
}

export async function waitForMemorizeSuccess(
  client: MemUClient,
  taskId: string,
  { timeoutMs = 60000, pollMs = 2000 }: { timeoutMs?: number; pollMs?: number } = {}
) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const status = await client.getMemorizeStatus(taskId)
    if (status.status === "SUCCESS" || status.status === "FAILED") return status
    await new Promise((r) => setTimeout(r, pollMs))
  }
  return { task_id: taskId, status: "PENDING" as const }
}
