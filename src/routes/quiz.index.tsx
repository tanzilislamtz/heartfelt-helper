import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ChevronRight, GraduationCap, Sparkles } from "lucide-react";
import { subjects } from "@/data/quiz";
import { getSubjectStats } from "@/data/practice";

export const Route = createFileRoute("/quiz/")({
  head: () => ({
    meta: [
      { title: "Practice — Learns Academy" },
      { name: "description", content: "Chapter-wise MCQ, CQ and board question practice with live progress tracking." },
      { property: "og:title", content: "Practice — Learns Academy" },
      { property: "og:description", content: "Pick a subject, choose a chapter and practice at your own pace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PracticeHub,
});

function PracticeHub() {
  const list = subjects.map((s) => ({ s, st: getSubjectStats(s) }));
  const cont = list[2] ?? list[0];

  return (
    <section className="space-y-6">
      {/* Page head */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Practice
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Select a subject to start practicing</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" /> Class 10
          </span>
          <span className="hidden rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground sm:inline">
            SSC Science
          </span>
        </div>
      </div>

      {/* Continue learning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-accent/50 bg-gradient-to-br from-accent/50 via-surface to-surface p-5 shadow-[0_10px_40px_-20px_rgb(41,44,117,0.4)]"
      >
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/40 blur-3xl" />
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Continue learning
            </p>
            <h2 className="mt-2 truncate text-xl font-semibold text-foreground sm:text-2xl">
              {cont.s.name}
              <span className="text-muted-foreground"> · Chapter {1}</span>
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 align-middle text-[11px] font-semibold text-primary">
                MCQ
              </span>
            </h2>
            <div className="mt-4 max-w-sm">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${cont.st.progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {cont.st.progress}% completed
              </p>
            </div>
          </div>
          <Link
            to="/quiz/subject/$subjectId"
            params={{ subjectId: cont.s.id }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      {/* Subjects */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-foreground">All Subjects</h2>
          <span className="text-xs text-muted-foreground">{subjects.length} subjects</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {list.map(({ s, st }, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
            >
              <Link
                to="/quiz/subject/$subjectId"
                params={{ subjectId: s.id }}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/50 text-xl">
                    {s.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{s.nameBn}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-0.5 text-[11px] text-muted-foreground">
                  <p className="inline-flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {st.chapters} Chapters
                  </p>
                  <p>{st.mcq} MCQ</p>
                  <p>{st.cq} CQ</p>
                </div>

                <div className="mt-auto pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${st.progress}%` }}
                        transition={{ duration: 0.7, delay: 0.1 + 0.03 * i }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums text-foreground">
                      {st.progress}%
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mock test entry */}
      <Link
        to="/quiz/mock-test"
        className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:border-primary/40 hover:bg-muted/30"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Ready for a full exam?</p>
          <p className="truncate text-xs text-muted-foreground">
            Build a timed mock test across subjects
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </Link>
    </section>
  );
}
