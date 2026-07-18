import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    if (!isSignedIn()) navigate({ to: "/login" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Topbar variant="app" />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6 lg:pb-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface text-foreground/70 transition hover:border-primary/40 hover:text-primary"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold sm:text-2xl">Create Post</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                Share knowledge, ask questions, or connect with tutors & students.
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:border-primary/40 hover:text-primary">
            <FileText className="h-3.5 w-3.5" /> My Drafts
          </button>
        </motion.div>

        <CreatePostForm />
      </main>

      <MobileNav />
    </div>
  );
}
