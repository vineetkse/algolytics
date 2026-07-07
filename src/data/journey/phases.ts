export interface JourneyPhase {
  number: number;
  id: string;
  name: string;
  tagline: string;
  startDay: number;
  endDay: number;
  minutesPerDay: number;
  goal: string;
  skills: string[];
}

export const journeyPhases: JourneyPhase[] = [
  {
    number: 1,
    id: "foundations",
    name: "Code Foundations",
    tagline: "Learn to think in code before patterns",
    startDay: 1,
    endDay: 21,
    minutesPerDay: 20,
    goal: "Write basic programs: loops, arrays, functions. No interview pressure.",
    skills: ["Variables & logic", "Loops & arrays", "Functions", "Strings", "Problem decomposition"],
  },
  {
    number: 2,
    id: "pattern-eyes",
    name: "Pattern Eyes",
    tagline: "See the pattern before touching code",
    startDay: 22,
    endDay: 49,
    minutesPerDay: 15,
    goal: "Read problems and name the right pattern with 70%+ accuracy.",
    skills: ["Signal recognition", "Pattern naming", "Mental models", "When NOT to use a pattern"],
  },
  {
    number: 3,
    id: "think-then-code",
    name: "Think Then Code",
    tagline: "Connect recognition to implementation",
    startDay: 50,
    endDay: 91,
    minutesPerDay: 35,
    goal: "Solve beginner problems after identifying the pattern yourself.",
    skills: ["Pattern → pseudocode", "Beginner implementation", "Test your own code", "Spaced repetition"],
  },
  {
    number: 4,
    id: "build-depth",
    name: "Build Depth",
    tagline: "Handle confusion and harder problems",
    startDay: 92,
    endDay: 119,
    minutesPerDay: 40,
    goal: "Separate similar patterns. Solve intermediate problems consistently.",
    skills: ["Pattern duels", "Decomposition", "Intermediate problems", "Complexity reasoning"],
  },
  {
    number: 5,
    id: "interview-speed",
    name: "Interview Speed",
    tagline: "Fast recognition under pressure",
    startDay: 120,
    endDay: 147,
    minutesPerDay: 45,
    goal: "Identify patterns in under 60 seconds. Mixed difficulty coding.",
    skills: ["Timed gauntlet", "Speed drills", "Mixed patterns", "Verbal explanation"],
  },
  {
    number: 6,
    id: "google-ready",
    name: "Google Ready",
    tagline: "Polish, review, simulate",
    startDay: 148,
    endDay: 168,
    minutesPerDay: 50,
    goal: "Mock interview mindset. Review weak spots. Advanced problem exposure.",
    skills: ["Mock interviews", "Weak pattern review", "Advanced problems", "Communication"],
  },
];

export const JOURNEY_TOTAL_DAYS = 168;

export const patternLearningOrder = [
  "two-pointers",
  "sliding-window",
  "tree-bfs",
  "tree-dfs",
  "merge-intervals",
  "modified-binary-search",
  "fibonacci-dp",
  "fast-slow-pointers",
  "top-k-elements",
  "graph-bfs-dfs",
  "subsets",
  "greedy",
  "monotonic-stack",
  "topological-sort",
  "knapsack-dp",
  "trie",
  "cyclic-sort",
  "union-find",
  "k-way-merge",
  "palindromic-dp",
  "two-heaps",
  "bitmask-dp",
] as const;

export const beginnerProblemRotation = [
  "valid-palindrome",
  "climbing-stairs",
  "missing-number",
  "search-insert-position",
  "next-greater-element",
  "two-sum",
  "jump-game",
  "decode-ways",
] as const;

export const intermediateProblemRotation = [
  "longest-substring-without-repeating",
  "min-size-subarray-sum",
  "merge-intervals",
  "search-rotated-sorted-array",
  "kth-largest-element",
  "number-of-islands",
  "house-robber",
  "coin-change",
  "3sum",
  "sort-colors",
  "top-k-frequent-elements",
  "course-schedule",
  "word-search",
  "container-with-most-water",
] as const;

export const advancedProblemRotation = [
  "container-with-most-water",
  "trapping-rain-water",
  "find-duplicate-number",
  "daily-temperatures",
  "jump-game",
  "decode-ways",
  "3sum",
  "coin-change",
] as const;

export function getPhaseForDay(dayNumber: number): JourneyPhase {
  const phase = journeyPhases.find(
    (p) => dayNumber >= p.startDay && dayNumber <= p.endDay
  );
  return phase ?? journeyPhases[journeyPhases.length - 1];
}

export function getWeekNumber(dayNumber: number): number {
  return Math.ceil(dayNumber / 7);
}
