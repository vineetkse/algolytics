import Link from "next/link";

const modes = [
  {
    id: "daily",
    title: "Daily Brain Workout",
    subtitle: "Expert pipeline",
    description:
      "Your personalized 3-step session: spaced repetition on weak patterns, confusion duels, then a 60s timed gauntlet.",
    href: "/train/daily",
    duration: "~10 min",
    count: "3",
    color: "from-accent/30 to-accent/5",
    featured: true,
  },
  {
    id: "pattern-spot",
    title: "Pattern Spotter",
    subtitle: "Core training",
    description:
      "Read problem descriptions and identify the algorithmic pattern. The most important skill for interviews and real engineering.",
    href: "/train/pattern-spot",
    duration: "~8 min",
    count: "35",
    color: "from-accent/20 to-accent/5",
  },
  {
    id: "pattern-duel",
    title: "Pattern Duel",
    subtitle: "Confusion training",
    description:
      "Two similar patterns, one problem. Learn to separate confusable techniques — the skill experts have that juniors lack.",
    href: "/train/pattern-duel",
    duration: "~6 min",
    count: "18",
    color: "from-indigo-500/30 to-indigo-500/5",
  },
  {
    id: "gauntlet",
    title: "Timed Gauntlet",
    subtitle: "Pressure training",
    description:
      "60 seconds. Identify as many patterns as possible. Builds interview speed and reflexes under time pressure.",
    href: "/train/gauntlet",
    duration: "60 sec",
    count: "∞",
    color: "from-warning/30 to-warning/5",
  },
  {
    id: "signal-hunt",
    title: "Signal Hunter",
    subtitle: "Speed training",
    description:
      "Given keyword signals from a problem, rapidly identify the matching pattern. Builds instant recognition reflexes.",
    href: "/train/signal-hunt",
    duration: "~5 min",
    count: "20",
    color: "from-indigo-500/20 to-indigo-500/5",
  },
  {
    id: "decompose",
    title: "Decomposition Lab",
    subtitle: "Advanced training",
    description:
      "Face real-world scenarios. Learn to decompose unfamiliar problems into steps before matching a pattern.",
    href: "/train/decompose",
    duration: "~6 min",
    count: "12",
    color: "from-warning/20 to-warning/5",
  },
];

export default function TrainPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Training Center</h1>
        <p className="mt-3 text-muted">
          Six training modes targeting different expert cognitive skills. Start with the Daily
          Brain Workout for maximum impact.
        </p>
      </div>

      <Link
        href="/train/daily"
        className="mt-10 flex items-center justify-between rounded-2xl border-2 border-accent/40 bg-accent/5 p-6 transition-all hover:border-accent/60 glow-accent"
      >
        <div>
          <h2 className="font-semibold text-accent">⚡ Daily Brain Workout</h2>
          <p className="mt-1 text-sm text-muted">
            Spaced repetition → Pattern Duel → Timed Gauntlet. Personalized to your weak patterns.
          </p>
        </div>
        <span className="text-accent text-xl">→</span>
      </Link>

      <div className="mt-10 space-y-6">
        {modes.filter((m) => m.id !== "daily").map((mode) => (
          <Link
            key={mode.id}
            href={mode.href}
            className="group flex items-start gap-6 rounded-2xl border border-border bg-surface p-8 transition-all hover:border-accent/40"
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${mode.color} text-xl font-bold text-accent`}
            >
              {mode.count}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold group-hover:text-accent transition-colors">
                  {mode.title}
                </h2>
                <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-xs text-muted">
                  {mode.subtitle}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted leading-relaxed">{mode.description}</p>
              <span className="mt-3 inline-block text-xs text-muted font-mono">{mode.duration}</span>
            </div>
            <span className="text-muted group-hover:text-accent transition-colors">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
