import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Timer, Play, Settings2 } from "lucide-react";
import { subjects } from "@/data/quiz";

export const Route = createFileRoute("/quiz/mock-test")({
  component: MockTest,
});

function MockTest() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["math"]);
  const [count, setCount] = useState(20);
  const [minutes, setMinutes] = useState(15);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/40 pb-28 font-bangla">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black">কাস্টম মক টেস্ট</h1>
            <p className="text-xs text-muted-foreground">নিজের ইচ্ছেমত সেটআপ দাও</p>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
        >
          <p className="mb-3 text-sm font-bold">বিষয় নির্বাচন করো</p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => {
              const active = selected.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={`flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 text-sm font-bold transition ${
                    active ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <span>{s.emoji}</span> {s.nameBn}
                </button>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4 rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
        >
          <p className="mb-3 flex items-center gap-2 text-sm font-bold">
            <Settings2 className="h-4 w-4" /> কনফিগারেশন
          </p>

          <div className="space-y-4">
            <RangeRow label="প্রশ্নের সংখ্যা" value={count} min={10} max={100} step={5} onChange={setCount} suffix="টি" />
            <RangeRow label="সময় (মিনিট)" value={minutes} min={5} max={120} step={5} onChange={setMinutes} suffix="মি." />

            <div>
              <p className="mb-2 text-xs font-bold text-muted-foreground">ডিফিকাল্টি</p>
              <div className="grid grid-cols-4 gap-2">
                {(["easy", "medium", "hard", "mixed"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`rounded-xl border-2 py-2 text-xs font-bold capitalize transition ${
                      difficulty === d ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/70">প্রিভিউ</p>
              <p className="mt-1 text-2xl font-black">{count} প্রশ্ন · {minutes} মি.</p>
              <p className="text-xs text-white/80">
                {selected.length} বিষয় · {difficulty}
              </p>
            </div>
            <Timer className="h-10 w-10 text-white/80" />
          </div>
          <button
            disabled={selected.length === 0}
            onClick={() => navigate({ to: "/quiz/quick-practice" })}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 font-black text-indigo-700 shadow-lg transition disabled:opacity-40 active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-current" /> মক টেস্ট শুরু করো
          </button>
        </motion.div>
      </div>
    </main>
  );
}

function RangeRow({
  label, value, min, max, step, onChange, suffix,
}: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <p className="text-sm font-black text-indigo-600">{value} {suffix}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-600"
      />
    </div>
  );
}
