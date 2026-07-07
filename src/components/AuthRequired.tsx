"use client";

import Link from "next/link";
import { useTrainingProfile } from "@/components/TrainingProfileProvider";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Button } from "./Button";

interface AuthRequiredProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthRequired({
  children,
  title = "Get your training code",
  description = "Generate a unique code to save your progress, study plans, and pattern mastery. No email needed — just save your code.",
}: AuthRequiredProps) {
  const { isAuthenticated, loading } = useUserProgress();

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-2xl">
          🔑
        </div>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-muted leading-relaxed">{description}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Button href="/access" size="lg">
            Generate Training Code
          </Button>
          <Link href="/access" className="text-sm text-accent hover:underline">
            Already have a code? Enter it here
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
