import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  X,
  Send,
  Search,
  Pencil,
  Check,
  CheckCheck,
  Phone,
  MoreHorizontal,
  User,
  Images,
  Palette,
  BellOff,
  Bell,
  Ban,
  Trash2,
  Pin,
  PinOff,
  Archive,
  CornerUpLeft,
  Forward,
  Copy,
  Smile,
} from "lucide-react";
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
  markRead,
  getAllLatest,
  getMessages,
  getThread,
  sendMessage,
  subscribe,
  formatTime,
  setReaction,
  deleteMessage,
  type ChatThread,
  type ChatMessage,
} from "@/lib/chat";
import CallOverlay from "@/components/CallOverlay";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

function DockToast({ text }: { text: string | null }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-lg"
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuRow({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition hover:bg-muted ${
        danger ? "text-red-500" : "text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

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
  const unread = getUnreadCounts();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ thread: ChatThread; x: number; y: number } | null>(null);
  const [confirm, setConfirm] = useState<{ thread: ChatThread; kind: "delete" | "block" } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [muted, setMuted] = useState<string[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const notify = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 1800);
  };
  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target)) return;
      if (target.closest("[data-dock-menu]")) return;
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

  const filtered = getSortedThreads()
    .filter((t) => !hidden.includes(t.id))
    .filter(
      (t) =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        (t.subject ?? "").toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id)));

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
          const n = unread[t.id] ?? 0;
          const isUnread = n > 0;
          return (
            <li key={t.id}>
              <button
                onClick={() => openChatWindow(t.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenu({ thread: t, x: e.clientX, y: e.clientY });
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-muted ${
                  isUnread ? "bg-primary/[0.06]" : ""
                }`}
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
                  <p className={`flex items-center gap-1 truncate text-sm ${isUnread ? "font-extrabold" : "font-semibold"}`}>
                    {t.name}
                    {pinned.includes(t.id) && <Pin className="h-3 w-3 shrink-0 text-primary" />}
                    {muted.includes(t.id) && <BellOff className="h-3 w-3 shrink-0 text-muted-foreground" />}
                  </p>
                  <p
                    className={`truncate text-xs font-bangla ${
                      isUnread ? "font-bold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {last ? (last.from === "me" ? "You: " : "") + last.text : t.subject}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {last && (
                    <span className={`text-[11px] ${isUnread ? "font-bold text-primary" : "text-muted-foreground"}`}>
                      {formatTime(last.at)}
                    </span>
                  )}
                  {isUnread && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {n}
                    </span>
                  )}
                </div>
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

      <AnimatePresence>
        {menu && (
          <motion.div
            data-dock-menu
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenu(null)}
            className="pointer-events-auto fixed inset-0 z-[85]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                left: Math.min(menu.x - 110, window.innerWidth - 250),
                top: Math.min(menu.y - 20, window.innerHeight - 300),
              }}
              className="absolute w-60 rounded-2xl border border-border bg-surface p-1.5 shadow-2xl"
            >
              <div className="flex items-center gap-2 px-2 py-2">
                <div
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: menu.thread.avatarColor }}
                >
                  {menu.thread.initials}
                </div>
                <p className="min-w-0 truncate text-sm font-semibold">{menu.thread.name}</p>
              </div>
              <div className="my-1 h-px bg-border" />
              <MenuRow
                icon={<MessageOpenIcon />}
                label="Open chat"
                onClick={() => {
                  openChatWindow(menu.thread.id);
                  setMenu(null);
                }}
              />
              {(unread[menu.thread.id] ?? 0) > 0 && (
                <MenuRow
                  icon={<Check className="h-4 w-4 text-primary" />}
                  label="Mark as read"
                  onClick={() => {
                    markRead(menu.thread.id);
                    setMenu(null);
                    notify("Marked as read");
                  }}
                />
              )}
              <MenuRow
                icon={
                  muted.includes(menu.thread.id) ? (
                    <Bell className="h-4 w-4 text-primary" />
                  ) : (
                    <BellOff className="h-4 w-4 text-primary" />
                  )
                }
                label={muted.includes(menu.thread.id) ? "Unmute notifications" : "Mute notifications"}
                onClick={() => {
                  const was = muted.includes(menu.thread.id);
                  toggle(muted, setMuted, menu.thread.id);
                  setMenu(null);
                  notify(was ? "Notifications on" : "Notifications muted");
                }}
              />
              <MenuRow
                icon={
                  pinned.includes(menu.thread.id) ? (
                    <PinOff className="h-4 w-4 text-primary" />
                  ) : (
                    <Pin className="h-4 w-4 text-primary" />
                  )
                }
                label={pinned.includes(menu.thread.id) ? "Unpin chat" : "Pin chat"}
                onClick={() => {
                  const was = pinned.includes(menu.thread.id);
                  toggle(pinned, setPinned, menu.thread.id);
                  setMenu(null);
                  notify(was ? "Chat unpinned" : "Chat pinned to top");
                }}
              />
              <MenuRow
                icon={<Archive className="h-4 w-4 text-primary" />}
                label="Archive chat"
                onClick={() => {
                  setHidden((h) => [...h, menu.thread.id]);
                  setMenu(null);
                  notify("Chat archived");
                }}
              />
              <div className="my-1 h-px bg-border" />
              <MenuRow
                icon={<Ban className="h-4 w-4 text-red-500" />}
                label="Block user"
                danger
                onClick={() => {
                  setConfirm({ thread: menu.thread, kind: "block" });
                  setMenu(null);
                }}
              />
              <MenuRow
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                label="Delete chat"
                danger
                onClick={() => {
                  setConfirm({ thread: menu.thread, kind: "delete" });
                  setMenu(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirm && (
          <motion.div
            data-dock-menu
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirm(null)}
            className="pointer-events-auto fixed inset-0 z-[90] grid place-items-center bg-black/45 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-border bg-surface p-5 shadow-2xl"
            >
              <h3 className="text-base font-bold">
                {confirm.kind === "delete" ? "Delete chat?" : `Block ${confirm.thread.name.split(" ")[0]}?`}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {confirm.kind === "delete"
                  ? "This conversation will be removed from your inbox only."
                  : "They won't be able to message or call you."}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setConfirm(null)}
                  className="flex-1 rounded-2xl border border-border px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setHidden((h) => [...h, confirm.thread.id]);
                    notify(confirm.kind === "delete" ? "Chat deleted" : "User blocked");
                    setConfirm(null);
                  }}
                  className="flex-1 rounded-2xl bg-red-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  {confirm.kind === "delete" ? "Delete" : "Block"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DockToast text={toast} />
    </motion.div>
  );
}

function MessageOpenIcon() {
  return <Send className="h-4 w-4 text-primary" />;
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
    if (minimized) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const id = window.setTimeout(() => markRead(threadId), 300);
    return () => window.clearTimeout(id);
  }, [messages.length, minimized, threadId]);

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
