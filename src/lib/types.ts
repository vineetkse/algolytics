export type Difficulty = "beginner" | "intermediate" | "advanced";

export type PatternCategory =
  | "arrays"
  | "linked-lists"
  | "trees"
  | "graphs"
  | "dynamic-programming"
  | "heaps"
  | "backtracking"
  | "misc";

export interface Pattern {
  id: string;
  name: string;
  category: PatternCategory;
  difficulty: Difficulty;
  tagline: string;
  signals: string[];
  whenToUse: string;
  mentalModel: string;
  timeComplexity: string;
  exampleProblems: string[];
}

export type DrillType =
  | "pattern-spot"
  | "signal-hunt"
  | "decompose"
  | "pattern-duel"
  | "timed-gauntlet";

export interface Drill {
  id: string;
  type: DrillType;
  problem: string;
  hints?: string[];
  correctPatternId: string;
  distractorPatternId?: string;
  explanation: string;
  whyNotDistractor?: string;
  difficulty: Difficulty;
  decompositionSteps?: string[];
}

export interface PatternMasteryEntry {
  attempts: number;
  correct: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  intervalDays: number;
  easeFactor: number;
}

export interface UserProgress {
  totalDrills: number;
  correctDrills: number;
  streak: number;
  lastTrainedAt?: string;
  patternMastery: Record<string, PatternMasteryEntry>;
  sessions: TrainingSession[];
  problemProgress: Record<string, ProblemProgressEntry>;
  mockInterviews?: MockInterviewRecord[];
  lastDailyWorkoutAt?: string;
}

export interface TrainingSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  drillType: DrillType;
  results: DrillResult[];
}

export interface DrillResult {
  drillId: string;
  patternId: string;
  correct: boolean;
  timeMs: number;
  selectedPatternId?: string;
}

export type StudyGoal =
  | "interview-prep"
  | "fundamentals"
  | "daily-habit"
  | "mastery"
  | "custom"
  | "zero-to-google";

export type PlanTaskType =
  | DrillType
  | "solve-problem"
  | "read-pattern"
  | "foundation"
  | "daily-workout"
  | "reflect"
  | "mock-interview";

export interface StudyPlanTask {
  id: string;
  drillType: PlanTaskType;
  count: number;
  patternIds?: string[];
  problemId?: string;
  foundationDay?: number;
  reflectPrompt?: string;
  label: string;
  completed: boolean;
  completedAt?: string;
}

export interface StudyPlanDay {
  dayNumber: number;
  title: string;
  description: string;
  focusPatternIds: string[];
  tasks: StudyPlanTask[];
  completed: boolean;
  completedAt?: string;
  phase?: string;
  phaseNumber?: number;
  weekNumber?: number;
  milestone?: string;
  minutesEstimate?: number;
}

export interface StudyPlan {
  id: string;
  name: string;
  goal: StudyGoal;
  description: string;
  totalDays: number;
  minutesPerDay: number;
  startDate: string;
  patternIds: string[];
  days: StudyPlanDay[];
  currentDay: number;
  completedDays: number;
  isActive: boolean;
  createdAt: string;
  journeyId?: string;
}

export interface StudyPlanTemplate {
  id: string;
  name: string;
  goal: StudyGoal;
  description: string;
  totalDays: number;
  minutesPerDay: number;
  difficulty: Difficulty;
  patternIds: string[];
  highlights: string[];
  journeyId?: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  patternId: string;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  starterCode: Record<string, string>;
}

export type ProblemStatus = "not_started" | "attempted" | "solved";

export interface ProblemProgressEntry {
  status: ProblemStatus;
  attempts: number;
  solvedAt?: string;
  lastAttemptAt?: string;
  code?: string;
  language?: string;
  verifiedSolved?: boolean;
  testsPassed?: number;
  testsTotal?: number;
}

export interface ProblemTestCase {
  args: Record<string, unknown>;
  expected: unknown;
  hidden?: boolean;
}

export interface ProblemApproach {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface ProblemJudgeConfig {
  functionName: string;
  paramNames: string[];
  testCases: ProblemTestCase[];
  solutionCode: Record<string, string>;
  approaches: ProblemApproach[];
  editorial: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface TestCaseResult {
  index: number;
  passed: boolean;
  hidden: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
}

export interface RunCodeResult {
  passed: boolean;
  total: number;
  passedCount: number;
  results: TestCaseResult[];
}

export type MockInterviewPhase =
  | "clarify"
  | "examples"
  | "approach"
  | "code"
  | "test"
  | "review";

export interface MockInterviewRubric {
  communication: number;
  problemSolving: number;
  coding: number;
  complexity: number;
  testing: number;
  notes?: string;
}

export interface MockInterviewRecord {
  id: string;
  problemId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  testsPassed: boolean;
  rubric: MockInterviewRubric;
  phasesCompleted: MockInterviewPhase[];
}
