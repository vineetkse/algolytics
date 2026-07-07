"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PatternDuelSession } from "@/components/PatternDuelSession";

function Content() {
  const searchParams = useSearchParams();
  const count = Number(searchParams.get("count")) || 8;
  const patternsParam = searchParams.get("patterns");
  const patternIds = patternsParam ? patternsParam.split(",").filter(Boolean) : undefined;
  const taskId = searchParams.get("taskId") ?? undefined;

  return (
    <PatternDuelSession count={count} patternIds={patternIds} taskId={taskId} />
  );
}

export default function PatternDuelPage() {
  return (
    <div className="px-6 py-16">
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        }
      >
        <Content />
      </Suspense>
    </div>
  );
}
