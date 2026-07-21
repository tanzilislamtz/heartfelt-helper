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
  Brain,
  TrendingUp,
  Users,
  Calendar,
  Rocket,
  Play,
  Award,
  Activity,
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
    size: "col-span-2",
    accent: "amber",
  },
  {
    to: "/quiz/mock-test" as const,
    icon: Timer,
    title: "মক টেস্ট",
    subtitle: "কাস্টম সময়",
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
    size: "col-span-1",
    accent: "violet",
  },
  {
    to: "/quiz/question-bank" as const,
    icon: Library,
    title: "প্রশ্ন ব্যাংক",
    subtitle: "১০ লক্ষ+",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    size: "col-span-1",
    accent: "emerald",
  },
  {
    to: "/quiz/ai-solver" as const,
    icon: Bot,
    title: "AI সলভার",
    subtitle: "ইনস্ট্যান্ট ব্যাখ্যা",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    size: "col-span-2",
    accent: "sky",
  },
  {
    to: "/quiz/leaderboard" as const,
    icon: Trophy,
    title: "লিডারবোর্ড",
    subtitle: "দেশব্যাপী",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    size: "col-span-1",
    accent: "yellow",
  },
  {
    to: "/quiz/progress" as const,
    icon: BarChart3,
    title: "প্রোগ্রেস",
    subtitle: "এনালিটিক্স",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    size: "col-span-1",
    accent: "fuchsia",
  },
];

const weekDays = ["শ", "র", "সো", "ম", "বু", "বৃ", "শু"];
const streakData = [1, 1, 1, 1, 1, 1, 0]; // last 7 days
const liveActivity = [
  { name: "সাদিয়া", action: "টপ ১০ এ প্রবেশ", time: "এইমাত্র", tint: "text-amber-500" },
  { name: "রায়হান", action: "৫০ প্রশ্ন সমাধান", time: "২ মি আগে", tint: "text-emerald-500" },
  { name: "তানভীর", action: "নতুন ব্যাজ আনলক", time: "৫ মি আগে", tint: "text-fuchsia-500" },
];

