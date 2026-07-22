import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { clearUnread, incrementUnread } from "@/lib/notifications";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Topbar } from "@/components/Topbar";
import { MobileNav } from "@/components/MobileNav";
import { LeftNav } from "@/components/LeftNav";

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
  const unread = useUnreadMessages();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => clearUnread(), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 pb-28 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <LeftNav />
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            {unread > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                {unread} new
              </span>
            )}
          </div>
          <h1 className="h2">Messages</h1>
          <p className="mt-2 body text-muted-foreground">
            Your conversations will appear here. Start a chat from any profile or post.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => clearUnread()}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
            </button>
            <button
              type="button"
              onClick={() => incrementUnread(1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              Simulate new message
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
