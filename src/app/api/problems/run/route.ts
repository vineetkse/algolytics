import { NextResponse } from "next/server";
import { getJudgeConfig } from "@/data/problems/judge-config";
import { runCodeTests, isRunnableLanguage } from "@/lib/code-runner";
import { requireSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    await requireSession();

    const body = await request.json();
    const { problemId, code, language, submit } = body as {
      problemId: string;
      code: string;
      language: string;
      submit?: boolean;
    };

    if (!problemId || !code || !language) {
      return NextResponse.json({ error: "Missing problemId, code, or language" }, { status: 400 });
    }

    if (!isRunnableLanguage(language)) {
      return NextResponse.json(
        {
          error:
            language === "python"
              ? "Python execution is not available on this host. Use JavaScript to Run/Submit."
              : language === "java"
                ? "Java execution is not supported yet. Use JavaScript or Python to Run/Submit."
                : `Language "${language}" is not supported for automated testing.`,
        },
        { status: 400 }
      );
    }

    const config = getJudgeConfig(problemId);
    if (!config) {
      return NextResponse.json(
        { error: "This problem does not support automated testing yet." },
        { status: 400 }
      );
    }

    if (code.length > 20000) {
      return NextResponse.json({ error: "Code too long" }, { status: 400 });
    }

    const result = await runCodeTests(code, language, config, !!submit);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Run code error:", err);
    return NextResponse.json({ error: "Failed to run code" }, { status: 500 });
  }
}
