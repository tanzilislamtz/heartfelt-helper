import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { categories, subjects } from "@/data/quiz";

export const Route = createFileRoute("/quiz/subject/$subjectId")({
  component: SubjectCategoryPicker,
});

function SubjectCategoryPicker() {
  const { subjectId } = Route.useParams();
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <main className="min-h-screen bg-background pb-28 text-foreground">
        <div className="mx-auto max-w-3xl px-5 pt-16 text-center">
          <p className="text-sm text-muted-foreground">Subject not found.</p>
          <Link to="/quiz" className="mt-4 inline-block text-sm underline">Back to quiz</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-3xl px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-full border border-border">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">SSC · Science</p>
            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              {subject.name} <span className="text-muted-foreground">Test Paper</span>
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Choose a category. You'll then pick a board and start practicing.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
            >
              <Link
                to="/quiz/subject/$subjectId/$category"
                params={{ subjectId, category: c.id }}
                className={`group relative flex aspect-square flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${c.color} p-4 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl`}
              >
                <div className="flex items-start justify-between">
                  <h3 className={`text-lg font-extrabold leading-tight drop-shadow-sm ${c.id === "ka" || c.id === "kha" || c.id === "short" ? "font-bangla" : ""}`}>
                    {c.nameBn}
                  </h3>
                  <ChevronRight className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/80">
                    {c.perPaper} Qs
                  </span>
                  <span className="text-3xl drop-shadow-md">{c.emoji}</span>
                </div>
                <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Questions curated from real board papers. AI-powered explanations.
        </p>
      </div>
    </main>
  );
}
