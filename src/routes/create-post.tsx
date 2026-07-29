import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreatePostForm } from "@/components/CreatePostForm";
import { Topbar } from "@/components/Topbar";
import { MobileNav } from "@/components/MobileNav";
import { LeftNav } from "@/components/LeftNav";
import { isAuthed } from "@/lib/session";

export const Route = createFileRoute("/create-post")({
  component: CreatePostPage,
  head: () => ({
    meta: [
      { title: "Create Post · Learns Academy" },
      { name: "description", content: "Share knowledge, ask a question, or find tutors and students on Learns Academy." },
    ],
  }),
});

function CreatePostPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthed()) navigate({ to: "/login" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background lg:h-[100dvh] lg:overflow-hidden">
      <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 pb-24 pt-4 sm:px-6 sm:pt-6 lg:h-[calc(100dvh-65px)] lg:grid-cols-[240px_minmax(0,1fr)] lg:overflow-hidden lg:px-8 lg:pb-6">
        <LeftNav stickyClass="lg:h-full" />
        <div className="min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          <CreatePostForm />
        </div>
      </main>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}


