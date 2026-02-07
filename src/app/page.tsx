"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [gameData, setGameData] = useState({
    narration: "The Grimoire is silent, waiting for you to wake it...",
    choices: [{ label: "Awaken the Grimoire", value: "start_game" }]
  });
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionValue: string) => {
    setLoading(true);
    const res = await fetch("/api/game", {
      method: "POST",
      body: JSON.stringify({
        action: actionValue,
        user_id: "player_123", // For the hackathon, hardcode or use a session ID
        agent_id: "sentient_grimoire_01"
      }),
    });
    const data = await res.json();
    setGameData(data);
    console.log(data);
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-8 bg-black text-amber-50 min-h-screen font-serif">
      {/* Narrative Window */}
      <section className="p-6 border border-amber-900/50 bg-neutral-900/80 rounded-lg shadow-2xl">
        <p className="text-xl leading-relaxed italic">{loading ? "The ink is flowing..." : gameData.narration}</p>
      </section>

      {/* Dynamic Buttons */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gameData.choices.map((choice, i) => (
          <button
            key={i}
            disabled={loading}
            onClick={() => handleAction(choice.value)}
            className="p-4 border border-amber-700 bg-amber-950/30 hover:bg-amber-900/50 transition-all rounded text-lg font-bold"
          >
            {choice.label}
          </button>
        ))}
      </section>
    </main>
  );
}