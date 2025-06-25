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

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Agent } from "@/lib/agents";

type SlotColumnProps = {
  agents: Agent[];
  targetAgent: Agent;
  spinning: boolean;
  delay: number;
  onStop: () => void;
};

export default function SlotColumn({
  agents,
  targetAgent,
  spinning,
  delay,
  onStop,
}: SlotColumnProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!spinning || stopped) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % agents.length);
    }, 60);

    const timeout = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const targetIndex = agents.findIndex((a) => a.uuid === targetAgent.uuid);
      setCurrentIndex(targetIndex);
      setStopped(true);
      onStop();
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(timeout);
    };
  }, [spinning, delay, targetAgent, agents, onStop, stopped]);

  useEffect(() => {
    if (spinning) {
      setStopped(false);
    }
  }, [spinning]);

  const agent = agents[currentIndex];

  return (
    <div className="relative w-24 h-28 overflow-hidden border-2 border-yellow-500 rounded bg-zinc-900 shadow-md">
      <div className="flex flex-col items-center justify-center h-28 w-full">
        {agent?.displayIcon && (
          <Image
            src={agent.displayIcon}
            alt={agent.displayName || "Agent"}
            width={80}
            height={80}
            className="object-contain"
          />
        )}
        <p className="text-sm text-white text-center px-1">
          {agent?.displayName || "Unknown"}
        </p>
      </div>
    </div>
  );
}
