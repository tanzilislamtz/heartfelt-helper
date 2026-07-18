import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Learns Academy" },
      { name: "description", content: "Take quizzes, test your knowledge and climb the leaderboard on Learns Academy." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  return (
    <main className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Lightbulb className="h-6 w-6" />
        </div>
        <h1 className="h2">Quiz</h1>
        <p className="mt-2 body text-muted-foreground">
          Quizzes are coming soon — sharpen your skills, challenge friends, and earn XP.
        </p>
      </div>
    </main>
  );
}
