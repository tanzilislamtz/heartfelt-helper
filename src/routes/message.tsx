import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { MessageSquare, Search, Pencil } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { clearUnread } from "@/lib/notifications";
import { Topbar } from "@/components/Topbar";
import { MobileNav } from "@/components/MobileNav";
import { LeftNav } from "@/components/LeftNav";
import { threads, getAllLatest, subscribe, formatTime } from "@/lib/chat";

export const Route = createFileRoute("/message")({
  head: () => ({
    meta: [
      { title: "Messages — Learns Academy" },
      { name: "description", content: "Chat with tutors, students and parents on Learns Academy." },
    ],
  }),
  component: MessageLayout,
});

function useLatest() {
  return useSyncExternalStore(
    (cb) => subscribe(cb),
    () => JSON.stringify(getAllLatest()),
    () => "{}",
  );
}

function MessageLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inThread = pathname !== "/message" && pathname.startsWith("/message/");

  useEffect(() => {
    const t = window.setTimeout(() => clearUnread(), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header visible everywhere, hidden on mobile only inside a thread */}
      <div className={inThread ? "hidden lg:block" : "block"}>
        <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main
        className={`mx-auto grid max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8 lg:py-6 lg:pb-28 ${
          inThread ? "px-0 py-0" : "px-4 py-4 pb-28"
        }`}
      >
        <LeftNav />
        <div className="min-w-0">
          <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* Threads list — hidden on mobile when inside a thread */}
            <section className={`${inThread ? "hidden lg:block" : "block"}`}>
              <ThreadList />
            </section>
            {/* Thread view or empty state */}
            <section className={`${inThread ? "block" : "hidden lg:block"}`}>
              {inThread ? <Outlet /> : <EmptyPane />}
            </section>
          </div>
        </div>
      </main>
    </div>
  );

}

function ThreadList() {
  useLatest();
  const latest = getAllLatest();
  const [q, setQ] = useState("");
  const filtered = threads.filter((t) =>
    t.name.toLowerCase().includes(q.toLowerCase()) || (t.subject ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Messages</h1>
            <p className="text-xs text-muted-foreground">{threads.length} conversations</p>
          </div>
        </div>
        <button
          aria-label="New chat"
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-95"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search conversations"
          className="h-10 w-full rounded-full border border-border bg-muted/60 pl-9 pr-3 text-sm outline-none focus:border-primary/40 focus:bg-surface focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <ul className="space-y-1">
        {filtered.map((t) => {
          const last = latest[t.id];
          return (
            <li key={t.id}>
              <Link
                to="/message/$threadId"
                params={{ threadId: t.id }}
                className="group flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-muted"
                activeProps={{ className: "bg-accent/40" }}
              >
                <div className="relative shrink-0">
                  <div
                    className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white"
                    style={{ background: t.avatarColor }}
                  >
                    {t.initials}
                  </div>
                  {t.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    {last && (
                      <span className="shrink-0 text-[11px] text-muted-foreground">{formatTime(last.at)}</span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground font-bangla">
                    {last ? (last.from === "me" ? "You: " : "") + last.text : t.subject}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyPane() {
  return (
    <div className="hidden h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface p-10 text-center lg:flex">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
        <MessageSquare className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Pick a conversation</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Select a chat from the left to see messages, or start a new one from any tutor or student profile.
      </p>
    </div>
  );
}
