"use client";

import { useEffect, useState } from "react";
import { fetchAgents, Agent } from "@/lib/agents";

export default function Home() {
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const loadAgents = async () => {
      const data = await fetchAgents();

      const shuffled = [...data].sort(() => 0.5 - Math.random());
      setSelectedAgents(shuffled.slice(0, 5));
    };

    loadAgents();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">🎰 Agent Picker</h1>
      <div className="grid grid-cols-5 gap-4">
        {selectedAgents.map((agent) => (
          <div
            key={agent.uuid}
            className="flex flex-col items-center p-2 rounded bg-zinc-800 shadow-lg"
          >
            <img
              src={agent.displayIcon}
              alt={agent.displayName}
              className="w-24 h-24 object-contain"
            />
            <span className="mt-2 text-sm font-medium">
              {agent.displayName}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
