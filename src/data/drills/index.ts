import type { Drill } from "@/lib/types";
import { patternSpotDrills } from "./pattern-spot";
import { signalHuntDrills } from "./signal-hunt";
import { decomposeDrills } from "./decompose";
import { patternDuelDrills } from "./pattern-duel";

export const drills: Drill[] = [
  ...patternSpotDrills,
  ...signalHuntDrills,
  ...decomposeDrills,
  ...patternDuelDrills,
];

export {
  patternSpotDrills,
  signalHuntDrills,
  decomposeDrills,
  patternDuelDrills,
};

export function getDrillsByType(type: Drill["type"]): Drill[] {
  if (type === "timed-gauntlet") {
    return patternSpotDrills;
  }
  return drills.filter((d) => d.type === type);
}

export function getDrillsByPattern(patternId: string): Drill[] {
  return drills.filter((d) => d.correctPatternId === patternId);
}

export function getDrillsByPatterns(patternIds: string[]): Drill[] {
  if (patternIds.length === 0) return drills;
  return drills.filter((d) => patternIds.includes(d.correctPatternId));
}

export function filterDrills(
  type: Drill["type"],
  patternIds?: string[]
): Drill[] {
  let result = getDrillsByType(type);
  if (patternIds && patternIds.length > 0) {
    result = result.filter((d) => patternIds.includes(d.correctPatternId));
  }
  return result;
}

export function filterDuelDrills(patternIds?: string[]): Drill[] {
  let result = patternDuelDrills;
  if (patternIds?.length) {
    const filtered = result.filter(
      (d) =>
        patternIds.includes(d.correctPatternId) ||
        (d.distractorPatternId && patternIds.includes(d.distractorPatternId))
    );
    if (filtered.length > 0) result = filtered;
  }
  return result;
}

export function shuffleDrills(list: Drill[]): Drill[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
