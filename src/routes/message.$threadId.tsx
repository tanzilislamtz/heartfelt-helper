import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Check, CheckCheck, Paperclip, Smile } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getMessages, getThread, sendMessage, subscribe, formatTime } from "@/lib/chat";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/message/$threadId")({
  component: ThreadView,
});

function ThreadView() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const thread = getThread(threadId);

  const snap = useSyncExternalStore(
    (cb) => subscribe(cb),
    () => JSON.stringify(getMessages(threadId)),
    () => "[]",
  );
  const messages = getMessages(threadId);
  void snap;

  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!thread) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <p className="text-sm text-muted-foreground">Conversation not found.</p>
        <Link to="/message" className="mt-3 inline-block text-sm font-medium text-primary">
          Back to messages
        </Link>
      </div>
    );
  }

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    sendMessage(threadId, value);
    setText("");
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden border-border bg-surface lg:h-[calc(100vh-160px)] lg:min-h-[500px] lg:rounded-3xl lg:border lg:shadow-sm">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface px-4 py-3">

        <button
          onClick={() => navigate({ to: "/message" })}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-muted lg:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <div
            className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
            style={{ background: thread.avatarColor }}
          >
            {thread.initials}
          </div>
          {thread.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{thread.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {thread.online ? "Active now" : thread.lastSeen ? `Last seen ${thread.lastSeen}` : thread.subject}
          </p>
        </div>
        <button aria-label="Call" className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-muted">
          <Phone className="h-4 w-4" />
        </button>
        <button aria-label="Video" className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-muted">
          <Video className="h-4 w-4" />
        </button>
        <button aria-label="More" className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-muted">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto bg-muted/30 px-4 py-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => {
            const mine = m.from === "me";
            const prev = messages[i - 1];
            const showTime = !prev || m.at - prev.at > 1000 * 60 * 10;
            return (
              <div key={m.id}>
                {showTime && (
                  <div className="my-3 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {formatTime(m.at)}
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed font-bangla ${
                      mine
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md border border-border bg-surface text-foreground"
                    }`}
                  >
                    {m.text}
                    {mine && (
                      <span className="ml-1.5 inline-flex translate-y-0.5 items-center text-[10px] opacity-80">
                        {m.status === "read" ? (
                          <CheckCheck className="h-3 w-3 text-accent" />
                        ) : m.status === "delivered" ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="sticky bottom-0 z-10 flex items-end gap-2 border-t border-border bg-surface p-3 pb-[calc(env(safe-area-inset-bottom)+96px)] lg:pb-3"
      >
        <button type="button" aria-label="Attach" className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-muted">
          <Paperclip className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-end gap-2 rounded-3xl border border-border bg-muted/50 px-3 py-1.5">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Write a message…"
            className="max-h-32 flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground font-bangla"
          />
          <button type="button" aria-label="Emoji" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-foreground/60 hover:bg-surface">
            <Smile className="h-4 w-4" />
          </button>
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send"
          className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
