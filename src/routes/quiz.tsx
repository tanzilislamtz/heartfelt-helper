import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { MobileNav } from "@/components/MobileNav";
import { LeftNav } from "@/components/LeftNav";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Practice — Learns Academy" },
      { name: "description", content: "Chapter-wise MCQ, CQ and board question practice with progress tracking." },
      { property: "og:title", content: "Practice — Learns Academy" },
      { property: "og:description", content: "Practise at your own pace with chapter-wise questions and AI explanations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizLayout,
});

function QuizLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <LeftNav />
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

