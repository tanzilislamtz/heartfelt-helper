import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Target, Clock } from "lucide-react";
import { subjects } from "@/data/quiz";

export const Route = createFileRoute("/quiz/progress")({
  component: ProgressPage,
});

const weekly = [40, 65, 50, 80, 72, 90, 88];
const days = ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র"];

function ProgressPage() {
  const max = Math.max(...weekly);
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/40 pb-28 font-bangla">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-black">
              <BarChart3 className="h-5 w-5 text-fuchsia-600" /> প্রোগ্রেস
            </h1>
            <p className="text-xs text-muted-foreground">তোমার এনালিটিক্স ও পারফরম্যান্স</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <MetricCard icon={Target} label="Accuracy" value="78%" tint="from-emerald-500 to-teal-500" />
          <MetricCard icon={Clock} label="Avg Time" value="24s" tint="from-indigo-500 to-violet-500" />
          <MetricCard icon={TrendingUp} label="Growth" value="+12%" tint="from-amber-500 to-orange-500" />
        </div>

        {/* Weekly chart */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
        >
          <p className="text-sm font-bold">সাপ্তাহিক অ্যাক্টিভিটি</p>
          <p className="text-xs text-muted-foreground">এই সপ্তাহে সমাধান করা প্রশ্ন</p>
          <div className="mt-4 flex h-40 items-end gap-2">
            {weekly.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / max) * 100}%` }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: "easeOut" }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-indigo-500 to-fuchsia-400"
                />
                <span className="text-[10px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Subject-wise */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
        >
          <p className="text-sm font-bold">বিষয়ভিত্তিক দক্ষতা</p>
          <div className="mt-4 space-y-3">
            {subjects.slice(0, 6).map((s, i) => {
              const pct = 30 + ((i * 13) % 60);
              return (
                <div key={s.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-bold">{s.emoji} {s.nameBn}</span>
                    <span className="font-black text-emerald-600">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.05 * i, duration: 0.6 }}
                      className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function MetricCard({ icon: Icon, label, value, tint }: { icon: typeof Target; label: string; value: string; tint: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
      <div className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${tint} text-white`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-2 text-lg font-black">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
