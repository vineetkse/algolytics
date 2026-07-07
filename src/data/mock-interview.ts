import type { MockInterviewPhase } from "@/lib/types";

export const MOCK_DURATION_MINUTES = 45;

export const mockPhases: {
  id: MockInterviewPhase;
  title: string;
  durationMin: number;
  instructions: string[];
  prompts: string[];
}[] = [
  {
    id: "clarify",
    title: "Clarify",
    durationMin: 3,
    instructions: [
      "Restate the problem in your own words.",
      "Ask about input size, edge cases, and expected output format.",
      "Confirm you can modify input or need extra space.",
    ],
    prompts: [
      "What are the constraints on input size?",
      "Can inputs be empty? Duplicates? Negative numbers?",
      "What should I return if no valid answer exists?",
    ],
  },
  {
    id: "examples",
    title: "Examples",
    durationMin: 5,
    instructions: [
      "Walk through 2–3 examples out loud, including a small edge case.",
      "Trace expected output step by step before coding.",
    ],
    prompts: [
      "Work the provided example by hand on paper.",
      "Add your own edge case (empty, single element, max size).",
    ],
  },
  {
    id: "approach",
    title: "Approach",
    durationMin: 7,
    instructions: [
      "Describe brute force first — correctness before speed.",
      "Name the pattern, then optimize. State time and space complexity.",
      "Get imaginary interviewer buy-in before coding.",
    ],
    prompts: [
      "What's the brute force? What's its complexity?",
      "Which pattern fits? Why not a similar one?",
      "What's the optimal approach and complexity?",
    ],
  },
  {
    id: "code",
    title: "Code",
    durationMin: 22,
    instructions: [
      "Write clean, readable code. Narrate key lines.",
      "Use meaningful names. Handle edge cases in code.",
    ],
    prompts: [
      "Start with function signature and main loop structure.",
      "Explain each non-obvious line as you type.",
    ],
  },
  {
    id: "test",
    title: "Test",
    durationMin: 5,
    instructions: [
      "Run tests. If failure, debug out loud.",
      "Walk through a failing case with your code line by line.",
    ],
    prompts: [
      "Test the examples first, then edge cases.",
      "State what variable values are at each step.",
    ],
  },
  {
    id: "review",
    title: "Review",
    durationMin: 3,
    instructions: [
      "Summarize approach and complexity.",
      "Mention one alternative approach or tradeoff.",
      "Rate yourself honestly on the rubric.",
    ],
    prompts: [
      "What would you improve with more time?",
      "How would this change for follow-up constraints?",
    ],
  },
];

export const rubricCriteria = [
  { key: "communication" as const, label: "Communication", description: "Clarified, thought aloud, structured" },
  { key: "problemSolving" as const, label: "Problem solving", description: "Examples, brute force, optimization" },
  { key: "coding" as const, label: "Coding", description: "Clean, correct implementation" },
  { key: "complexity" as const, label: "Complexity", description: "Stated time/space, justified approach" },
  { key: "testing" as const, label: "Testing", description: "Tested examples and edge cases" },
];
