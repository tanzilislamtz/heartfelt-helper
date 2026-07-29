import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  Target,
  TrendingUp,
} from "lucide-react";
import { boards, subjects } from "@/data/quiz";
import { getChapters, getSubjectStats, practiceModes, type PracticeMode } from "@/data/practice";

export const Route = createFileRoute("/quiz/subject/$subjectId_/$category")({
  component: ChapterPicker,
});

function ChapterPicker() {
  const { subjectId, category } = Route.useParams();
  const subject = subjects.find((s) => s.id === subjectId);
  const mode = practiceModes.find((m) => m.id === (category as PracticeMode));

  if (!subject || !mode) {
    return (
      <section className="pt-10 text-center">
        <p className="text-sm text-muted-foreground">Not found.</p>
        <Link to="/quiz" className="mt-4 inline-block text-sm text-primary underline">
          Back to practice
        </Link>
      </section>
    );
  }

  const st = getSubjectStats(subject);
  const chapters = getChapters(subjectId);

  return (
    <section className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link
          to="/quiz/subject/$subjectId"
          params={{ subjectId }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border transition hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Link to="/quiz" className="hover:text-primary">Practice</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/quiz/subject/$subjectId" params={{ subjectId }} className="hover:text-primary">
          {subject.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{mode.name}</span>
      </div>

      {/* Header + stats */}
      <div className="grid gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-2xl text-primary-foreground shadow-sm">
            {subject.emoji}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {mode.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{mode.desc}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <HeadStat Icon={FileText} value={category === "cq" ? st.cq : st.mcq} label="Total Questions" />
          <HeadStat Icon={Target} value={category === "cq" ? st.cqAttempted : st.mcqAttempted} label="Attempted" />
          <HeadStat Icon={TrendingUp} value={`${category === "cq" ? st.cqAvg : st.accuracy}%`} label="Accuracy" />
          <HeadStat Icon={Clock} value={st.timeSpent} label="Total Time" />
        </div>
      </div>

      {category === "board" ? (
        <BoardList subjectId={subjectId} />
      ) : (
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-semibold text-foreground">Chapters</h2>
            <span className="text-xs text-muted-foreground">{chapters.length} chapters</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="divide-y divide-border">
              {chapters.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * i }}
                >
                  <Link
                    to="/quiz/subject/$subjectId/$category/$chapterId"
                    params={{ subjectId, category, chapterId: c.id }}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 transition hover:bg-muted/40 sm:gap-4"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/50 text-xs font-semibold text-primary">
                      {c.index}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <FileText className="h-3 w-3" /> {c.questions} Questions ·{" "}
                        {c.topics.length} topics
                      </p>
                      <div className="mt-2 flex items-center gap-2 sm:hidden">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
                        </div>
                        <span className="text-[11px] tabular-nums text-muted-foreground">{c.progress}%</span>
                      </div>
                    </div>
                    <div className="hidden shrink-0 items-center gap-3 sm:flex">
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {c.progress}% Completed
                      </span>
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground sm:hidden" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function HeadStat({
  Icon,
  value,
  label,
}: {
  Icon: typeof FileText;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border px-3 py-2">
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {value}
      </p>
      <p className="truncate text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function BoardList({ subjectId }: { subjectId: string }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-foreground">Choose a board</h2>
        <span className="text-xs text-muted-foreground">{boards.length} boards</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="divide-y divide-border">
          {boards.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 * i }}
            >
              <Link
                to="/quiz/exam/$subjectId"
                params={{ subjectId }}
                search={{ board: b.id, mode: "overview" as const }}
                className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-muted/40"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/50 text-xs font-semibold tracking-wider text-primary">
                  {b.short}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{b.name}</p>
                  <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {b.region}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
