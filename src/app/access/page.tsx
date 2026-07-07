"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrainingProfile } from "@/components/TrainingProfileProvider";
import { Button } from "@/components/Button";

function AuthenticatedAccess({ codeHint }: { codeHint: string }) {
  const router = useRouter();
  const { logout, deleteProfile } = useTrainingProfile();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCode, setDeleteCode] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteProfile(deleteCode);
      router.push("/");
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete profile.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-3xl">
          ✓
        </span>
        <h1 className="mt-6 text-2xl font-bold">You&apos;re in</h1>
        <p className="mt-2 text-muted">
          Training profile active · code ending in{" "}
          <span className="font-mono text-accent">{codeHint}</span>
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button href="/study-plan" size="lg">
          Go to Study Plan
        </Button>
        <Button href="/train" variant="secondary" size="lg">
          Start Training
        </Button>
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-xl px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          Switch to a different code
        </button>
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-semibold text-error">Delete profile</h2>
        <p className="mt-2 text-sm text-muted">
          Permanently delete this training code and all progress — drills, problems, study plan,
          and mock interviews. This cannot be undone.
        </p>

        {!showDelete ? (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="mt-4 rounded-lg border border-error/30 px-4 py-2 text-sm text-error hover:border-error/50 transition-colors"
          >
            Delete my profile
          </button>
        ) : (
          <form onSubmit={handleDelete} className="mt-4 space-y-3">
            {deleteError && (
              <div className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
                {deleteError}
              </div>
            )}
            <p className="text-xs text-muted">
              Enter your full training code to confirm deletion.
            </p>
            <input
              type="text"
              value={deleteCode}
              onChange={(e) => setDeleteCode(e.target.value.toUpperCase())}
              placeholder="ALGO-XXXX-XXXX"
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 font-mono text-center tracking-wider outline-none focus:border-error/50 transition-colors"
              required
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 !bg-error hover:!bg-error/90"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Permanently delete"}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowDelete(false);
                  setDeleteCode("");
                  setDeleteError("");
                }}
                className="rounded-xl border border-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AccessPage() {
  const router = useRouter();
  const { isAuthenticated, profile, refresh } = useTrainingProfile();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/access/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to generate code.");
        return;
      }
      setNewCode(data.code);
      await refresh();
    } catch {
      setError("Failed to generate code. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleEnter(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/access/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid training code.");
        return;
      }
      await refresh();
      router.push("/study-plan");
    } catch {
      setError("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (newCode) {
      navigator.clipboard.writeText(newCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (newCode) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <div className="text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-3xl">
            🔑
          </span>
          <h1 className="mt-6 text-3xl font-bold">Save Your Training Code</h1>
          <p className="mt-3 text-muted leading-relaxed">
            This code is your key to Algolytics. Save it somewhere safe — you&apos;ll need it
            to access your progress on other devices.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border-2 border-accent/40 bg-accent/5 p-8 text-center glow-accent">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Your Training Code
          </p>
          <p className="mt-3 font-mono text-3xl font-bold tracking-wider text-accent">
            {newCode}
          </p>
          <button
            onClick={handleCopy}
            className="mt-6 rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-medium hover:border-accent/40 transition-colors"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-warning/20 bg-warning/5 p-4 text-sm text-muted">
          <strong className="text-warning">Important:</strong> We cannot recover your code if you
          lose it. Store it in your notes, password manager, or take a screenshot.
        </div>

        <Button href="/study-plan" size="lg" className="mt-8 w-full">
          Continue to Study Plan
        </Button>
      </div>
    );
  }

  if (isAuthenticated && profile) {
    return (
      <AuthenticatedAccess
        codeHint={profile.codeHint}
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Get Your Training Code</h1>
        <p className="mt-3 text-muted leading-relaxed">
          No email required. Generate a unique code to save your progress, study plan, and pattern
          mastery — use it on any device.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-8">
        <h2 className="font-semibold">New here?</h2>
        <p className="mt-2 text-sm text-muted">
          Generate a free training code and start building pattern recognition muscle memory.
        </p>
        <Button
          onClick={handleGenerate}
          size="lg"
          className="mt-6 w-full"
          disabled={generating}
        >
          {generating ? "Generating..." : "Generate Training Code"}
        </Button>
      </div>

      <div className="relative my-8 flex items-center">
        <div className="flex-1 border-t border-border" />
        <span className="px-4 text-xs text-muted">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-8">
        <h2 className="font-semibold">Returning?</h2>
        <p className="mt-2 text-sm text-muted">Enter your training code to pick up where you left off.</p>

        <form onSubmit={handleEnter} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ALGO-XXXX-XXXX"
            className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 font-mono text-center text-lg tracking-wider outline-none focus:border-accent/50 transition-colors"
            required
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Enter Training Code"}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Your code is stored securely. Only you can access your training data with it.
      </p>
    </div>
  );
}
