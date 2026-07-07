"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DrillSession } from "@/components/DrillSession";
import type { DrillType } from "@/lib/types";

interface DrillPageProps {
  drillType: DrillType;
  defaultCount: number;
}

function DrillPageContent({ drillType, defaultCount }: DrillPageProps) {
  const searchParams = useSearchParams();
  const count = Number(searchParams.get("count")) || defaultCount;
  const patternsParam = searchParams.get("patterns");
  const patternIds = patternsParam ? patternsParam.split(",").filter(Boolean) : undefined;
  const taskId = searchParams.get("taskId") ?? undefined;

  return (
    <DrillSession
      drillType={drillType}
      count={count}
      patternIds={patternIds}
      taskId={taskId}
    />
  );
}

export function DrillPage({ drillType, defaultCount }: DrillPageProps) {
  return (
    <div className="px-6 py-16">
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        }
      >
        <DrillPageContent drillType={drillType} defaultCount={defaultCount} />
      </Suspense>
    </div>
  );
}
