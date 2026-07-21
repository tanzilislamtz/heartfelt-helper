import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
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
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-full border border-border">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Build a mock test</h1>
            <p className="text-sm text-muted-foreground">Pick subjects, length, and difficulty.</p>
          </div>
        </div>

        <section className="mt-8">
          <p className="text-sm font-medium text-muted-foreground">Subjects</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {subjects.map((s) => {
              const active = selected.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                    active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40"
                  }`}
                >
                  <span className="mr-1.5">{s.emoji}</span>
                  {s.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 space-y-6">
          <RangeRow label="Number of questions" value={count} min={10} max={100} step={5} onChange={setCount} suffix="" />
          <RangeRow label="Time" value={minutes} min={5} max={120} step={5} onChange={setMinutes} suffix="min" />

          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Difficulty</p>
            <div className="grid grid-cols-4 gap-2">
              {(["easy", "medium", "hard", "mixed"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full border py-2 text-sm capitalize transition ${
                    difficulty === d ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">You'll get</p>
          <p className="mt-1 text-lg font-medium">{count} questions in {minutes} minutes</p>
          <p className="text-sm text-muted-foreground">
            {selected.length} {selected.length === 1 ? "subject" : "subjects"} · {difficulty} difficulty
          </p>
          <button
            disabled={selected.length === 0}
            onClick={() => navigate({ to: "/quiz/quick-practice" })}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-medium text-background transition disabled:opacity-30"
          >
            <Play className="h-4 w-4" /> Start test
          </button>
        </section>
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
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm tabular-nums">{value}{suffix && ` ${suffix}`}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-foreground"
      />
    </div>
  );
}
