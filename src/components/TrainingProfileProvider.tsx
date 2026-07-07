"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface TrainingProfile {
  profileId: string;
  codeHint: string;
}

interface TrainingProfileContextValue {
  profile: TrainingProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  deleteProfile: (code: string) => Promise<void>;
}

const TrainingProfileContext = createContext<TrainingProfileContextValue | null>(null);

export function TrainingProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<TrainingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/access/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setProfile({ profileId: data.profileId, codeHint: data.codeHint });
        } else {
          setProfile(null);
        }
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = async () => {
    await fetch("/api/access/me", { method: "DELETE" });
    setProfile(null);
  };

  const deleteProfile = async (code: string) => {
    const res = await fetch("/api/access/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Failed to delete profile");
    }
    setProfile(null);
  };

  return (
    <TrainingProfileContext.Provider
      value={{
        profile,
        loading,
        isAuthenticated: !!profile,
        refresh,
        logout,
        deleteProfile,
      }}
    >
      {children}
    </TrainingProfileContext.Provider>
  );
}

export function useTrainingProfile() {
  const ctx = useContext(TrainingProfileContext);
  if (!ctx) {
    throw new Error("useTrainingProfile must be used within TrainingProfileProvider");
  }
  return ctx;
}
