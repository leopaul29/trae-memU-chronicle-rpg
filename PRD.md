# 📜 PRD: "Chronicle" – The Memory-Linked RPG

**Tagline:** *A dungeon that never forgets your sins, and a Grimoire that remembers your glory.*

## 1. Product Overview

A web-based, AI-narrated RPG where every player choice is stored in a structured "Memory Layer" (**memU**). Unlike standard LLM chats, the game state persists and evolves based on summarized past actions, affecting NPC behavior, available choices, and the narrator’s personality.

## 2. Target Features (MVP)

* **The Sentient Grimoire (AI Agent):** A persona-driven narrator that guides the player and "writes" the memory.
* **Dynamic Decision UI:** A simple interface with a narrative window and 3 dynamically generated action buttons.
* **Persistent World State:** Using memU to track:
* **Player Alignment:** (e.g., Heroic vs. Ruthless)
* **World Events:** (e.g., "Burned down the village tavern")
* **Key Items/Favors:** (e.g., "The Blacksmith owes you")


* **Memory-Driven Branching:** The AI checks memU before generating the next scene to see if a "Memory-locked" choice should appear.

---

## 3. User Flow

1. **Awakening:** The player starts a new session. The Grimoire introduces the world (Medieval Fantasy).
2. **The Choice:** The player is presented with a scenario and 3 buttons.
3. **The Extraction:** Upon clicking, the Agent sends the action to **memU** to update the relevant "Memory File."
4. **The Reflection:** The Agent queries **memU** for relevant history.
5. **The Generation:** The Agent generates the next story segment and 3 new choices based on the *combined* current context and retrieved memory.

---

## 4. Tech Stack & Integration

* **Editor:** **TRAE** (Used to "vibe code" the frontend and API routes instantly).
* **Memory Layer:** **memU** API.
* **LLM:** Claude 3.5 or GPT-4o (via TRAE/memU integration).
* **Frontend:** React (Next.js) with Tailwind CSS for a "Dark Parchment" aesthetic.

---

## 5. memU Directory Structure (The Logic)

You will tell memU to organize data like this:

* `/player/stats.md` – (Health, Gold, Alignment score)
* `/player/inventory.md` – (Items found)
* `/world/history.md` – (Major plot points reached)
* `/world/reputation.md` – (How NPCs in different towns view the player)

---

## 6. Success Metrics for Judges

* **Persistence:** Show that refreshing the page doesn't lose the "Blacksmith's Favor."
* **Complexity:** Show how an action in "Turn 2" created a unique button in "Turn 10."
* **Speed:** Demonstrate how TRAE allowed a single dev to build a full memory-linked system in 3 hours.
