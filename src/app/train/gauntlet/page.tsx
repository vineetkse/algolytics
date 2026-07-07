"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GauntletSession } from "@/components/GauntletSession";

function Content() {
  const searchParams = useSearchParams();
  const patternsParam = searchParams.get("patterns");
  const patternIds = patternsParam ? patternsParam.split(",").filter(Boolean) : undefined;
  const seconds = Number(searchParams.get("seconds")) || 60;

  return <GauntletSession patternIds={patternIds} seconds={seconds} />;
}

export default function GauntletPage() {
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
