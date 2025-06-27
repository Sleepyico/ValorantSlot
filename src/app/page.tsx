/*
 *   Copyright (c) 2025 Laith Alkhaddam aka Iconical or Sleepyico.
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

"use client";

import { useState, useEffect } from "react";
import { fetchAgents, Agent } from "@/lib/agents";
import SlotColumn from "@/components/SlotColumn";
import { Howl } from "howler";
import Snowfall from "react-snowfall";
import Image from "next/image";

const spinSound = new Howl({ src: ["/sounds/spin.wav"], volume: 0.1 });
const stopSound = new Howl({ src: ["/sounds/stop.wav"], volume: 0.1 });
const jackpotSound = new Howl({ src: ["/sounds/jackpot.mp3"], volume: 0.05 });

export default function Home() {
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [stoppedCount, setStoppedCount] = useState(0);
  const [scrollAgentsList, setScrollAgentsList] = useState<Agent[][]>([]);
  const [showCoins, setShowCoins] = useState(false);
  const [visibleSnowflakeCount, setVisibleSnowflakeCount] = useState(0);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showCoins && !spinning) {
      setVisibleSnowflakeCount(100);
    } else {
      interval = setInterval(() => {
        setVisibleSnowflakeCount((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 10;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [showCoins, spinning]);
  const [snowImages, setSnowImages] = useState<HTMLImageElement[]>([]);
  const [currentStickman, setCurrentStickman] = useState(
    "/stickman/question.png"
  );
  const [showLegend, setShowLegend] = useState(false);

  const ROLE_SENTINEL = "Sentinel";
  const ROLE_CONTROLLER = "Controller";
  const ROLE_INITIATOR = "Initiator";
  const ROLE_DUELIST = "Duelist";

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAgents();
      setAllAgents(data);

      const imageElements: HTMLImageElement[] = data
        .slice(0, 10)
        .map((agent) => {
          const img = document.createElement("img");
          img.src = agent.displayIcon;
          img.width = 40;
          img.height = 40;
          return img;
        });

      setSnowImages(imageElements);
    };

    fetchData();
  }, []);

  function generateTeamWithRoleDistribution(
    agents: Agent[],
    roleCounts: Record<string, number>
  ): Agent[] {
    const selected: Agent[] = [];
    const usedUuids = new Set<string>();

    for (const [roleName, count] of Object.entries(roleCounts)) {
      const pool = agents.filter(
        (a) => a.role?.displayName === roleName && !usedUuids.has(a.uuid)
      );
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const picked = shuffled.slice(0, count);
      picked.forEach((agent) => usedUuids.add(agent.uuid));
      selected.push(...picked);
    }

    return selected;
  }

  const handleSpin = () => {
    if (allAgents.length < 5) return;

    spinSound.play();
    setSpinning(true);
    setStoppedCount(0);
    setCurrentStickman("/stickman/question.png");

    const roll = Math.random() * 100;

    let uniqueAgents: Agent[] = [];

    if (roll < 2) {
      const names = ["Chamber", "KAY/O", "Jett", "Sova", "Clove"];
      uniqueAgents = allAgents.filter((a) => names.includes(a.displayName));
    } else if (roll < 21) {
      uniqueAgents = generateTeamWithRoleDistribution(allAgents, {
        [ROLE_SENTINEL]: 1,
        [ROLE_CONTROLLER]: 2,
        [ROLE_INITIATOR]: 1,
        [ROLE_DUELIST]: 1,
      });
    } else if (roll < 41) {
      uniqueAgents = generateTeamWithRoleDistribution(allAgents, {
        [ROLE_SENTINEL]: 2,
        [ROLE_CONTROLLER]: 1,
        [ROLE_INITIATOR]: 1,
        [ROLE_DUELIST]: 1,
      });
    } else if (roll < 101) {
      uniqueAgents = generateTeamWithRoleDistribution(allAgents, {
        [ROLE_SENTINEL]: 1,
        [ROLE_CONTROLLER]: 1,
        [ROLE_INITIATOR]: 1,
        [ROLE_DUELIST]: 2,
      });
    }

    const generatedScrollLists = uniqueAgents.map(() =>
      [...allAgents].sort(() => 0.5 - Math.random())
    );
    setScrollAgentsList(generatedScrollLists);
    setSelectedAgents(uniqueAgents);
  };

  console.log("Count:", stoppedCount);

  const PLACEHOLDER_AGENT: Agent = {
    uuid: "placeholder",
    displayName: "Hmm",
    displayIcon: "/random.png",
    fullPortrait: "",
    role: {
      displayName: "",
      uuid: "",
      description: "",
      displayIcon: "",
    },
  };

  const PLACEHOLDER_SCROLL_AGENTS = Array(5).fill(PLACEHOLDER_AGENT);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black/40 via-zinc-900/40 to-black/40 px-4 py-8 sm:py-12 md:py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-yellow-400/20 via-pink-600/30 to-purple-700/30 blur-3xl" />

      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setShowLegend((prev) => !prev)}
          className="text-sm text-yellow-300 underline hover:text-yellow-200 transition animate-slide-in"
        >
          {showLegend ? "Hide Legend" : "Show Legend"}
        </button>

        {showLegend && (
          <div className="mt-2 p-4 bg-black bg-opacity-80 border border-yellow-400 rounded-md text-sm text-yellow-100 w-full max-w-xs sm:max-w-sm md:max-w-md text-left transition-all duration-300 ease-in-out animate-fade-in">
            <p className="mb-2 font-bold text-yellow-300">🎲 Odds Breakdown:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>2%</strong> – Special team: Chamber, KAY/O, Jett, Sova,
                Clove
              </li>
              <li>
                <strong>19%</strong> – Role balance: 1 Sent, 2 Ctrl, 1 Init, 1
                Duel
              </li>
              <li>
                <strong>20%</strong> – Slight Sent skew: 2 Sent, 1 Ctrl, 1 Init,
                1 Duel
              </li>
              <li>
                <strong>59%</strong> – Default: 1 Sent, 1 Ctrl, 1 Init, 2 Duel
              </li>
            </ul>
          </div>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-yellow-400 drop-shadow-lg mb-2 select-none">
        🎰 Team Slot Picker 🎰
      </h1>
      <p className="text-zinc-400 mb-8 max-w-md text-center select-none text-sm sm:text-base">
        Spin the reels to pick your dream Valorant team.
      </p>

      <div className="flex space-x-4 rounded-lg bg-black bg-opacity-80 border border-yellow-400 p-6 shadow-xl shadow-yellow-900">
        <div className="overflow-x-auto">
          <div
            key="agents"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 transition-opacity duration-500 ease-out"
          >
            {(selectedAgents.length === 5
              ? selectedAgents
              : Array(5).fill(PLACEHOLDER_AGENT)
            ).map((agent, i) => (
              <SlotColumn
                key={agent.uuid + i}
                agents={scrollAgentsList[i] || PLACEHOLDER_SCROLL_AGENTS}
                targetAgent={agent}
                spinning={spinning}
                delay={1800 + i * 70}
                onStop={() => {
                  if (!spinning) return;
                  stopSound.play();
                  setStoppedCount((prev) => {
                    const next = prev + 1;
                    if (next === 5) {
                      jackpotSound.play();
                      setShowCoins(true);
                      setTimeout(() => setShowCoins(false), 5300);
                      setSpinning(false);

                      const hasTwoControllers =
                        selectedAgents.filter(
                          (a) => a.role?.displayName === ROLE_CONTROLLER
                        ).length === 2;

                      setCurrentStickman(
                        hasTwoControllers
                          ? "/stickman/cry.png"
                          : "/stickman/nice.png"
                      );
                    }
                    return next;
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className={`mt-8 px-12 py-4 rounded-full bg-yellow-400 text-black font-extrabold text-xl shadow-xl shadow-yellow-600 hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer hover:scale-105`}
      >
        {spinning ? (
          <span className="inline-block animate-spin">🎰 Spinning...</span>
        ) : (
          "🎯 Pull the Handle"
        )}
      </button>

      <Snowfall
        snowflakeCount={visibleSnowflakeCount}
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          zIndex: 50,
        }}
        changeFrequency={6666}
        rotationSpeed={[1, 1.5]}
        radius={[25, 50]}
        speed={[3, 6]}
        images={snowImages}
      />

      <Image
        src={currentStickman}
        alt="Stickman reaction"
        width={256}
        height={256}
        className="fixed bottom-0 right-0 opacity-80 transition-transform duration-300"
      />
    </main>
  );
}
