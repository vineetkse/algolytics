import type {
  StudyPlan,
  StudyPlanDay,
  StudyPlanTask,
  StudyPlanTemplate,
  StudyGoal,
} from "@/lib/types";
import { studyPlanTemplates } from "@/data/study-plan-templates";
import { generateZeroToGooglePlan } from "@/lib/zero-to-google-plan";

// Pure study plan logic — persistence handled via /api/study-plan per user

function distributePatterns(patternIds: string[], totalDays: number): string[][] {
  const schedule: string[][] = [];
  for (let day = 0; day < totalDays; day++) {
    const primary = patternIds[day % patternIds.length];
    const secondary = patternIds[(day + Math.floor(patternIds.length / 2)) % patternIds.length];
    const patterns = primary === secondary ? [primary] : [primary, secondary];
    schedule.push(patterns);
  }
  return schedule;
}

function buildDayTasks(
  dayNumber: number,
  focusPatternIds: string[],
  minutesPerDay: number,
  goal: StudyGoal
): StudyPlanTask[] {
  const tasks: StudyPlanTask[] = [];
  const isLight = minutesPerDay <= 5;
  const isHeavy = minutesPerDay >= 20;

  tasks.push({
    id: `d${dayNumber}-spot`,
    drillType: "pattern-spot",
    count: isLight ? 5 : isHeavy ? 12 : 8,
    patternIds: focusPatternIds,
    label: `Pattern Spotter — ${focusPatternIds.length} pattern${focusPatternIds.length > 1 ? "s" : ""}`,
    completed: false,
  });

  if (!isLight) {
    tasks.push({
      id: `d${dayNumber}-signal`,
      drillType: "signal-hunt",
      count: isHeavy ? 8 : 5,
      patternIds: focusPatternIds,
      label: "Signal Hunter — keyword recognition",
      completed: false,
    });
  }

  if (dayNumber % 2 === 0 && !isLight) {
    tasks.push({
      id: `d${dayNumber}-duel`,
      drillType: "pattern-duel",
      count: isHeavy ? 6 : 4,
      patternIds: focusPatternIds,
      label: "Pattern Duel — confusion pair training",
      completed: false,
    });
  }

  if (dayNumber % 5 === 0) {
    tasks.push({
      id: `d${dayNumber}-gauntlet`,
      drillType: "timed-gauntlet",
      count: 60,
      patternIds: focusPatternIds,
      label: "Timed Gauntlet — 60s speed drill",
      completed: false,
    });
  }

  if (dayNumber % 3 === 0 || goal === "mastery" || goal === "interview-prep") {
    if (!isLight || dayNumber % 5 === 0) {
      tasks.push({
        id: `d${dayNumber}-decompose`,
        drillType: "decompose",
        count: isHeavy ? 4 : 2,
        patternIds: focusPatternIds,
        label: "Decomposition Lab — real-world scenarios",
        completed: false,
      });
    }
  }

  return tasks;
}

function generateDayTitle(dayNumber: number, patternIds: string[], goal: StudyGoal): string {
  if (dayNumber === 1) return "Day 1 — Getting Started";
  if (goal === "daily-habit") return `Day ${dayNumber} — Daily Practice`;
  if (dayNumber % 7 === 0) return `Day ${dayNumber} — Weekly Review`;
  return `Day ${dayNumber} — Pattern Focus`;
}

function generateDayDescription(patternIds: string[], dayNumber: number): string {
  const count = patternIds.length;
  if (dayNumber % 7 === 0) {
    return `Review day: reinforce ${count} pattern${count > 1 ? "s" : ""} from this week with mixed drills.`;
  }
  return `Focus on ${count} pattern${count > 1 ? "s" : ""} today. Read each problem carefully before selecting your answer.`;
}

