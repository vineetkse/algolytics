import type { StudyPlan, StudyPlanDay, StudyPlanTask } from "@/lib/types";
import {
  getPhaseForDay,
  getWeekNumber,
  patternLearningOrder,
  beginnerProblemRotation,
  intermediateProblemRotation,
  advancedProblemRotation,
  JOURNEY_TOTAL_DAYS,
} from "@/data/journey/phases";

function pickRotating<T extends string>(list: readonly T[], index: number): T {
  return list[index % list.length];
}

function patternForDay(dayNumber: number, phaseStart: number): string {
  const idx = Math.floor((dayNumber - phaseStart) / 2);
  return pickRotating(patternLearningOrder, idx);
}

function buildFoundationDay(dayNumber: number): StudyPlanDay {
  const phase = getPhaseForDay(dayNumber);
  const week = getWeekNumber(dayNumber);
  const tasks: StudyPlanTask[] = [
    {
      id: `d${dayNumber}-foundation`,
      drillType: "foundation",
      count: dayNumber,
      foundationDay: dayNumber,
      label: `Foundation Lesson ${dayNumber} — coding mindset`,
      completed: false,
    },
  ];

  if (dayNumber >= 15) {
    const pid = pickRotating(patternLearningOrder, dayNumber - 15);
    tasks.push({
      id: `d${dayNumber}-read`,
      drillType: "read-pattern",
      count: 1,
      patternIds: [pid],
      label: `Read pattern: preview concepts`,
      completed: false,
    });
  }

  if (dayNumber >= 18) {
    tasks.push({
      id: `d${dayNumber}-spot`,
      drillType: "pattern-spot",
      count: 3,
      patternIds: ["two-pointers", "sliding-window"],
      label: "Pattern Spotter — first 3 beginner drills",
      completed: false,
    });
  }

  if (dayNumber === 21) {
    tasks.push({
      id: `d${dayNumber}-reflect`,
      drillType: "reflect",
      count: 0,
      reflectPrompt: "Phase 1 complete. Set your daily training time and Phase 2 accuracy goal (70%).",
      label: "Reflect — commit to Phase 2",
      completed: false,
    });
  }

  const milestone =
    dayNumber === 7
      ? "Week 1 complete — think like a coder"
      : dayNumber === 14
        ? "Week 2 complete — data structure instincts"
        : dayNumber === 21
          ? "Phase 1 complete — ready for pattern training"
          : undefined;

  return {
    dayNumber,
    title: `Day ${dayNumber} — ${phase.name}`,
    description:
      dayNumber <= 14
        ? "Build coding fundamentals. No interview pressure — learn to think in precise steps."
        : "Finish foundations and preview your first patterns. Still no coding problems — recognition comes first.",
    focusPatternIds:
      dayNumber >= 15
        ? [pickRotating(patternLearningOrder, dayNumber - 15)]
        : [],
    tasks,
    completed: false,
    phase: phase.name,
    phaseNumber: phase.number,
    weekNumber: week,
    milestone,
    minutesEstimate: phase.minutesPerDay,
  };
}

