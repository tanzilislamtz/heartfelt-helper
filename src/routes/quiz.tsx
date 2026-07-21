import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Topbar } from "@/components/Topbar";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Learns Academy" },
      { name: "description", content: "Mock tests, question bank, AI solver, leaderboard — all your prep in one place." },
      { property: "og:title", content: "Quiz — Learns Academy" },
      { property: "og:description", content: "Practise at your own pace with board-wise question papers and AI explanations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizLayout,
});

function QuizLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar variant="app" />
      <Outlet />
    </div>
  );
}