export function generateStudyPlan(
  template: StudyPlanTemplate,
  customName?: string
): StudyPlan {
  if (template.journeyId === "zero-to-google") {
    return generateZeroToGooglePlan(customName ?? template.name);
  }

  const patternSchedule = distributePatterns(template.patternIds, template.totalDays);
  const startDate = new Date().toISOString().slice(0, 10);

  const days: StudyPlanDay[] = patternSchedule.map((focusPatternIds, index) => {
    const dayNumber = index + 1;
    return {
      dayNumber,
      title: generateDayTitle(dayNumber, focusPatternIds, template.goal),
      description: generateDayDescription(focusPatternIds, dayNumber),
      focusPatternIds,
      tasks: buildDayTasks(dayNumber, focusPatternIds, template.minutesPerDay, template.goal),
      completed: false,
    };
  });

  return {
    id: crypto.randomUUID(),
    name: customName ?? template.name,
    goal: template.goal,
    description: template.description,
    totalDays: template.totalDays,
    minutesPerDay: template.minutesPerDay,
    startDate,
    patternIds: template.patternIds,
    days,
    currentDay: 1,
    completedDays: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

export function createCustomStudyPlan(options: {
  name: string;
  totalDays: number;
  minutesPerDay: number;
  patternIds: string[];
  goal?: StudyGoal;
}): StudyPlan {
  const template: StudyPlanTemplate = {
    id: "custom",
    name: options.name,
    goal: options.goal ?? "custom",
    description: `Custom ${options.totalDays}-day plan focusing on ${options.patternIds.length} patterns.`,
    totalDays: options.totalDays,
    minutesPerDay: options.minutesPerDay,
    difficulty: "intermediate",
    patternIds: options.patternIds,
    highlights: [],
  };
  return generateStudyPlan(template, options.name);
}

export function getTodayDay(plan: StudyPlan): StudyPlanDay | null {
  const start = new Date(plan.startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const dayIndex = Math.min(Math.max(diffDays, 0), plan.days.length - 1);
  return plan.days[dayIndex] ?? null;
}

export function getCurrentDayNumber(plan: StudyPlan): number {
  const today = getTodayDay(plan);
  return today?.dayNumber ?? plan.currentDay;
}

export function markTaskComplete(plan: StudyPlan, taskId: string): StudyPlan {
  const updatedDays = plan.days.map((day) => {
    const updatedTasks = day.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: true, completedAt: new Date().toISOString() } : task
    );
    const allDone = updatedTasks.every((t) => t.completed);
    return {
      ...day,
      tasks: updatedTasks,
      completed: allDone,
      completedAt: allDone ? new Date().toISOString() : day.completedAt,
    };
  });

  const completedDays = updatedDays.filter((d) => d.completed).length;

  return {
    ...plan,
    days: updatedDays,
    completedDays,
    currentDay: getCurrentDayNumber({ ...plan, days: updatedDays }),
  };
}

export function getPlanProgress(plan: StudyPlan): {
  completedDays: number;
  totalDays: number;
  percent: number;
  todayComplete: boolean;
} {
  const today = getTodayDay(plan);
  const completedDays = plan.days.filter((d) => d.completed).length;
  const todayComplete = today?.tasks.every((t) => t.completed) ?? false;
  return {
    completedDays,
    totalDays: plan.totalDays,
    percent: Math.round((completedDays / plan.totalDays) * 100),
    todayComplete,
  };
}

export function getTaskMeta(task: StudyPlanTask): string {
  switch (task.drillType) {
    case "solve-problem":
      return "1 coding problem";
    case "read-pattern":
      return "Study pattern";
    case "foundation":
      return "Foundation lesson";
    case "daily-workout":
      return "3-step workout";
    case "mock-interview":
      return "45-min mock";
    case "reflect":
      return "Reflection";
    case "timed-gauntlet":
      return `${task.count}s sprint`;
    default:
      return `${task.count} drills`;
  }
}

export function isReflectTask(task: StudyPlanTask): boolean {
  return task.drillType === "reflect";
}

export function getTaskTrainUrl(task: StudyPlanTask): string {
  const params = new URLSearchParams();
  params.set("taskId", task.id);

  switch (task.drillType) {
    case "foundation":
      return `/journey/foundation/${task.foundationDay ?? task.count}?${params}`;
    case "read-pattern": {
      const pid = task.patternIds?.[0];
      if (pid) params.set("expand", pid);
      return `/patterns?${params}`;
    }
    case "solve-problem":
      return `/problems/${task.problemId}?${params}`;
    case "daily-workout":
      return `/train/daily?${params}`;
    case "mock-interview":
      return `/mock?${params}`;
    case "reflect":
      return "";
    default:
      break;
  }

  const typeMap: Record<string, string> = {
    "pattern-spot": "pattern-spot",
    "signal-hunt": "signal-hunt",
    decompose: "decompose",
    "pattern-duel": "pattern-duel",
    "timed-gauntlet": "gauntlet",
  };
  const base = `/train/${typeMap[task.drillType] ?? "pattern-spot"}`;
  if (task.drillType === "timed-gauntlet") {
    params.set("seconds", String(task.count));
  } else {
    params.set("count", String(task.count));
  }
  if (task.patternIds?.length) {
    params.set("patterns", task.patternIds.join(","));
  }
  return `${base}?${params.toString()}`;
}

export { studyPlanTemplates };
