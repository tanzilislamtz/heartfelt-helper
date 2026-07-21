import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";
import { boards, categories, subjects, type CategoryId } from "@/data/quiz";

export const Route = createFileRoute("/quiz/subject/$subjectId/$category")({
  component: BoardPicker,
});

function BoardPicker() {
  const { subjectId, category } = Route.useParams();
  const subject = subjects.find((s) => s.id === subjectId);
  const cat = categories.find((c) => c.id === (category as CategoryId));
  if (!subject || !cat) throw notFound();

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <Link
          to="/quiz/subject/$subjectId"
          params={{ subjectId }}
          className="grid h-10 w-10 place-items-center rounded-full border border-border"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${cat.color} text-2xl text-white shadow-sm`}>
            <span>{cat.emoji}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {subject.name} · <span className="font-bangla">{cat.nameBn}</span>
            </p>
            <h1 className="truncate text-2xl font-semibold tracking-tight">{cat.name}</h1>
            <p className="text-xs text-muted-foreground">{cat.tagline}</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Choose an education board. You'll get a {cat.perPaper}-question paper from that board.
        </p>

        <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
          {boards.map((b, i) => {
            const linkProps =
              cat.id === "mcq"
                ? { to: "/quiz/exam/$subjectId" as const, params: { subjectId }, search: { board: b.id, mode: "overview" as const } }
                : { to: "/quiz/written/$subjectId" as const, params: { subjectId }, search: { board: b.id, type: cat.id } };
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * i }}
              >
                <Link
                  {...linkProps}
                  className="group flex items-center gap-4 p-4 transition hover:bg-muted/50"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-xs font-semibold tracking-wider text-foreground">
                    {b.short}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {b.region}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