function buildPatternEyesDay(dayNumber: number): StudyPlanDay {
  const phase = getPhaseForDay(dayNumber);
  const week = getWeekNumber(dayNumber);
  const dayInPhase = dayNumber - phase.startDay;
  const focusIdx = Math.floor(dayInPhase / 2);
  const primary = pickRotating(patternLearningOrder, focusIdx);
  const secondary = pickRotating(patternLearningOrder, focusIdx + 4);
  const focusIds = primary === secondary ? [primary] : [primary, secondary];

  const spotCount = dayInPhase < 14 ? 5 : 8;
  const signalCount = dayInPhase < 14 ? 4 : 6;

  const tasks: StudyPlanTask[] = [
    {
      id: `d${dayNumber}-read`,
      drillType: "read-pattern",
      count: 1,
      patternIds: [primary],
      label: `Study pattern — read signals & mental model`,
      completed: false,
    },
    {
      id: `d${dayNumber}-spot`,
      drillType: "pattern-spot",
      count: spotCount,
      patternIds: focusIds,
      label: `Pattern Spotter — ${spotCount} drills`,
      completed: false,
    },
    {
      id: `d${dayNumber}-signal`,
      drillType: "signal-hunt",
      count: signalCount,
      patternIds: focusIds,
      label: `Signal Hunter — keyword recognition`,
      completed: false,
    },
  ];

  if (dayNumber % 7 === 0) {
    tasks.push({
      id: `d${dayNumber}-reflect`,
      drillType: "reflect",
      count: 0,
      reflectPrompt: `Explain "${primary}" to an imaginary junior in 3 sentences. What are the top 2 signals?`,
      label: "Reflect — teach the pattern out loud",
      completed: false,
    });
  }

  if (dayNumber >= 42) {
    tasks.push({
      id: `d${dayNumber}-duel`,
      drillType: "pattern-duel",
      count: 3,
      patternIds: focusIds,
      label: "Pattern Duel — light confusion practice",
      completed: false,
    });
  }

  const milestone =
    dayNumber === 49 ? "Phase 2 complete — you see patterns before code" : undefined;

  return {
    dayNumber,
    title: `Day ${dayNumber} — Pattern Eyes`,
    description:
      "Train recognition only. Read the pattern, then drill until naming it feels automatic. Do not open the code editor today.",
    focusPatternIds: focusIds,
    tasks,
    completed: false,
    phase: phase.name,
    phaseNumber: phase.number,
    weekNumber: week,
    milestone,
    minutesEstimate: phase.minutesPerDay,
  };
}

function buildThinkThenCodeDay(dayNumber: number): StudyPlanDay {
  const phase = getPhaseForDay(dayNumber);
  const week = getWeekNumber(dayNumber);
  const dayInPhase = dayNumber - phase.startDay;
  const focusIdx = Math.floor(dayInPhase / 3);
  const focusIds = [
    pickRotating(patternLearningOrder, focusIdx),
    pickRotating(patternLearningOrder, focusIdx + 2),
  ];
  const problemId = pickRotating(beginnerProblemRotation, dayInPhase);

  const tasks: StudyPlanTask[] = [
    {
      id: `d${dayNumber}-workout`,
      drillType: "daily-workout",
      count: 1,
      label: "Daily Brain Workout — spaced repetition",
      completed: false,
    },
    {
      id: `d${dayNumber}-spot`,
      drillType: "pattern-spot",
      count: 4,
      patternIds: focusIds,
      label: "Pattern Spotter — warm up (4 drills)",
      completed: false,
    },
    {
      id: `d${dayNumber}-problem`,
      drillType: "solve-problem",
      count: 1,
      problemId,
      patternIds: focusIds,
      label: `Solve beginner problem — guess pattern first`,
      completed: false,
    },
  ];

  if (dayNumber % 5 === 0) {
    tasks.push({
      id: `d${dayNumber}-decompose`,
      drillType: "decompose",
      count: 2,
      patternIds: focusIds,
      label: "Decomposition Lab — break down scenarios",
      completed: false,
    });
  }

  if (dayNumber % 7 === 0) {
    tasks.push({
      id: `d${dayNumber}-reflect`,
      drillType: "reflect",
      count: 0,
      reflectPrompt:
        "After solving today: what pattern did you use? What was brute force? What was time complexity?",
      label: "Reflect — explain your solution out loud",
      completed: false,
    });
  }

  const milestone =
    dayNumber === 91 ? "Phase 3 complete — you connect patterns to code" : undefined;

  return {
    dayNumber,
    title: `Day ${dayNumber} — Think Then Code`,
    description:
      "Daily workout + one beginner problem. Always identify the pattern BEFORE coding. Mark solved only when you understand why it works.",
    focusPatternIds: focusIds,
    tasks,
    completed: false,
    phase: phase.name,
    phaseNumber: phase.number,
    weekNumber: week,
    milestone,
    minutesEstimate: phase.minutesPerDay,
  };
}

