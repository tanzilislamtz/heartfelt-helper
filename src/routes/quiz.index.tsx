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
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { subjects, leaderboard } from "@/data/quiz";

export const Route = createFileRoute("/quiz/")({
  component: QuizHub,
});

const features = [
  { to: "/quiz/mock-test" as const, icon: Timer, title: "Mock test", desc: "Build your own exam" },
  { to: "/quiz/question-bank" as const, icon: Library, title: "Question bank", desc: "Past papers, searchable" },
  { to: "/quiz/ai-solver" as const, icon: Bot, title: "AI solver", desc: "Ask, get step-by-step" },
  { to: "/quiz/leaderboard" as const, icon: Trophy, title: "Leaderboard", desc: "See where you stand" },
  { to: "/quiz/progress" as const, icon: BarChart3, title: "Your progress", desc: "Accuracy over time" },
];

function QuizHub() {
  // In the real app these will come from the user's profile.
  const level = "SSC";
  const group = "Science";
  const studentName = "Rayan";

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-8">
        {/* Header — brand gradient to match home */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Learns Academy</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Good to see you, {studentName}.</h1>
          <p className="mt-1 text-sm text-white/85">Choose a subject to start a 25-question board practice.</p>
        </div>


        {/* Profile context card */}
        <section className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Your syllabus</p>
            <p className="text-sm font-medium">{level} · {group} group</p>
          </div>
          <Link to="/profile" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            Change
          </Link>
        </section>

        {/* Subjects — the main entry point */}
        <section className="mt-8">
          <SectionHeader title="Your subjects" hint={`${subjects.length} available`} />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                  className="group block h-full rounded-2xl border border-border bg-card p-4 transition hover:border-foreground/40"
                >
                  <div className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-lg text-white shadow-sm`}>
                    <span>{s.emoji}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{(s.questions / 1000).toFixed(1)}k questions</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-foreground opacity-0 transition group-hover:opacity-100">
                    Start <ChevronRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>


        {/* Features */}
        <section className="mt-10">
          <SectionHeader title="More tools" />
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

        {/* Leaderboard */}
        <section className="mt-10">
          <SectionHeader title="This week's top" />
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

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}
