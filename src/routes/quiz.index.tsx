import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Timer,
  Library,
  Bot,
  Trophy,
  BarChart3,
  ChevronRight,
  Sparkles,
  Flame,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { subjects, leaderboard } from "@/data/quiz";

export const Route = createFileRoute("/quiz/")({
  component: QuizHub,
});

const tools = [
  { to: "/quiz/mock-test" as const, icon: Timer, title: "Mock test", desc: "Build your own exam · pick topics & time" },
  { to: "/quiz/question-bank" as const, icon: Library, title: "Question bank", desc: "Past papers, searchable by year & board" },
  { to: "/quiz/ai-solver" as const, icon: Bot, title: "AI solver", desc: "Ask, get a step-by-step walkthrough" },
  { to: "/quiz/leaderboard" as const, icon: Trophy, title: "Leaderboard", desc: "See where you stand this week" },
  { to: "/quiz/progress" as const, icon: BarChart3, title: "Your progress", desc: "Accuracy, time & growth over weeks" },
];

function QuizHub() {
  const studentName = "Rayan";
  const level = "SSC";
  const group = "Science";

  return (
    <section className="space-y-5">
      {/* Greeting strip — mirrors home surfaces */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_30px_rgb(41,44,117,0.08)]">
        <div className="flex items-start gap-4">
          <div className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
            {studentName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Study desk
            </div>
            <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              Ready when you are, {studentName}.
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a subject to start a 25-question board practice — or dip into a quick tool below.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-accent/40 px-2.5 py-1 font-medium text-primary">
                {level} · {group}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                <Flame className="h-3 w-3 text-orange-500" /> 4-day streak
              </span>
              <Link
                to="/profile"
                className="ml-auto inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
              >
                Change syllabus <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured subject — the "best tutor card" energy from home */}
      <FeaturedSubject />

      {/* Subjects — editorial list feel */}
      <div>
        <SectionHeader title="Your subjects" hint={`${subjects.length} in your syllabus`} />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {subjects.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
            >
              <Link
                to="/quiz/subject/$subjectId"
                params={{ subjectId: s.id }}
                className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-accent/25 blur-2xl transition group-hover:bg-accent/40" />
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/40 text-lg text-primary">
                    <span>{s.emoji}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.nameBn}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {(s.questions / 1000).toFixed(1)}k questions
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tools — clean divided list, like home's inner lists */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4">
          <h3 className="text-sm font-semibold text-foreground">
            More tools <span className="text-muted-foreground">· do more than practice</span>
          </h3>
        </div>
        <div className="mt-2 divide-y divide-border">
          {tools.map((t, i) => (
            <motion.div
              key={t.to}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
            >
              <Link
                to={t.to}
                className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-muted/40"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/40 text-primary">
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard peek — same rank card shape as home */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/40 text-primary">
              <Trophy className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">
              This week's top <span className="text-muted-foreground">· quiz XP</span>
            </h3>
          </div>
          <Link
            to="/quiz/leaderboard"
            className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            See all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {leaderboard.slice(0, 3).map((l) => (
            <div key={l.rank} className="flex items-center gap-3 py-2.5">
              <p className="w-5 text-sm font-semibold tabular-nums text-primary">#{l.rank}</p>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/40 text-base">
                {l.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{l.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{l.institute}</p>
              </div>
              <p className="text-sm tabular-nums text-foreground">
                {l.xp.toLocaleString()}
                <span className="ml-1 text-[10px] text-muted-foreground">XP</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        One question a day beats none. Keep going.
      </p>
    </section>
  );
}

function FeaturedSubject() {
  const s = subjects[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl border border-accent/50 bg-gradient-to-br from-accent/40 via-surface to-surface p-4 shadow-sm"
    >
      <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/30 blur-2xl" />
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Pick up where you left
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md">
            {s.emoji}
          </div>
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-tutor text-tutor-foreground ring-2 ring-surface">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {s.name} <span className="text-xs text-muted-foreground">· {s.nameBn}</span>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            You cleared 12 questions yesterday · 78% accuracy
          </p>
          <p className="mt-0.5 text-[11px] text-primary">Next: Algebra · 25-question set</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to="/quiz/subject/$subjectId"
          params={{ subjectId: s.id }}
          className="flex-1 rounded-full border border-border bg-surface px-3 py-2 text-center text-xs font-semibold text-foreground/80 transition hover:bg-muted"
        >
          Browse topics
        </Link>
        <Link
          to="/quiz/exam/$subjectId"
          params={{ subjectId: s.id }}
          className="flex-1 rounded-full bg-primary px-3 py-2 text-center text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
        >
          Continue practice
        </Link>
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-sm font-semibold text-foreground">
        {title}
        {hint && <span className="ml-1 font-normal text-muted-foreground">· {hint}</span>}
      </h2>
    </div>
  );
}
