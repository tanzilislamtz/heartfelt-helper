import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, X, Send, Search, Pencil, Check, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getMessengerState,
  subscribeMessenger,
  closeMessengerPopup,
  openChatWindow,
  closeChatWindow,
  toggleMinimizeChat,
} from "@/lib/messenger";
import {
  threads,
  getSortedThreads,
  getUnreadCounts,
  getAllLatest,
  getMessages,
  getThread,
  sendMessage,
  subscribe,
  formatTime,
} from "@/lib/chat";

const SERVER_STATE = { popupOpen: false, openChats: [] as string[], minimized: [] as string[] };

function useMessenger() {
  return useSyncExternalStore(subscribeMessenger, getMessengerState, () => SERVER_STATE);
}

function useChatStore() {
  return useSyncExternalStore(
    (cb) => subscribe(cb),
    () => JSON.stringify(getAllLatest()),
    () => "{}",
  );
}

export function MessengerDock() {
  const { popupOpen, openChats, minimized } = useMessenger();

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden lg:block">
      <AnimatePresence>{popupOpen && <MessagesPopup key="popup" />}</AnimatePresence>

      <div className="absolute bottom-0 right-4 flex items-end gap-3">
        <AnimatePresence>
          {openChats.map((id) => (
            <ChatWindow key={id} threadId={id} minimized={minimized.includes(id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MessagesPopup() {
  useChatStore();
  const latest = getAllLatest();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target)) return;
      if (target.closest("[data-messenger-trigger]")) return;
      closeMessengerPopup();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMessengerPopup();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const filtered = getSortedThreads().filter(
    (t) =>
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      (t.subject ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto absolute right-4 top-16 w-[360px] origin-top-right overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight">Chats</h2>
        <button
          aria-label="New chat"
          className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground/70 hover:bg-muted/70"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <div className="relative px-4 py-3">
        <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Messenger"
          className="h-9 w-full rounded-full border border-border bg-muted/60 pl-9 pr-3 text-sm outline-none focus:border-primary/40 focus:bg-surface"
        />
      </div>

      <ul className="max-h-[420px] overflow-y-auto px-2 pb-2">
        {filtered.map((t) => {
          const last = latest[t.id];
          return (
            <li key={t.id}>
              <button
                onClick={() => openChatWindow(t.id)}
                className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-muted"
              >
                <div className="relative shrink-0">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-full text-sm font-bold text-white"
                    style={{ background: t.avatarColor }}
                  >
                    {t.initials}
                  </div>
                  {t.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground font-bangla">
                    {last ? (last.from === "me" ? "You: " : "") + last.text : t.subject}
                  </p>
                </div>
                {last && (
                  <span className="shrink-0 text-[11px] text-muted-foreground">{formatTime(last.at)}</span>
                )}
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">No conversations found.</li>
        )}
      </ul>

      <div className="border-t border-border p-2">
        <Link
          to="/message"
          onClick={() => closeMessengerPopup()}
          className="block rounded-2xl py-2 text-center text-sm font-semibold text-primary hover:bg-muted"
        >
          See all in Messages
        </Link>
      </div>
    </motion.div>
  );
}

function ChatWindow({ threadId, minimized }: { threadId: string; minimized: boolean }) {
  const thread = getThread(threadId);
  const snap = useSyncExternalStore(
    (cb) => subscribe(cb),
    () => JSON.stringify(getMessages(threadId)),
    () => "[]",
  );
  void snap;
  const messages = getMessages(threadId);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, minimized]);

  if (!thread) return null;

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    sendMessage(threadId, v);
    setText("");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto flex w-[328px] flex-col overflow-hidden rounded-t-2xl border border-b-0 border-border bg-surface shadow-2xl"
      style={{ height: minimized ? 48 : 440 }}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <button
          onClick={() => toggleMinimizeChat(threadId)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
            style={{ background: thread.avatarColor }}
          >
            {thread.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{thread.name}</p>
            <p className="truncate text-[10px] text-muted-foreground">
              {thread.online ? "Active now" : thread.lastSeen ? `Active ${thread.lastSeen}` : thread.subject}
            </p>
          </div>
        </button>
        <button
          aria-label="Minimize"
          onClick={() => toggleMinimizeChat(threadId)}
          className="grid h-7 w-7 place-items-center rounded-full text-foreground/60 hover:bg-muted"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          aria-label="Close chat"
          onClick={() => closeChatWindow(threadId)}
          className="grid h-7 w-7 place-items-center rounded-full text-foreground/60 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!minimized && (
        <>
          <div className="flex-1 space-y-1.5 overflow-y-auto bg-muted/30 px-3 py-3">
            {messages.map((m) => {
              const mine = m.from === "me";
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-1.5 text-sm leading-relaxed font-bangla ${
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
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-2 border-t border-border bg-surface p-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Aa"
              className="h-9 flex-1 rounded-full border border-border bg-muted/50 px-3 text-sm outline-none focus:border-primary/40 font-bangla"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              aria-label="Send"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}
