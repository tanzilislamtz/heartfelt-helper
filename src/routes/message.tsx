import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/message")({
  head: () => ({
    meta: [
      { title: "Messages — Learns Academy" },
      { name: "description", content: "Chat with tutors, students and parents on Learns Academy." },
    ],
  }),
  component: MessagePage,
});

function MessagePage() {
  return (
    <main className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h1 className="h2">Messages</h1>
        <p className="mt-2 body text-muted-foreground">
          Your conversations will appear here. Start a chat from any profile or post.
        </p>
      </div>
    </main>
  );
}
