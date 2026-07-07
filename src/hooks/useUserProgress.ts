"use client";

import { useCallback, useEffect, useState } from "react";
import type { DrillResult, TrainingSession, UserProgress } from "@/lib/types";
import { defaultProgress } from "@/lib/progress-server";
import { useTrainingProfile } from "@/components/TrainingProfileProvider";

const LOCAL_PROGRESS_KEY = "algolytics-progress";

export function useUserProgress() {
  const { profile, loading: authLoading, isAuthenticated } = useTrainingProfile();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!profile) {
      setProgress(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        setProgress(data);

        const localRaw = localStorage.getItem(LOCAL_PROGRESS_KEY);
        if (localRaw) {
          const local = JSON.parse(localRaw) as UserProgress;
          if (local.totalDrills > 0 && data.totalDrills === 0) {
            const migrateRes = await fetch("/api/progress", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "migrate", progress: local }),
            });
            if (migrateRes.ok) {
              const migrated = await migrateRes.json();
              setProgress(migrated);
              localStorage.removeItem(LOCAL_PROGRESS_KEY);
            }
          }
        }
      }
    } catch {
      setProgress(defaultProgress);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    fetchProgress();
  }, [authLoading, fetchProgress]);

  const recordDrillResult = async (
    result: DrillResult,
    sessionId: string,
    drillType: TrainingSession["drillType"]
  ) => {
    const res = await fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "recordDrill", result, sessionId, drillType }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProgress(updated);
      return updated;
    }
    throw new Error("Failed to save progress");
  };

  const completeSession = async (sessionId: string) => {
    const res = await fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "completeSession", sessionId }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProgress(updated);
    }
  };

  const updateProblem = async (
    problemId: string,
    update: {
      status?: import("@/lib/types").ProblemStatus;
      code?: string;
      language?: string;
      verifiedSolved?: boolean;
      testsPassed?: number;
      testsTotal?: number;
    }
  ) => {
    const res = await fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateProblem", problemId, ...update }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProgress(updated);
      return updated;
    }
    throw new Error("Failed to save problem progress");
  };

  const recordMockInterview = async (
    record: import("@/lib/types").MockInterviewRecord
  ) => {
    const res = await fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "recordMockInterview", record }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProgress(updated);
      return updated;
    }
    throw new Error("Failed to save mock interview");
  };

  const resetProblem = async (problemId: string) => {
    const res = await fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resetProblem", problemId }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProgress(updated);
      return updated;
    }
    throw new Error("Failed to reset problem");
  };

  const recordDailyWorkout = async () => {
    const res = await fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "recordDailyWorkout" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProgress(updated);
      return updated;
    }
    throw new Error("Failed to record daily workout");
  };

  return {
    progress,
    loading: authLoading || loading,
    isAuthenticated,
    profile,
    recordDrillResult,
    completeSession,
    updateProblem,
    recordMockInterview,
    resetProblem,
    recordDailyWorkout,
    refresh: fetchProgress,
  };
}
