import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, X, Timer, Trophy, RefreshCw, Sparkles } from "lucide-react";
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
      <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-background to-emerald-50/50 pb-28 font-bangla dark:from-indigo-950/30 dark:to-emerald-950/30">
        <div className="mx-auto max-w-2xl px-5 pt-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl border border-border/60 bg-card p-6 text-center shadow-xl"
          >
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-amber-500/40">
              <Trophy className="h-10 w-10" />
            </div>
            <h1 className="mt-4 text-2xl font-black">দারুণ! শেষ হলো</h1>
            <p className="mt-1 text-sm text-muted-foreground">তোমার ফলাফল প্রস্তুত</p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <ResultStat label="সঠিক" value={`${correct}`} tint="text-emerald-600" />
              <ResultStat label="ভুল" value={`${total - correct}`} tint="text-rose-600" />
              <ResultStat label="স্কোর" value={`${pct}%`} tint="text-indigo-600" />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIdx(0);
                  setSelected(null);
                  setAnswers([]);
                  setTime(300);
                  setDone(false);
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" /> আবার চেষ্টা করো
              </button>
              <button
                onClick={() => navigate({ to: "/quiz" })}
                className="rounded-2xl border border-border py-3 font-bold text-foreground active:scale-95"
              >
                হোমে ফিরে যাও
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!current) return null;
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 pb-28 font-bangla">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center justify-between">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-card shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${time < 30 ? "bg-rose-500/10 text-rose-600" : "bg-indigo-500/10 text-indigo-600"}`}>
            <Timer className="h-4 w-4" /> {mm}:{ss}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>প্রশ্ন {idx + 1} / {pool.length}</span>
            {subjectMeta && <span>{subjectMeta.emoji} {subjectMeta.nameBn}</span>}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              animate={{ width: `${((idx + 1) / pool.length) * 100}%` }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="mt-5 rounded-3xl border border-border/60 bg-card p-5 shadow-xl"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                {current.difficulty}
              </span>
              {current.year && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                  {current.board} · {current.year}
                </span>
              )}
            </div>
            <p className="text-base font-bold leading-relaxed">{current.text}</p>

            <div className="mt-4 space-y-2">
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
                    className={`group flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                      showCorrect
                        ? "border-emerald-500 bg-emerald-500/10"
                        : showWrong
                        ? "border-rose-500 bg-rose-500/10"
                        : isSelected
                        ? "border-indigo-500 bg-indigo-500/5"
                        : "border-border/70 bg-background hover:border-indigo-300"
                    }`}
                  >
                    <span className={`grid h-8 w-8 place-items-center rounded-xl text-sm font-black ${
                      showCorrect
                        ? "bg-emerald-500 text-white"
                        : showWrong
                        ? "bg-rose-500 text-white"
                        : isSelected
                        ? "bg-indigo-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {showCorrect ? <Check className="h-4 w-4" /> : showWrong ? <X className="h-4 w-4" /> : String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-sm font-medium">{opt}</span>
                  </button>
                );
              })}
            </div>

            {answers.length > idx && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 p-3"
              >
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  <Sparkles className="h-3.5 w-3.5" /> ব্যাখ্যা
                </p>
                <p className="mt-1 text-sm leading-relaxed">{current.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          disabled={selected === null || answers.length > idx}
          onClick={submit}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 py-3.5 font-bold text-white shadow-xl shadow-violet-500/30 transition disabled:opacity-40 active:scale-[0.98]"
        >
          {answers.length > idx ? "পরবর্তী প্রশ্ন..." : "উত্তর দাও"}
        </button>
      </div>
    </main>
  );
}

function ResultStat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <div className="rounded-2xl bg-muted/40 p-3">
      <p className={`text-2xl font-black ${tint}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
