import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  FileText,
  ListChecks,
  PenLine,
  Target,
  TrendingUp,
} from "lucide-react";
import { subjects } from "@/data/quiz";
import { getSubjectStats, practiceModes } from "@/data/practice";
import { ProgressRing } from "@/components/ProgressRing";

export const Route = createFileRoute("/quiz/subject/$subjectId")({
  component: SubjectOverview,
});

function SubjectOverview() {
  const { subjectId } = Route.useParams();
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <section className="pt-10 text-center">
        <p className="text-sm text-muted-foreground">Subject not found.</p>
        <Link to="/quiz" className="mt-4 inline-block text-sm text-primary underline">
          Back to practice
        </Link>
      </section>
    );
  }

  const st = getSubjectStats(subject);

  const modeCards = [
    {
      mode: practiceModes[0],
      Icon: ListChecks,
      badge: "MCQ",
      cta: "Start MCQ Practice",
      stats: [
        { Icon: FileText, value: st.mcq, label: "Total Questions" },
        { Icon: Target, value: st.mcqAttempted, label: "Attempted" },
        { Icon: TrendingUp, value: `${st.accuracy}%`, label: "Accuracy" },
      ],
    },
    {
      mode: practiceModes[1],
      Icon: PenLine,
      badge: "CQ",
      cta: "Start CQ Practice",
      stats: [
        { Icon: FileText, value: st.cq, label: "Total Questions" },
        { Icon: Target, value: st.cqAttempted, label: "Attempted" },
        { Icon: TrendingUp, value: `${st.cqAvg}%`, label: "Average Score" },
      ],
    },
    {
      mode: practiceModes[2],
      Icon: BookOpen,
      badge: "Board",
      cta: "Explore Board Questions",
      stats: [
        { Icon: FileText, value: st.boardPapers, label: "Total Papers" },
        { Icon: Target, value: st.boardAttempted, label: "Attempted" },
        { Icon: TrendingUp, value: `${st.boardAvg}%`, label: "Average Score" },
      ],
    },
  ];

  return (
    <section className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          to="/quiz"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border transition hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Link to="/quiz" className="hover:text-primary">
          Practice
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate font-medium text-foreground">{subject.name}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Subject identity */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-accent/50 text-3xl">
              {subject.emoji}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                {subject.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {subject.nameBn} · chapter-wise practice, board patterns and instant AI explanations.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            {[
              `${st.chapters} Chapters`,
              `${st.mcq} MCQ`,
              `${st.cq} CQ`,
              `${st.boardPapers} Board Qs`,
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-lg border border-border px-2.5 py-1.5 font-medium text-muted-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Progress panel */}
        <div className="rounded-2xl border border-accent/50 bg-gradient-to-br from-accent/40 via-surface to-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Your Progress</p>
            <Link to="/quiz/progress" className="text-xs font-medium text-primary hover:underline">
              View Analytics
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={st.progress} />
            <div className="min-w-0 flex-1 space-y-4">
              <Stat
                top={`${st.chaptersDone} / ${st.chapters}`}
                label="Chapters Completed"
                pct={(st.chaptersDone / st.chapters) * 100}
              />
              <Stat
                top={`${st.mcqAttempted} / ${st.mcq}`}
                label="MCQ Attempted"
                pct={(st.mcqAttempted / st.mcq) * 100}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mode cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {modeCards.map(({ mode, Icon, badge, cta, stats }, i) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary/40 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Icon className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-accent/50 px-2.5 py-1 text-[11px] font-semibold text-primary">
                {badge}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{mode.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{mode.desc}</p>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
              {stats.map((s) => (
                <div key={s.label} className="min-w-0">
                  <p className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-foreground">
                    <s.Icon className="h-3.5 w-3.5 text-primary" />
                    {s.value}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/quiz/subject/$subjectId/$category"
              params={{ subjectId, category: mode.id }}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              {cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stat({ top, label, pct }: { top: string; label: string; pct: number }) {
  return (
    <div>
      <p className="text-sm font-semibold tabular-nums text-foreground">{top}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}
