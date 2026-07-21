import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Zap,
  Library,
  Trophy,
  BarChart3,
  Bot,
  Flame,
  Timer,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { subjects, leaderboard } from "@/data/quiz";

export const Route = createFileRoute("/quiz/")({
  component: QuizHub,
});

const features = [
  { to: "/quiz/quick-practice" as const, icon: Zap, title: "Quick practice", desc: "10 questions · 5 minutes" },
  { to: "/quiz/mock-test" as const, icon: Timer, title: "Mock test", desc: "Build your own exam" },
  { to: "/quiz/question-bank" as const, icon: Library, title: "Question bank", desc: "Past papers, searchable" },
  { to: "/quiz/ai-solver" as const, icon: Bot, title: "AI solver", desc: "Ask, get step-by-step" },
  { to: "/quiz/leaderboard" as const, icon: Trophy, title: "Leaderboard", desc: "See where you stand" },
  { to: "/quiz/progress" as const, icon: BarChart3, title: "Your progress", desc: "Accuracy over time" },
];

function QuizHub() {
  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-8">
        {/* Header */}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Learns Academy</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Good to see you, Rayan.</h1>
            <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off, or try something new.</p>
          </div>
        </div>

        {/* Today card */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Today</p>
              <p className="mt-1 text-lg font-medium">Daily challenge · 10 questions</p>
              <p className="mt-0.5 text-sm text-muted-foreground">About 6 minutes. Earn 50 XP.</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-600 dark:text-orange-400">
              <Flame className="h-3.5 w-3.5" /> 14-day streak
            </div>
          </div>
          <Link
            to="/quiz/quick-practice"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Start now <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Quick stats */}
        <section className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Level" value="12" />
          <Stat label="XP" value="1,240" />
          <Stat label="Accuracy" value="78%" />
        </section>

        {/* Features */}
        <section className="mt-10">
          <SectionHeader title="Everything you need" />
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {features.map((f, i) => (
              <motion.div
                key={f.to}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i }}
              >
                <Link to={f.to} className="group flex items-center gap-4 p-4 transition hover:bg-muted/50">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Subjects */}
        <section className="mt-10">
          <SectionHeader title="Practice by subject" action={{ to: "/quiz/question-bank", label: "Browse all" }} />
          <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto pb-1">
            {subjects.map((s) => (
              <Link
                key={s.id}
                to="/quiz/quick-practice"
                search={{ subject: s.id }}
                className="shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition hover:border-foreground/40"
              >
                <span className="mr-1.5">{s.emoji}</span>
                {s.name}
                <span className="ml-1.5 text-xs text-muted-foreground">{(s.questions / 1000).toFixed(1)}k</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section className="mt-10">
          <SectionHeader title="This week's top" action={{ to: "/quiz/leaderboard", label: "Full board" }} />
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {leaderboard.slice(0, 3).map((l) => (
              <div key={l.rank} className="flex items-center gap-3 p-4">
                <p className="w-6 text-sm tabular-nums text-muted-foreground">{l.rank}</p>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-base">{l.avatar}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{l.institute}</p>
                </div>
                <p className="text-sm tabular-nums text-foreground">{l.xp.toLocaleString()} <span className="text-xs text-muted-foreground">XP</span></p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          One question a day beats none. Keep going.
        </p>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { to: "/quiz/leaderboard" | "/quiz/question-bank"; label: string };
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {action && (
        <Link to={action.to} className="text-xs text-foreground underline-offset-4 hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  );
}