function buildBuildDepthDay(dayNumber: number): StudyPlanDay {
  const phase = getPhaseForDay(dayNumber);
  const week = getWeekNumber(dayNumber);
  const dayInPhase = dayNumber - phase.startDay;
  const focusIds = [
    pickRotating(patternLearningOrder, dayInPhase),
    pickRotating(patternLearningOrder, dayInPhase + 5),
  ];
  const problemId = pickRotating(intermediateProblemRotation, dayInPhase);

  const tasks: StudyPlanTask[] = [
    {
      id: `d${dayNumber}-workout`,
      drillType: "daily-workout",
      count: 1,
      label: "Daily Brain Workout",
      completed: false,
    },
    {
      id: `d${dayNumber}-duel`,
      drillType: "pattern-duel",
      count: 4,
      patternIds: focusIds,
      label: "Pattern Duel — separate confusable patterns",
      completed: false,
    },
    {
      id: `d${dayNumber}-problem`,
      drillType: "solve-problem",
      count: 1,
      problemId,
      patternIds: focusIds,
      label: "Solve intermediate problem",
      completed: false,
    },
    {
      id: `d${dayNumber}-decompose`,
      drillType: "decompose",
      count: 2,
      patternIds: focusIds,
      label: "Decomposition Lab",
      completed: false,
    },
  ];

  const milestone =
    dayNumber === 119 ? "Phase 4 complete — depth and confusion handled" : undefined;

  return {
    dayNumber,
    title: `Day ${dayNumber} — Build Depth`,
    description:
      "Duels train you to tell similar patterns apart. Intermediate problems test real implementation. Decompose before you code.",
    focusPatternIds: focusIds,
    tasks,
    completed: false,
    phase: phase.name,
    phaseNumber: phase.number,
    weekNumber: week,
    milestone,
    minutesEstimate: phase.minutesPerDay,
  };
}

function buildInterviewSpeedDay(dayNumber: number): StudyPlanDay {
  const phase = getPhaseForDay(dayNumber);
  const week = getWeekNumber(dayNumber);
  const dayInPhase = dayNumber - phase.startDay;
  const focusIds = patternLearningOrder.slice(0, 8) as unknown as string[];
  const useIntermediate = dayInPhase % 2 === 0;
  const problemId = useIntermediate
    ? pickRotating(intermediateProblemRotation, dayInPhase)
    : pickRotating(beginnerProblemRotation, dayInPhase);

  const tasks: StudyPlanTask[] = [
    {
      id: `d${dayNumber}-workout`,
      drillType: "daily-workout",
      count: 1,
      label: "Daily Brain Workout",
      completed: false,
    },
    {
      id: `d${dayNumber}-duel`,
      drillType: "pattern-duel",
      count: 5,
      patternIds: focusIds,
      label: "Pattern Duel — speed round",
      completed: false,
    },
    {
      id: `d${dayNumber}-problem`,
      drillType: "solve-problem",
      count: 1,
      problemId,
      label: `Solve problem — talk through approach aloud`,
      completed: false,
    },
  ];

  if (dayNumber % 7 === 0) {
    tasks.push({
      id: `d${dayNumber}-gauntlet`,
      drillType: "timed-gauntlet",
      count: 60,
      patternIds: focusIds,
      label: "Timed Gauntlet — 60 second sprint",
      completed: false,
    });
  }

  if (dayNumber % 3 === 0) {
    tasks.push({
      id: `d${dayNumber}-decompose`,
      drillType: "decompose",
      count: 2,
      patternIds: focusIds,
      label: "Decomposition Lab",
      completed: false,
    });
  }

  const milestone =
    dayNumber === 147 ? "Phase 5 complete — fast under pressure" : undefined;

  return {
    dayNumber,
    title: `Day ${dayNumber} — Interview Speed`,
    description:
      "Practice like the clock is running. State the pattern in under 30 seconds. Verbalize approach before coding.",
    focusPatternIds: focusIds,
    tasks,
    completed: false,
    phase: phase.name,
    phaseNumber: phase.number,
    weekNumber: week,
    milestone,
    minutesEstimate: phase.minutesPerDay,
  };
}

