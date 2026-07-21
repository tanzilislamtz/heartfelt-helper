import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";
import { boards, subjects } from "@/data/quiz";

export const Route = createFileRoute("/quiz/subject/$subjectId")({
  component: SubjectBoardPicker,
});

function SubjectBoardPicker() {
  const { subjectId } = Route.useParams();
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <main className="min-h-screen bg-background pb-28 text-foreground">
        <div className="mx-auto max-w-2xl px-5 pt-16 text-center">
          <p className="text-sm text-muted-foreground">Subject not found.</p>
          <Link to="/quiz" className="mt-4 inline-block text-sm underline">Back to quiz</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-full border border-border">
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${subject.color} text-2xl text-white shadow-sm`}>
            <span>{subject.emoji}</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">SSC · Science</p>
            <h1 className="text-2xl font-semibold tracking-tight">{subject.name}</h1>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Choose an education board. You'll get a 25-question paper from that board.
        </p>

        <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
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
                search={{ board: b.id, mode: "overview" }}
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
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Questions are curated from real board papers. Explanations by AI.
        </p>
      </div>
    </main>
  );
}
