import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreatePostForm } from "@/components/CreatePostForm";
import { Topbar } from "@/components/Topbar";
import { MobileNav } from "@/components/MobileNav";
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
    <div className="min-h-screen bg-background">
      <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6 lg:pb-10">
        <CreatePostForm />
      </main>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

