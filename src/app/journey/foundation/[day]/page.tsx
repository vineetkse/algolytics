import { Suspense } from "react";
import { foundationLessons } from "@/data/journey/foundation-lessons";
import { FoundationLessonView } from "@/components/FoundationLessonView";

export function generateStaticParams() {
  return foundationLessons.map((l) => ({ day: String(l.day) }));
}

export default async function FoundationLessonPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const dayNum = parseInt(day, 10);
  const lesson = foundationLessons.find((l) => l.day === dayNum);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <p className="mt-2 text-muted">Foundation lessons are days 1–21.</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <FoundationLessonView lesson={lesson} />
    </Suspense>
  );
}
