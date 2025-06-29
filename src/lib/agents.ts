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

export type Agent = {
  uuid: string;
  displayName: string;
  displayIcon: string;
  fullPortrait: string;
  role: {
    uuid: string;
    displayName: string;
    description: string;
    displayIcon: string;
  };
};

export async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch(
    "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
  );
  const data = await res.json();
  return data.data.map((agent: Agent) => ({
    uuid: agent.uuid,
    displayName: agent.displayName,
    displayIcon: agent.displayIcon,
    fullPortrait: agent.fullPortrait,
    role: {
      uuid: agent.role.uuid,
      displayName: agent.role.displayName,
      description: agent.role.description,
      displayIcon: agent.role.displayIcon,
    },
  }));
}
