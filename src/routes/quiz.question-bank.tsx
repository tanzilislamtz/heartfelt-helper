import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ChevronDown, Library } from "lucide-react";
import { questions, subjects } from "@/data/quiz";

export const Route = createFileRoute("/quiz/question-bank")({
  component: QuestionBank,
});

function QuestionBank() {
  const [subject, setSubject] = useState<string>("all");
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return questions.filter((qq) => {
      if (subject !== "all" && qq.subject !== subject) return false;
      if (q && !qq.text.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [subject, q]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/40 pb-28 font-bangla">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-xl font-black">
              <Library className="h-5 w-5 text-emerald-600" /> প্রশ্ন ব্যাংক
            </h1>
            <p className="text-xs text-muted-foreground">১০ লক্ষ+ প্রশ্নের ভান্ডার</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2.5 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="প্রশ্ন খুঁজো..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter chips */}
        <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
          <Chip active={subject === "all"} onClick={() => setSubject("all")} label="সব" />
          {subjects.map((s) => (
            <Chip
              key={s.id}
              active={subject === s.id}
              onClick={() => setSubject(s.id)}
              label={`${s.emoji} ${s.nameBn}`}
            />
          ))}
        </div>

        {/* List */}
        <p className="mt-4 text-xs text-muted-foreground">{filtered.length} টি প্রশ্ন পাওয়া গেছে</p>
        <div className="mt-2 space-y-2.5">
          {filtered.map((qq, i) => {
            const isOpen = expanded === qq.id;
            const subj = subjects.find((s) => s.id === qq.subject);
            return (
              <motion.div
                key={qq.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i }}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : qq.id)}
                  className="flex w-full items-start gap-3 p-3.5 text-left"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-lg">
                    {subj?.emoji ?? "❓"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                        {subj?.nameBn}
                      </span>
                      {qq.year && (
                        <span className="text-[10px] text-muted-foreground">
                          {qq.board} · {qq.year}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold leading-snug">{qq.text}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-border/60 bg-muted/30 p-3.5"
                  >
                    <div className="space-y-1.5">
                      {qq.options.map((o, oi) => (
                        <div
                          key={oi}
                          className={`flex items-center gap-2 rounded-xl border p-2 text-sm ${
                            oi === qq.answer
                              ? "border-emerald-500 bg-emerald-500/10 font-bold text-emerald-700 dark:text-emerald-300"
                              : "border-border/60 bg-background"
                          }`}
                        >
                          <span className="grid h-6 w-6 place-items-center rounded-lg bg-muted text-xs font-black">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {o}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl bg-indigo-500/10 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">ব্যাখ্যা</p>
                      <p className="mt-1 text-sm leading-relaxed">{qq.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${
        active ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border bg-card text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
