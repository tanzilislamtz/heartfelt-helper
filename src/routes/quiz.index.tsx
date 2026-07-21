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
  Sparkles,
  Target,
  Crown,
} from "lucide-react";
import { subjects, leaderboard, badges } from "@/data/quiz";

export const Route = createFileRoute("/quiz/")({
  component: QuizHub,
});

const features = [
  {
    to: "/quiz/quick-practice" as const,
    icon: Zap,
    title: "কুইক প্র্যাকটিস",
    subtitle: "১০ প্রশ্ন · ৫ মিনিট",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
  {
    to: "/quiz/mock-test" as const,
    icon: Timer,
    title: "মক টেস্ট",
    subtitle: "কাস্টম সময় ও বিষয়",
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
  },
  {
    to: "/quiz/question-bank" as const,
    icon: Library,
    title: "প্রশ্ন ব্যাংক",
    subtitle: "১০ লক্ষ+ প্রশ্ন",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    to: "/quiz/ai-solver" as const,
    icon: Bot,
    title: "AI সলভার",
    subtitle: "যেকোন প্রশ্নের ব্যাখ্যা",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
  },
  {
    to: "/quiz/leaderboard" as const,
    icon: Trophy,
    title: "লিডারবোর্ড",
    subtitle: "দেশব্যাপী র‍্যাঙ্কিং",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
  },
  {
    to: "/quiz/progress" as const,
    icon: BarChart3,
    title: "প্রোগ্রেস",
    subtitle: "এনালিটিক্স ও রিপোর্ট",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
  },
];

function QuizHub() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-28 font-bangla">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -top-16 right-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute top-40 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-2xl px-5 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Learns Academy · Quiz
              </p>
              <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight">
                চর্চা করো <span className="bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent">নিজের গতিতে</span>
              </h1>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur"
          >
            <div className="grid grid-cols-3 gap-3">
              <Stat icon={Flame} label="স্ট্রিক" value="14" tint="text-orange-500" />
              <Stat icon={Target} label="XP" value="1,240" tint="text-emerald-500" />
              <Stat icon={Crown} label="র‍্যাঙ্ক" value="#128" tint="text-indigo-500" />
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>আজকের লক্ষ্য · ২০ প্রশ্ন</span>
                <span className="font-semibold text-foreground">14 / 20</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Continue CTA */}
          <Link
            to="/quiz/quick-practice"
            className="mt-4 flex items-center justify-between rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white shadow-xl shadow-violet-500/30 transition active:scale-[0.98]"
          >
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/70">Daily Challenge</p>
              <p className="mt-0.5 text-lg font-bold">আজকের চ্যালেঞ্জ শুরু করো</p>
              <p className="text-xs text-white/80">১০ প্রশ্ন · ৫ মিনিট · +৫০ XP</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <Zap className="h-6 w-6" />
            </div>
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto mt-8 max-w-2xl px-5">
        <SectionHeader title="ফিচারসমূহ" subtitle="সব কিছু এক জায়গায়" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
            >
              <Link
                to={f.to}
                className="group relative block overflow-hidden rounded-3xl border border-border/60 bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.gradient} text-white shadow-md`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold leading-tight">{f.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{f.subtitle}</p>
                <ChevronRight className="absolute right-3 top-3 h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                <div className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${f.gradient} opacity-10 blur-2xl transition group-hover:opacity-20`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section className="mx-auto mt-8 max-w-2xl px-5">
        <SectionHeader title="বিষয় অনুযায়ী চর্চা" subtitle="পছন্দের বিষয় বেছে নাও" action={{ to: "/quiz/question-bank", label: "সব দেখো" }} />
        <div className="scrollbar-none mt-3 flex gap-3 overflow-x-auto pb-2">
          {subjects.map((s) => (
            <Link
              key={s.id}
              to="/quiz/quick-practice"
              search={{ subject: s.id }}
              className="group relative min-w-[130px] shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card p-3 shadow-sm transition hover:-translate-y-0.5"
            >
              <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-lg shadow`}>
                <span>{s.emoji}</span>
              </div>
              <p className="mt-2 text-sm font-bold">{s.nameBn}</p>
              <p className="text-[10px] text-muted-foreground">{s.questions.toLocaleString()}+ প্রশ্ন</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Leaderboard preview */}
      <section className="mx-auto mt-8 max-w-2xl px-5">
        <SectionHeader title="দেশসেরা লিডারবোর্ড" subtitle="এই সপ্তাহের টপার" action={{ to: "/quiz/leaderboard", label: "সব দেখো" }} />
        <div className="mt-3 space-y-2">
          {leaderboard.slice(0, 3).map((l, i) => (
            <motion.div
              key={l.rank}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-50 text-xl">
                {l.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{l.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{l.institute}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-600">{l.xp.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section className="mx-auto mt-8 max-w-2xl px-5">
        <SectionHeader title="ব্যাজ ও অ্যাচিভমেন্ট" subtitle="জিতে নাও নতুন ব্যাজ" />
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {badges.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }}
              className="flex flex-col items-center rounded-2xl border border-border/60 bg-gradient-to-br from-card to-muted/40 p-3 text-center shadow-sm"
            >
              <div className="text-3xl">{b.emoji}</div>
              <p className="mt-1 text-[11px] font-bold leading-tight">{b.name}</p>
              <p className="text-[9px] text-muted-foreground">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-muted/40 p-2.5">
      <Icon className={`h-5 w-5 ${tint}`} />
      <p className="mt-1 text-lg font-black leading-none">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { to: "/quiz/leaderboard" | "/quiz/question-bank"; label: string };
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-lg font-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 hover:underline"
        >
          {action.label}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
