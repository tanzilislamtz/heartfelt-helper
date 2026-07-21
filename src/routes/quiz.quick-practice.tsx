import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, X, Timer, RefreshCw } from "lucide-react";
import { questions as allQuestions, subjects } from "@/data/quiz";
import { z } from "zod";

const searchSchema = z.object({
  subject: z.string().optional(),
});

export const Route = createFileRoute("/quiz/quick-practice")({
  validateSearch: (s) => searchSchema.parse(s),
  component: QuickPractice,
});

function QuickPractice() {
  const { subject } = Route.useSearch();
  const navigate = useNavigate();

  const pool = useMemo(() => {
    const filtered = subject ? allQuestions.filter((q) => q.subject === subject) : allQuestions;
    return (filtered.length ? filtered : allQuestions).slice(0, 10);
  }, [subject]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ q: string; correct: boolean }[]>([]);
  const [time, setTime] = useState(300);
  const [done, setDone] = useState(false);

  const current = pool[idx];
  const subjectMeta = subjects.find((s) => s.id === current?.subject);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setTime((v) => {
        if (v <= 1) {
          setDone(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done]);

  function submit() {
    if (selected === null || !current) return;
    const correct = selected === current.answer;
    setAnswers((a) => [...a, { q: current.id, correct }]);
    setTimeout(() => {
      if (idx + 1 >= pool.length) {
        setDone(true);
      } else {
        setIdx((i) => i + 1);
        setSelected(null);
      }
    }, 900);
  }

  if (done) {
    const correct = answers.filter((a) => a.correct).length;
    const total = pool.length;
    const pct = Math.round((correct / total) * 100);
    return (
      <main className="min-h-screen bg-background pb-28 text-foreground">
        <div className="mx-auto max-w-lg px-5 pt-16 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Session complete</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Nice work.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's how it went.</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <ResultStat label="Correct" value={`${correct}`} />
            <ResultStat label="Wrong" value={`${total - correct}`} />
            <ResultStat label="Score" value={`${pct}%`} />
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <button
              onClick={() => {
                setIdx(0);
                setSelected(null);
                setAnswers([]);
                setTime(300);
                setDone(false);
              }}
              className="flex items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-medium text-background transition hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
            <button
              onClick={() => navigate({ to: "/quiz" })}
              className="rounded-full border border-border py-3 text-sm font-medium transition hover:bg-muted"
            >
              Back to home
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!current) return null;
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center justify-between">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-full border border-border">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className={`flex items-center gap-1.5 text-sm tabular-nums ${time < 30 ? "text-rose-600" : "text-muted-foreground"}`}>
            <Timer className="h-4 w-4" /> {mm}:{ss}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {idx + 1} of {pool.length}</span>
            {subjectMeta && <span>{subjectMeta.emoji} {subjectMeta.name}</span>}
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              animate={{ width: `${((idx + 1) / pool.length) * 100}%` }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              className="h-full rounded-full bg-foreground"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{current.difficulty}</span>
              {current.year && <span>· {current.year}</span>}
            </div>
            <p className="mt-2 text-xl font-medium leading-snug">{current.text}</p>

            <div className="mt-6 space-y-2">
              {current.options.map((opt, i) => {
                const isSelected = selected === i;
                const isAnswered = answers.length > idx;
                const isCorrect = i === current.answer;
                const showCorrect = isAnswered && isCorrect;
                const showWrong = isAnswered && isSelected && !isCorrect;
                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => setSelected(i)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      showCorrect
                        ? "border-emerald-500 bg-emerald-500/5"
                        : showWrong
                        ? "border-rose-500 bg-rose-500/5"
                        : isSelected
                        ? "border-foreground"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                      showCorrect
                        ? "bg-emerald-500 text-white"
                        : showWrong
                        ? "bg-rose-500 text-white"
                        : isSelected
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {showCorrect ? <Check className="h-3.5 w-3.5" /> : showWrong ? <X className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>

            {answers.length > idx && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl border border-border bg-muted/40 p-4"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Explanation</p>
                <p className="mt-1.5 text-sm leading-relaxed">{current.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          disabled={selected === null || answers.length > idx}
          onClick={submit}
          className="mt-6 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition disabled:opacity-30"
        >
          {answers.length > idx ? "Next" : "Submit answer"}
        </button>
      </div>
    </main>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
