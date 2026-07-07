import vm from "node:vm";
import { spawn } from "node:child_process";
import type { ProblemJudgeConfig, RunCodeResult, TestCaseResult } from "@/lib/types";
import { deepEqual, formatValue } from "@/lib/deep-equal";

const RUN_TIMEOUT_MS = 5000;
const MAX_OUTPUT_BYTES = 64_000;

export type RunnableLanguage = "javascript" | "python";

export function isPythonRunnerAvailable(): boolean {
  return process.env.VERCEL !== "1" && process.env.DISABLE_PYTHON_RUNNER !== "true";
}

export function isRunnableLanguage(language: string): language is RunnableLanguage {
  if (language === "python" && !isPythonRunnerAvailable()) return false;
  return language === "javascript" || language === "python";
}

export async function runCodeTests(
  code: string,
  language: RunnableLanguage,
  config: ProblemJudgeConfig,
  includeHidden: boolean
): Promise<RunCodeResult> {
  if (language === "python") {
    return runPythonTests(code, config, includeHidden);
  }
  return runJavaScriptTests(code, config, includeHidden);
}

export function runJavaScriptTests(
  code: string,
  config: ProblemJudgeConfig,
  includeHidden: boolean
): RunCodeResult {
  const cases = filterCases(config, includeHidden);

  const results: TestCaseResult[] = cases.map((testCase) => {
    const globalIndex = config.testCases.indexOf(testCase);
    try {
      const actual = executeJavaScript(
        code,
        config.functionName,
        testCase.args
      );
      const passed = deepEqual(actual, testCase.expected);
      return buildResult(globalIndex, testCase, passed, actual);
    } catch (err) {
      return buildErrorResult(globalIndex, testCase, err);
    }
  });

  return summarize(results);
}

export async function runPythonTests(
  code: string,
  config: ProblemJudgeConfig,
  includeHidden: boolean
): Promise<RunCodeResult> {
  const cases = filterCases(config, includeHidden);

  const results: TestCaseResult[] = [];
  for (const testCase of cases) {
    const globalIndex = config.testCases.indexOf(testCase);
    try {
      const actual = await executePython(code, config.functionName, testCase.args);
      const passed = deepEqual(actual, testCase.expected);
      results.push(buildResult(globalIndex, testCase, passed, actual));
    } catch (err) {
      results.push(buildErrorResult(globalIndex, testCase, err));
    }
  }

  return summarize(results);
}

function filterCases(config: ProblemJudgeConfig, includeHidden: boolean) {
  return includeHidden
    ? config.testCases
    : config.testCases.filter((t) => !t.hidden);
}

function buildResult(
  index: number,
  testCase: ProblemJudgeConfig["testCases"][number],
  passed: boolean,
  actual: unknown
): TestCaseResult {
  return {
    index,
    passed,
    hidden: !!testCase.hidden,
    input: formatValue(testCase.args),
    expected: formatValue(testCase.expected),
    actual: formatValue(actual),
  };
}

function buildErrorResult(
  index: number,
  testCase: ProblemJudgeConfig["testCases"][number],
  err: unknown
): TestCaseResult {
  return {
    index,
    passed: false,
    hidden: !!testCase.hidden,
    input: formatValue(testCase.args),
    expected: formatValue(testCase.expected),
    error: err instanceof Error ? err.message : String(err),
  };
}

function summarize(results: TestCaseResult[]): RunCodeResult {
  const passedCount = results.filter((r) => r.passed).length;
  return {
    passed: passedCount === results.length,
    total: results.length,
    passedCount,
    results,
  };
}

function executeJavaScript(
  code: string,
  functionName: string,
  args: Record<string, unknown>
): unknown {
  const sandbox: Record<string, unknown> = {
    __args: args,
    __result: undefined,
  };

  const paramLines = Object.keys(args)
    .map((name) => `const ${name} = __args[${JSON.stringify(name)}];`)
    .join("\n");
  const callArgs = Object.keys(args).join(", ");

  const script = `
"use strict";
${code}
${paramLines}
if (typeof ${functionName} !== "function") {
  throw new Error("Function ${functionName} not found");
}
__result = ${functionName}(${callArgs});
`;

  vm.runInNewContext(script, sandbox, {
    timeout: RUN_TIMEOUT_MS,
    displayErrors: true,
  });

  return sandbox.__result;
}

function executePython(
  code: string,
  functionName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const script = `import json
import sys

${code}

if not callable(${functionName}):
    raise Exception("Function ${functionName} not found")

args = json.loads(sys.stdin.read())
result = ${functionName}(**args)
print(json.dumps(result))
`;

  return new Promise((resolve, reject) => {
    const pythonCmd = process.platform === "win32" ? "python" : "python3";
    const proc = spawn(pythonCmd, ["-c", script], {
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        PYTHONDONTWRITEBYTECODE: "1",
        PYTHONUNBUFFERED: "1",
      },
    });

    let stdout = "";
    let stderr = "";
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      proc.kill("SIGKILL");
      reject(new Error(`Execution timed out after ${RUN_TIMEOUT_MS / 1000}s`));
    }, RUN_TIMEOUT_MS);

    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
      if (stdout.length > MAX_OUTPUT_BYTES) {
        killed = true;
        proc.kill("SIGKILL");
        reject(new Error("Output limit exceeded"));
      }
    });

    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
      if (stderr.length > MAX_OUTPUT_BYTES) {
        killed = true;
        proc.kill("SIGKILL");
        reject(new Error("Error output limit exceeded"));
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      if (err.message.includes("ENOENT")) {
        reject(new Error("Python 3 is not installed on the server"));
      } else {
        reject(err);
      }
    });

    proc.on("close", (exitCode) => {
      clearTimeout(timer);
      if (killed) return;

      if (exitCode !== 0) {
        const message = stderr.trim() || `Python exited with code ${exitCode}`;
        reject(new Error(message.split("\n").slice(-3).join("\n")));
        return;
      }

      const trimmed = stdout.trim();
      if (!trimmed) {
        reject(new Error("No output from solution"));
        return;
      }

      try {
        resolve(JSON.parse(trimmed));
      } catch {
        reject(new Error(`Invalid JSON output: ${trimmed.slice(0, 200)}`));
      }
    });

    proc.stdin.write(JSON.stringify(args));
    proc.stdin.end();
  });
}
