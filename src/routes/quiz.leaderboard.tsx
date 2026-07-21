import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Trophy, Flame } from "lucide-react";
import { leaderboard } from "@/data/quiz";

export const Route = createFileRoute("/quiz/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [range, setRange] = useState<"weekly" | "monthly" | "alltime">("weekly");
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-background to-background pb-28 font-bangla dark:from-amber-950/20">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-black">
              <Trophy className="h-5 w-5 text-amber-500" /> লিডারবোর্ড
            </h1>
            <p className="text-xs text-muted-foreground">দেশব্যাপী সেরাদের তালিকা</p>
          </div>
        </div>

        <div className="mt-4 flex rounded-2xl bg-muted p-1">
          {(["weekly", "monthly", "alltime"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold capitalize transition ${
                range === r ? "bg-card text-foreground shadow" : "text-muted-foreground"
              }`}
            >
              {r === "weekly" ? "সাপ্তাহিক" : r === "monthly" ? "মাসিক" : "সর্বকালীন"}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="mt-6 grid grid-cols-3 items-end gap-3">
          {[top3[1], top3[0], top3[2]].map((u, i) => {
            if (!u) return null;
            const heights = ["h-24", "h-32", "h-20"];
            const gradients = [
              "from-slate-300 to-slate-400",
              "from-amber-400 to-yellow-500",
              "from-orange-400 to-orange-500",
            ];
            return (
              <motion.div
                key={u.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex flex-col items-center"
              >
                <div className="text-4xl">{u.avatar}</div>
                <p className="mt-1 max-w-full truncate text-xs font-bold">{u.name}</p>
                <p className="text-[10px] text-emerald-600">{u.xp.toLocaleString()} XP</p>
                <div className={`mt-2 ${heights[i]} w-full rounded-t-2xl bg-gradient-to-b ${gradients[i]} shadow-lg`}>
                  <p className="pt-2 text-center text-2xl font-black text-white">#{u.rank}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rest */}
        <div className="mt-6 space-y-2">
          {rest.map((u, i) => (
            <motion.div
              key={u.rank}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 * i }}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm"
            >
              <div className="w-8 text-center text-sm font-black text-muted-foreground">
                #{u.rank}
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-xl">
                {u.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{u.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{u.institute}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-1 text-[11px] font-bold text-orange-600">
                <Flame className="h-3 w-3" /> {u.streak}
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-600">{u.xp.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
