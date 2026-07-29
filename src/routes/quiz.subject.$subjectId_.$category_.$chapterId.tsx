import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Gauge,
  Users,
} from "lucide-react";
import { subjects } from "@/data/quiz";
import { getChapters, practiceModes, type PracticeMode, type PracticeTopic } from "@/data/practice";
import { ProgressRing } from "@/components/ProgressRing";

export const Route = createFileRoute("/quiz/subject/$subjectId_/$category_/$chapterId")({
  component: ChapterTopics,
});

function ChapterTopics() {
  const { subjectId, category, chapterId } = Route.useParams();
  const subject = subjects.find((s) => s.id === subjectId);
  const mode = practiceModes.find((m) => m.id === (category as PracticeMode));
  const chapter = getChapters(subjectId).find((c) => c.id === chapterId);
  const [activeId, setActiveId] = useState<string | null>(chapter?.topics[0]?.id ?? null);

  if (!subject || !mode || !chapter) {
    return (
      <section className="pt-10 text-center">
        <p className="text-sm text-muted-foreground">Chapter not found.</p>
        <Link to="/quiz" className="mt-4 inline-block text-sm text-primary underline">
          Back to practice
        </Link>
      </section>
    );
  }

  const active = chapter.topics.find((t) => t.id === activeId) ?? chapter.topics[0];
  const attempted = Math.round((chapter.questions * chapter.progress) / 100);

  return (
    <section className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link
          to="/quiz/subject/$subjectId/$category"
          params={{ subjectId, category }}
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
        <Link
          to="/quiz/subject/$subjectId/$category"
          params={{ subjectId, category }}
          className="hover:text-primary"
        >
          {mode.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{chapter.name}</span>
      </div>

      {/* Chapter head */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-2xl text-primary">
              {subject.emoji}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {chapter.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Learn and practice questions from this chapter, topic by topic.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat Icon={FileText} value={`${chapter.questions}`} label="Questions" />
            <MiniStat Icon={Clock} value={`${chapter.topics.length * 5} min`} label="Est. Time" />
            <MiniStat Icon={Gauge} value="Medium" label="Difficulty" />
            <MiniStat Icon={Users} value={`${chapter.progress}%`} label="Your Progress" />
          </div>
        </div>

        <div className="rounded-2xl border border-accent/50 bg-gradient-to-br from-accent/40 via-surface to-surface p-5 shadow-sm">
          <p className="text-sm font-semibold text-foreground">Chapter Progress</p>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={chapter.progress} />
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {attempted} / {chapter.questions}
                </p>
                <p className="text-[11px] text-muted-foreground">Questions Attempted</p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${chapter.progress}%` }} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {chapter.topics.length} topics
                </p>
                <p className="text-[11px] text-muted-foreground">In this chapter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics + detail */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Topics</p>
          </div>
          <div className="divide-y divide-border">
            {chapter.topics.map((t, i) => {
              const isActive = t.id === active?.id;
              const done = t.progress >= 100;
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 text-left transition ${
                    isActive ? "bg-accent/30" : "hover:bg-muted/40"
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/50 text-primary">
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {t.questions} Questions · {t.difficulty} · {t.minutes} min
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${t.progress}%` }} />
                      </div>
                      <span className="text-[11px] tabular-nums text-muted-foreground">{t.progress}%</span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      done
                        ? "border border-border text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {done ? "Review" : t.progress > 0 ? "Continue" : "Start"}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {active && (
            <motion.aside
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-accent/50 bg-gradient-to-br from-accent/40 via-surface to-surface p-5 shadow-sm lg:sticky lg:top-24"
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-2xl text-primary-foreground shadow-sm">
                {subject.emoji}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{active.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Understand the core idea of this topic and practice questions built from real board
                patterns.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" /> {active.questions} Questions
                </li>
                <li className="flex items-center gap-2">
                  <Gauge className="h-3.5 w-3.5 text-primary" /> {active.difficulty} Difficulty
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {active.minutes} min Estimated Time
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-primary" /> {active.classAvg}% Class Average
                </li>
              </ul>
              <Link
                to="/quiz/exam/$subjectId"
                params={{ subjectId }}
                search={{ board: "dhaka", mode: "exam" as const }}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
              >
                Start Practice <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function MiniStat({
  Icon,
  value,
  label,
}: {
  Icon: typeof FileText;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border px-3 py-2">
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {value}
      </p>
      <p className="truncate text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