function QuizHub() {
  const xpPercent = 62; // 1240 / 2000
  const circumference = 2 * Math.PI * 42;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a15] pb-28 font-bangla text-white">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute top-20 -left-20 h-80 w-80 rounded-full bg-fuchsia-600/25 blur-[100px]" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-emerald-500/25 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Header */}
      <section className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/40">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                Learns Academy
              </p>
              <p className="text-sm font-bold">Quiz Arena</p>
            </div>
          </div>
          <Link
            to="/quiz/progress"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold backdrop-blur-xl"
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            লাইভ
          </Link>
        </div>

        {/* Hero card with XP ring */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.04] to-white/[0.02] p-5 backdrop-blur-2xl"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-500/40 to-indigo-500/40 blur-3xl" />
          <div className="relative flex items-center gap-5">
            {/* Animated XP ring */}
            <div className="relative h-[104px] w-[104px] shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#xpGrad)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - xpPercent / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/50">Level</p>
                  <p className="text-2xl font-black leading-none">12</p>
                  <p className="mt-0.5 text-[9px] text-white/60">{xpPercent}%</p>
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-widest text-white/50">স্বাগতম 👋</p>
              <p className="mt-0.5 truncate text-xl font-black">রায়ানের চ্যালেঞ্জ</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Chip icon={Flame} label="১৪ দিন" tint="from-orange-500/30 to-rose-500/30 text-orange-300" />
                <Chip icon={Target} label="1,240 XP" tint="from-emerald-500/30 to-teal-500/30 text-emerald-300" />
                <Chip icon={Crown} label="#128" tint="from-indigo-500/30 to-fuchsia-500/30 text-indigo-300" />
              </div>
            </div>
          </div>

          {/* Daily CTA */}
          <Link
            to="/quiz/quick-practice"
            className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-3.5 shadow-lg shadow-fuchsia-500/30 transition active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                <Play className="h-5 w-5 fill-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/70">Daily Challenge</p>
                <p className="text-sm font-bold">আজকের চ্যালেঞ্জ · +৫০ XP</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Streak calendar strip */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-white/60" />
              <p className="text-[11px] font-semibold text-white/70">সাপ্তাহিক স্ট্রিক</p>
            </div>
            <p className="text-[11px] font-black text-orange-400">🔥 ১৪ দিন</p>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {streakData.map((d, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`grid h-8 w-full place-items-center rounded-lg text-[10px] font-black ${
                    d
                      ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/40"
                      : "border border-dashed border-white/15 text-white/30"
                  }`}
                >
                  {d ? "✓" : ""}
                </div>
                <span className="text-[9px] text-white/50">{weekDays[i]}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento feature grid */}
      <section className="mx-auto mt-6 max-w-2xl px-5">
        <SectionHeader title="সব ফিচার" subtitle="এক জায়গায় সব কিছু" />
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              className={f.size}
            >
              <Link
                to={f.to}
                className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${f.gradient} opacity-30 blur-2xl transition group-hover:opacity-60`} />
                <div className={`relative mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${f.gradient} shadow-lg`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <p className="relative text-[13px] font-bold leading-tight">{f.title}</p>
                <p className="relative mt-0.5 text-[10px] text-white/50">{f.subtitle}</p>
                <ChevronRight className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live activity ticker */}
      <section className="mx-auto mt-6 max-w-2xl px-5">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-transparent p-3 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <p className="text-[11px] font-semibold text-white/70">লাইভ অ্যাক্টিভিটি</p>
            </div>
            <p className="text-[10px] text-white/40">এই মুহূর্তে ২,৪০০+ অনলাইন</p>
          </div>
          <div className="space-y-1.5">
            {liveActivity.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white/30" />
                  <p>
                    <span className="font-bold">{a.name}</span>{" "}
                    <span className={`${a.tint} font-medium`}>{a.action}</span>
                  </p>
                </div>
                <span className="text-white/40">{a.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="mx-auto mt-6 max-w-2xl px-5">
        <SectionHeader
          title="বিষয় অনুযায়ী"
          subtitle="পছন্দের বিষয় বেছে নাও"
          action={{ to: "/quiz/question-bank", label: "সব" }}
        />
        <div className="scrollbar-none mt-3 flex gap-2.5 overflow-x-auto pb-2">
          {subjects.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Link
                to="/quiz/quick-practice"
                search={{ subject: s.id }}
                className="group relative block min-w-[120px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl transition hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 transition group-hover:opacity-20`} />
                <div className={`relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-lg shadow-md`}>
                  {s.emoji}
                </div>
                <p className="relative mt-2 text-[13px] font-bold">{s.nameBn}</p>
                <p className="relative text-[10px] text-white/50">{(s.questions / 1000).toFixed(1)}k প্রশ্ন</p>
                <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: `${40 + (i * 7) % 55}%` }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leaderboard preview - premium */}
      <section className="mx-auto mt-6 max-w-2xl px-5">
        <SectionHeader
          title="সাপ্তাহিক টপার"
          subtitle="দেশসেরা ৩ জন"
          action={{ to: "/quiz/leaderboard", label: "সব" }}
        />
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-transparent p-3 backdrop-blur-xl">
          {leaderboard.slice(0, 3).map((l, i) => (
            <motion.div
              key={l.rank}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className={`flex items-center gap-3 rounded-xl px-2 py-2.5 ${
                i === 0 ? "bg-gradient-to-r from-amber-500/15 to-transparent" : ""
              } ${i < 2 ? "border-b border-white/5" : ""}`}
            >
              <div className={`grid h-9 w-9 place-items-center rounded-xl text-lg font-black ${
                i === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/40" :
                i === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900" :
                "bg-gradient-to-br from-amber-700 to-amber-800 text-white"
              }`}>
                {l.rank}
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg">
                {l.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{l.name}</p>
                <p className="truncate text-[10px] text-white/50">{l.institute}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-400">{l.xp.toLocaleString()}</p>
                <div className="flex items-center justify-end gap-0.5 text-[9px] text-orange-400">
                  <Flame className="h-2.5 w-2.5" />
                  {l.streak}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section className="mx-auto mt-6 max-w-2xl px-5">
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard icon={Users} value="৫০k+" label="সক্রিয় শিক্ষার্থী" tint="from-indigo-500 to-blue-500" />
          <StatCard icon={TrendingUp} value="৯২%" label="সঠিকতার হার" tint="from-emerald-500 to-teal-500" />
          <StatCard icon={Rocket} value="২৪/৭" label="AI সাপোর্ট" tint="from-fuchsia-500 to-pink-500" />
        </div>
      </section>

      {/* Badges */}
      <section className="mx-auto mt-6 max-w-2xl px-5">
        <SectionHeader title="ব্যাজ কালেকশন" subtitle="জিতে নাও নতুন ব্যাজ" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {badges.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-xl transition hover:-translate-y-1 hover:border-amber-400/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-fuchsia-500/0 transition group-hover:from-amber-500/10 group-hover:to-fuchsia-500/10" />
              <div className="relative text-2xl">{b.emoji}</div>
              <p className="relative mt-1 text-[10px] font-bold leading-tight">{b.name}</p>
              <p className="relative text-[8px] text-white/50">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Motivational footer */}
      <section className="mx-auto mt-6 max-w-2xl px-5">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-600/30 via-fuchsia-600/20 to-amber-500/20 p-4 backdrop-blur-xl">
          <Award className="absolute -right-4 -top-4 h-24 w-24 text-white/5" />
          <p className="text-[11px] uppercase tracking-widest text-white/60">আজকের কথা</p>
          <p className="mt-1 text-sm font-bold leading-snug">
            "সফলতার সিঁড়ি এক ধাপ এক ধাপ করেই ওঠা যায় — আজই শুরু করো।"
          </p>
        </div>
      </section>
    </main>
  );
}

function Chip({
  icon: Icon,
  label,
  tint,
}: {
  icon: typeof Flame;
  label: string;
  tint: string;
}) {
  return (
    <div className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-gradient-to-r ${tint} px-2 py-0.5 text-[10px] font-bold backdrop-blur`}>
      <Icon className="h-3 w-3" />
      {label}
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  tint: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
      <div className={`mb-1.5 grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${tint} shadow-md`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-base font-black">{value}</p>
      <p className="text-[9px] leading-tight text-white/50">{label}</p>
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
        <h2 className="text-base font-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-[11px] text-white/50">{subtitle}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          {action.label}
          <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

// Silence unused import warning while keeping the icon available for future use
void Sparkles;
