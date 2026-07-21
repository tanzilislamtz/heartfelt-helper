import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Eye, EyeOff, Printer } from "lucide-react";
import { z } from "zod";
import {
  boards,
  categories,
  getWrittenQuestions,
  subjects,
  type CategoryId,
} from "@/data/quiz";

const searchSchema = z.object({
  board: z.string(),
  type: z.enum(["cq", "ka", "kha", "short"]),
});

export const Route = createFileRoute("/quiz/written/$subjectId")({
  validateSearch: (s) => searchSchema.parse(s),
  component: WrittenPractice,
});

function WrittenPractice() {
  const { subjectId } = Route.useParams();
  const { board, type } = Route.useSearch();
  const subject = subjects.find((s) => s.id === subjectId);
  const boardObj = boards.find((b) => b.id === board);
  const cat = categories.find((c) => c.id === (type as CategoryId));
  if (!subject || !boardObj || !cat) throw notFound();

  const questions = useMemo(
    () => getWrittenQuestions(subjectId, board, type),
    [subjectId, board, type],
  );
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <Link
          to="/quiz/subject/$subjectId/$category"
          params={{ subjectId, category: cat.id }}
          className="grid h-10 w-10 place-items-center rounded-full border border-border"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mt-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {boardObj.name} · {subject.name}
            </p>
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {cat.name} <span className="font-bangla text-muted-foreground">· {cat.nameBn}</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              {questions.length} questions · {questions[0]?.marks} marks each
            </p>
          </div>
          <button
            onClick={() => setRevealAll((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
          >
            {revealAll ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {revealAll ? "Hide all" : "Reveal all"}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {questions.map((q, i) => {
            const isOpen = revealAll || open[q.id];
            return (
              <motion.article
                key={q.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * i }}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="flex items-start gap-3 p-4">
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${cat.color} text-xs font-bold text-white`}>
                    {q.n}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {q.topic}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Marks: {q.marks}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed font-bangla">
                      {q.prompt}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpen((o) => ({ ...o, [q.id]: !o[q.id] }))}
                  className="flex w-full items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/60"
                >
                  <span>{isOpen ? "Hide answer" : "Show answer"}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border bg-gradient-to-br from-primary/5 to-transparent px-4 py-3 text-sm leading-relaxed font-bangla">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                          Model answer
                        </p>
                        {q.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Printer className="h-3.5 w-3.5" />
          Tip: Practice writing answers before revealing.
        </div>
      </div>
    </main>
  );
}
