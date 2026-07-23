import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Sparkles, ChevronRight } from "lucide-react";
import { categories, subjects } from "@/data/quiz";

export const Route = createFileRoute("/quiz/subject/$subjectId")({
  component: SubjectCategoryPicker,
});

function SubjectCategoryPicker() {
  const { subjectId } = Route.useParams();
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <section className="mx-auto max-w-3xl px-1 pt-10 text-center">
        <p className="text-sm text-muted-foreground">Subject not found.</p>
        <Link to="/quiz" className="mt-4 inline-block text-sm text-primary underline">
          Back to quiz
        </Link>
      </section>
    );
  }

  const featured = categories[0];
  const rest = categories.slice(1);

  return (
    <section className="space-y-5">
      {/* Header — same surface language as home & new quiz hub */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_30px_rgb(41,44,117,0.08)]">
        <div className="flex items-start gap-4">
          <Link
            to="/quiz"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> SSC · Science
            </div>
            <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              {subject.name}{" "}
              <span className="font-normal text-muted-foreground">· {subject.nameBn}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a paper style. You'll choose a board next, then jump straight in.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-accent/40 px-2.5 py-1 font-medium text-primary">
                {(subject.questions / 1000).toFixed(1)}k questions
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                5 paper types
              </span>
            </div>
          </div>
          <div className="hidden shrink-0 sm:grid h-14 w-14 place-items-center rounded-2xl bg-accent/40 text-2xl text-primary">
            {subject.emoji}
          </div>
        </div>
      </div>

      {/* Featured — the "best" pick, matches home's Best Tutor card energy */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-accent/50 bg-gradient-to-br from-accent/40 via-surface to-surface p-4 shadow-sm"
      >
        <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/30 blur-2xl" />
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Most popular
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-2xl text-primary-foreground shadow-md">
            {featured.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {featured.name}{" "}
              <span className="text-xs text-muted-foreground">· {featured.perPaper} questions</span>
            </p>
            <p className="truncate text-xs text-muted-foreground">{featured.tagline}</p>
            <p className="mt-0.5 text-[11px] text-primary">Board picker opens next</p>
          </div>
          <Link
            to="/quiz/subject/$subjectId/$category"
            params={{ subjectId, category: featured.id }}
            className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            Start <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <Link
          to="/quiz/subject/$subjectId/$category"
          params={{ subjectId, category: featured.id }}
          className="mt-4 flex sm:hidden w-full items-center justify-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
        >
          Start {featured.name} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      {/* Rest — editorial list, same language as tools list on hub */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Other paper types <span className="font-normal text-muted-foreground">· {rest.length} more</span>
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-surface shadow-sm">
          <div className="divide-y divide-border">
            {rest.map((c, i) => {
              const isBangla = c.id === "ka" || c.id === "kha" || c.id === "short";
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <Link
                    to="/quiz/subject/$subjectId/$category"
                    params={{ subjectId, category: c.id }}
                    className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-muted/40"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/40 text-xl text-primary">
                      {c.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`truncate text-sm font-semibold text-foreground ${isBangla ? "font-bangla" : ""}`}>
                          {c.nameBn}
                        </p>
                        {c.nameBn !== c.name && (
                          <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                            · {c.name}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{c.tagline}</p>
                    </div>
                    <span className="hidden shrink-0 rounded-full bg-accent/40 px-2.5 py-1 text-[11px] font-medium text-primary sm:inline">
                      {c.perPaper} Qs
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Questions curated from real board papers · AI-powered explanations.
      </p>
    </section>
  );
}
