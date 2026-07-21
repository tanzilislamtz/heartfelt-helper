import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { subjects } from "@/data/quiz";

export const Route = createFileRoute("/quiz/progress")({
  component: ProgressPage,
});

const weekly = [40, 65, 50, 80, 72, 90, 88];
const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function ProgressPage() {
  const max = Math.max(...weekly);
  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-full border border-border">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your progress</h1>
            <p className="text-sm text-muted-foreground">A quiet look at how you're doing.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Metric label="Accuracy" value="78%" />
          <Metric label="Avg time" value="24s" />
          <Metric label="Growth" value="+12%" />
        </div>

        <section className="mt-8">
          <p className="text-sm font-medium text-muted-foreground">This week</p>
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex h-40 items-end gap-2">
              {weekly.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / max) * 100}%` }}
                    transition={{ delay: 0.04 * i, duration: 0.5, ease: "easeOut" }}
                    className="w-full rounded-md bg-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <p className="text-sm font-medium text-muted-foreground">By subject</p>
          <div className="mt-4 space-y-4">
            {subjects.slice(0, 6).map((s, i) => {
              const pct = 30 + ((i * 13) % 60);
              return (
                <div key={s.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span>{s.emoji} {s.name}</span>
                    <span className="tabular-nums text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.04 * i, duration: 0.6 }}
                      className="h-full rounded-full bg-foreground"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
