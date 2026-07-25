import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MailQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { messageRequests, timeAgo } from "@/lib/requests";

export const Route = createFileRoute("/message/requests")({
  component: RequestsPane,
});

function RequestsPane() {
  return (
    <div className="flex h-[100dvh] min-w-0 flex-col overflow-hidden bg-surface lg:h-full lg:rounded-3xl lg:border lg:border-border lg:shadow-sm">
      {/* header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 safe-top">
        <Link
          to="/message"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-muted lg:hidden"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MailQuestion className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">Message requests</h2>
          <p className="truncate text-xs text-muted-foreground">
            {messageRequests.length} people you don&apos;t follow
          </p>
        </div>
      </div>



      <ul className="flex-1 space-y-1 overflow-y-auto overscroll-contain p-3">
        {messageRequests.map((r, i) => {
          const last = r.messages[r.messages.length - 1];
          return (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Link
                to="/message/request/$requestId"
                params={{ requestId: r.id }}
                className="flex items-start gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-muted"
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: r.avatarColor }}
                >
                  {r.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(last.at)}</span>
                  </div>
                  <p className="truncate text-[11px] uppercase tracking-wide text-primary/80">{r.role}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground font-bangla">{last.text}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground/70">
                      {r.messages.length}/3 messages
                    </span>
                    {r.mutual && (
                      <span className="truncate text-[10px] text-muted-foreground">{r.mutual}</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