function buildGoogleReadyDay(dayNumber: number): StudyPlanDay {
  const phase = getPhaseForDay(dayNumber);
  const week = getWeekNumber(dayNumber);
  const dayInPhase = dayNumber - phase.startDay;
  const weakReview = pickRotating(patternLearningOrder, dayInPhase);
  const useAdvanced = dayInPhase % 3 === 0;
  const problemId = useAdvanced
    ? pickRotating(advancedProblemRotation, dayInPhase)
    : pickRotating(intermediateProblemRotation, dayInPhase);

  const tasks: StudyPlanTask[] = [
    {
      id: `d${dayNumber}-workout`,
      drillType: "daily-workout",
      count: 1,
      label: "Daily Brain Workout — weak spot review",
      completed: false,
    },
    {
      id: `d${dayNumber}-read`,
      drillType: "read-pattern",
      count: 1,
      patternIds: [weakReview],
      label: `Review pattern — ${weakReview.replace(/-/g, " ")}`,
      completed: false,
    },
    {
      id: `d${dayNumber}-spot`,
      drillType: "pattern-spot",
      count: 5,
      patternIds: [weakReview],
      label: "Pattern Spotter — review drill",
      completed: false,
    },
    {
      id: `d${dayNumber}-problem`,
      drillType: "solve-problem",
      count: 1,
      problemId,
      label: useAdvanced ? "Solve advanced problem" : "Solve intermediate problem",
      completed: false,
    },
  ];

  if (dayNumber % 2 === 0) {
    tasks.push({
      id: `d${dayNumber}-mock`,
      drillType: "mock-interview",
      count: 1,
      label: "Mock coding interview — 45 min simulation",
      completed: false,
    });
  }

  if (dayNumber % 2 === 1) {
    tasks.push({
      id: `d${dayNumber}-reflect`,
      drillType: "reflect",
      count: 0,
      reflectPrompt:
        "Mock interview checklist: (1) Clarify input/output (2) 2 examples (3) brute force (4) optimize (5) code (6) test edge cases. Run through with today's problem.",
      label: "Reflect — mock interview walkthrough",
      completed: false,
    });
  }

  if (dayNumber === 168) {
    tasks.push({
      id: `d${dayNumber}-reflect-final`,
      drillType: "reflect",
      count: 0,
      reflectPrompt:
        "Journey complete. Schedule a real mock interview this week. List your 3 weakest patterns to maintain monthly.",
      label: "Celebrate — you're interview-ready",
      completed: false,
    });
  }

  const milestone =
    dayNumber === 168 ? "Journey complete — 24 weeks of smart training" : undefined;

  return {
    dayNumber,
    title: dayNumber === 168 ? "Day 168 — Graduation" : `Day ${dayNumber} — Google Ready`,
    description:
      "Polish and simulate. Review weak patterns, solve mixed problems, practice talking through your thinking like you're in the room.",
    focusPatternIds: [weakReview],
    tasks,
    completed: false,
    phase: phase.name,
    phaseNumber: phase.number,
    weekNumber: week,
    milestone,
    minutesEstimate: phase.minutesPerDay,
  };
}

function buildJourneyDay(dayNumber: number): StudyPlanDay {
  const phase = getPhaseForDay(dayNumber);
  switch (phase.id) {
    case "foundations":
      return buildFoundationDay(dayNumber);
    case "pattern-eyes":
      return buildPatternEyesDay(dayNumber);
    case "think-then-code":
      return buildThinkThenCodeDay(dayNumber);
    case "build-depth":
      return buildBuildDepthDay(dayNumber);
    case "interview-speed":
      return buildInterviewSpeedDay(dayNumber);
    case "google-ready":
      return buildGoogleReadyDay(dayNumber);
    default:
      return buildFoundationDay(dayNumber);
  }
}

export function generateZeroToGooglePlan(customName?: string): StudyPlan {
  const days: StudyPlanDay[] = [];
  for (let d = 1; d <= JOURNEY_TOTAL_DAYS; d++) {
    days.push(buildJourneyDay(d));
  }

  const startDate = new Date().toISOString().slice(0, 10);

  return {
    id: crypto.randomUUID(),
    name: customName ?? "Zero to Google — 24 Week Journey",
    goal: "zero-to-google",
    description:
      "A 168-day path from absolute beginner to interview-ready. Six phases: code foundations → pattern recognition → implementation → depth → speed → Google polish. Makes you think smart, not memorize answers.",
    totalDays: JOURNEY_TOTAL_DAYS,
    minutesPerDay: 30,
    startDate,
    patternIds: [...patternLearningOrder],
    days,
    currentDay: 1,
    completedDays: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    journeyId: "zero-to-google",
  };
}
