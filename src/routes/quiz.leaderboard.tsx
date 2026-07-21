import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Flame } from "lucide-react";
import { leaderboard } from "@/data/quiz";

export const Route = createFileRoute("/quiz/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [range, setRange] = useState<"weekly" | "monthly" | "alltime">("weekly");

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-full border border-border">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Leaderboard</h1>
            <p className="text-sm text-muted-foreground">Top learners across the country.</p>
          </div>
        </div>

        <div className="mt-6 flex gap-1 rounded-full border border-border p-1">
          {(["weekly", "monthly", "alltime"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 rounded-full py-1.5 text-sm transition ${
                range === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "weekly" ? "This week" : r === "monthly" ? "This month" : "All time"}
            </button>
          ))}
        </div>

        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
          {leaderboard.map((u, i) => (
            <motion.div
              key={u.rank}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 * i }}
              className="flex items-center gap-3 p-4"
            >
              <div className="w-6 text-sm tabular-nums text-muted-foreground">{u.rank}</div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-lg">
                {u.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{u.name}</p>
                <p className="truncate text-xs text-muted-foreground">{u.institute}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                <Flame className="h-3.5 w-3.5" /> {u.streak}
              </div>
              <div className="w-20 text-right text-sm tabular-nums">
                {u.xp.toLocaleString()}
                <span className="ml-1 text-xs text-muted-foreground">XP</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
