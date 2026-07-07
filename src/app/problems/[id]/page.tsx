import { codingProblems, getProblemById } from "@/data/problems";
import { ProblemWorkspace } from "@/components/ProblemWorkspace";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return codingProblems.map((p) => ({ id: p.id }));
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) notFound();

  return <ProblemWorkspace problem={problem} />;
}
