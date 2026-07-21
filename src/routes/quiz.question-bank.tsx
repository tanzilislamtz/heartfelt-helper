import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
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
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-full border border-border">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Question bank</h1>
            <p className="text-sm text-muted-foreground">Search past papers by subject.</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
          <Chip active={subject === "all"} onClick={() => setSubject("all")} label="All" />
          {subjects.map((s) => (
            <Chip
              key={s.id}
              active={subject === s.id}
              onClick={() => setSubject(s.id)}
              label={`${s.emoji} ${s.name}`}
            />
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "question" : "questions"}
        </p>
        <div className="mt-2 divide-y divide-border rounded-2xl border border-border bg-card">
          {filtered.map((qq, i) => {
            const isOpen = expanded === qq.id;
            const subj = subjects.find((s) => s.id === qq.subject);
            return (
              <motion.div
                key={qq.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * i }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : qq.id)}
                  className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-muted/50"
                >
                  <span className="text-lg">{subj?.emoji ?? "❓"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{subj?.name}</span>
                      {qq.year && <span>· {qq.year}</span>}
                    </div>
                    <p className="text-sm font-medium leading-snug">{qq.text}</p>
                  </div>
                  <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-border bg-muted/30 p-4"
                  >
                    <div className="space-y-2">
                      {qq.options.map((o, oi) => (
                        <div
                          key={oi}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                            oi === qq.answer
                              ? "border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                              : "border-border bg-background"
                          }`}
                        >
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-xs">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {o}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Explanation</p>
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
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition ${
        active ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40"
      }`}
    >
      {label}
    </button>
  );
}
