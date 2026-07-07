"use client";

import { Suspense } from "react";
import { MockInterviewSession } from "@/components/MockInterviewSession";
import { AuthRequired } from "@/components/AuthRequired";

export default function MockSessionPage() {
  return (
    <AuthRequired
      title="Get your training code"
      description="Sign in with your training code to run a mock interview."
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        }
      >
        <MockInterviewSession />
      </Suspense>
    </AuthRequired>
  );
}
