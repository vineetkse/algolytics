"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudyPlan } from "@/lib/types";
import { useTrainingProfile } from "@/components/TrainingProfileProvider";

const LOCAL_PLAN_KEY = "algolytics-study-plan";

export function useUserStudyPlan() {
  const { profile, loading: authLoading, isAuthenticated } = useTrainingProfile();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    if (!profile) {
      setPlan(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/study-plan");
      if (res.ok) {
        const data = await res.json();
        setPlan(data);

        if (!data) {
          const localRaw = localStorage.getItem(LOCAL_PLAN_KEY);
          if (localRaw) {
            const local = JSON.parse(localRaw) as StudyPlan;
            const saveRes = await fetch("/api/study-plan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(local),
            });
            if (saveRes.ok) {
              const saved = await saveRes.json();
              setPlan(saved);
              localStorage.removeItem(LOCAL_PLAN_KEY);
            }
          }
        }
      }
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    fetchPlan();
  }, [authLoading, fetchPlan]);

  const savePlan = async (newPlan: StudyPlan) => {
    const res = await fetch("/api/study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlan),
    });
    if (res.ok) {
      const saved = await res.json();
      setPlan(saved);
      return saved;
    }
    throw new Error("Failed to save study plan");
  };

  const markTaskComplete = async (taskId: string) => {
    const res = await fetch("/api/study-plan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markTaskComplete", taskId }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPlan(updated);
      return updated;
    }
    throw new Error("Failed to update study plan");
  };

  const deletePlan = async () => {
    const res = await fetch("/api/study-plan", { method: "DELETE" });
    if (res.ok) {
      setPlan(null);
    }
  };

  return {
    plan,
    loading: authLoading || loading,
    isAuthenticated,
    profile,
    savePlan,
    markTaskComplete,
    deletePlan,
    refresh: fetchPlan,
  };
}
