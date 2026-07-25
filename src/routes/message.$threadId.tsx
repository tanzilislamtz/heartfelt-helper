import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Send,
  Phone,
  MoreVertical,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  User,
  BellOff,
  Search,
  Palette,
  Image as ImageIcon,
  Pin,
  Archive,
  Trash2,
  Ban,
  Flag,
  ChevronRight,
  CircleDot,
  Reply,
  Forward,
  Copy,
  X,
} from "lucide-react";
import logoAsset from "@/assets/learns-academy-logo.png.asset.json";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getMessages,
  getThread,
  sendMessage,
  subscribe,
  formatTime,
  markRead,
  isTyping,
  setReaction,
  deleteMessage,
  type ChatMessage,
} from "@/lib/chat";
import { AnimatePresence, motion } from "framer-motion";
import CallOverlay, { type CallKind } from "@/components/CallOverlay";

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

  const [openMenu, setOpenMenu] = useState<null | "profile" | "more">(null);
  const [call, setCall] = useState<null | CallKind>(null);
  const [notifMuted, setNotifMuted] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [msgMenu, setMsgMenu] = useState<{ msg: ChatMessage; x: number; y: number } | null>(null);
  const longPress = useRef<number | null>(null);
  const typing = isTyping(threadId);

  const notify = (msg: string) => {
    setToast(msg);
    setOpenMenu(null);
    window.setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [openMenu]);


  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const id = window.setTimeout(() => markRead(threadId), 300);
    return () => window.clearTimeout(id);
  }, [messages.length, threadId]);

  // Keep the chat shell locked to the visual viewport so the mobile keyboard
  // never pushes/crops the header or composer.
  const [vv, setVv] = useState<{ height: number; top: number } | null>(null);
  useEffect(() => {
    const viewport = typeof window !== "undefined" ? window.visualViewport : null;
    if (!viewport) return;
    const update = () => {
      setVv({ height: viewport.height, top: viewport.offsetTop });
      bottomRef.current?.scrollIntoView({ block: "end" });
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);


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
    sendMessage(threadId, value, replyTo ?? undefined);
    setText("");
    setReplyTo(null);
  };

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 1024 : false;
  const shellStyle =
    isMobile && vv
      ? { height: `${vv.height}px`, top: `${vv.top}px`, bottom: "auto" as const, left: 0, right: 0, width: "100%" }
      : undefined;

  return (
    <div
      style={shellStyle}
      className="fixed inset-x-0 bottom-0 top-0 z-30 flex w-full max-w-[100vw] flex-col overflow-hidden overscroll-none border-border bg-surface lg:static lg:z-auto lg:h-full lg:min-h-0 lg:max-w-full lg:rounded-3xl lg:border lg:shadow-sm"
    >

      {/* Brand bar (mobile) */}
      <div className="flex shrink-0 items-center justify-center border-b border-border bg-surface px-3 pb-2 pt-[calc(env(safe-area-inset-top)+0.75rem)] lg:hidden">
        <img src={logoAsset.url} alt="Learns Academy" className="h-7 w-auto" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex shrink-0 items-center gap-2 border-b border-border bg-surface px-3 py-2.5 sm:px-4 lg:py-3">
        <button
          onClick={() => navigate({ to: "/message" })}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-muted lg:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu(openMenu === "profile" ? null : "profile");
          }}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-1 py-1 text-left transition hover:bg-muted/60"
        >
          <div className="relative shrink-0">
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
            <p className="flex items-center gap-1 truncate text-sm font-semibold">
              {thread.name}
              {notifMuted && <BellOff className="h-3 w-3 shrink-0 text-muted-foreground" />}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {thread.online ? "Active now" : thread.lastSeen ? `Last seen ${thread.lastSeen}` : thread.subject}
            </p>
          </div>
        </button>

        <button
          onClick={() => setCall("audio")}
          aria-label="Call"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-primary hover:bg-primary/10"
        >
          <Phone className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu(openMenu === "more" ? null : "more");
          }}
          aria-label="More"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground/70 hover:bg-muted"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {/* Profile popover */}
        <AnimatePresence>
          {openMenu === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-3 top-full z-30 mt-1 w-72 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-xl"
            >
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div
                  className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: thread.avatarColor }}
                >
                  {thread.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{thread.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{thread.subject}</p>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setOpenMenu(null)}
                className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-muted"
              >
                <User className="h-4 w-4 text-primary" /> প্রোফাইল ভিজিট করুন
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
              <MenuItem
                icon={<Search className="h-4 w-4 text-primary" />}
                label="চ্যাটে খুঁজুন"
                onClick={() => notify("Search in conversation")}
              />
              <MenuItem
                icon={<ImageIcon className="h-4 w-4 text-primary" />}
                label="মিডিয়া ও ফাইল দেখুন"
                onClick={() => notify("Media & files")}
              />
              <MenuItem
                icon={<Palette className="h-4 w-4 text-primary" />}
                label="থিম পরিবর্তন করুন"
                onClick={() => notify("Theme changed")}
              />

            </motion.div>
          )}
        </AnimatePresence>

        {/* Three-dot menu */}
        <AnimatePresence>
          {openMenu === "more" && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-3 top-full z-30 mt-1 w-64 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-xl"
            >
              <MenuItem
                icon={<CircleDot className="h-4 w-4 text-primary" />}
                label="Mark as unread"
                onClick={() => notify("Marked as unread")}
              />
              <MenuItem
                icon={<Pin className="h-4 w-4 text-primary" />}
                label={pinned ? "Unpin conversation" : "Pin conversation"}
                onClick={() => {
                  setPinned((v) => !v);
                  notify(pinned ? "Unpinned" : "Pinned to top");
                }}
              />
              <MenuItem
                icon={<BellOff className="h-4 w-4 text-primary" />}
                label={notifMuted ? "Unmute" : "Mute notifications"}
                onClick={() => {
                  setNotifMuted((v) => !v);
                  notify(notifMuted ? "Notifications on" : "Notifications muted");
                }}
              />
              <MenuItem
                icon={<Archive className="h-4 w-4 text-primary" />}
                label="Archive chat"
                onClick={() => notify("Archived")}
              />
              <MenuItem
                icon={<Flag className="h-4 w-4 text-primary" />}
                label="Report"
                onClick={() => notify("Reported (demo)")}
              />
              <MenuItem
                icon={<Ban className="h-4 w-4 text-red-500" />}
                label="Block"
                danger
                onClick={() => notify("User blocked (demo)")}
              />

              <MenuItem
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                label="Delete chat"
                danger
                onClick={() => notify("Chat deleted (demo)")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain bg-muted/30 py-4 safe-x">
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
                    data-allow-contextmenu
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMsgMenu({ msg: m, x: e.clientX, y: e.clientY });
                    }}
                    onTouchStart={(e) => {
                      const t = e.touches[0];
                      longPress.current = window.setTimeout(
                        () => setMsgMenu({ msg: m, x: t.clientX, y: t.clientY }),
                        420,
                      );
                    }}
                    onTouchEnd={() => {
                      if (longPress.current) window.clearTimeout(longPress.current);
                    }}
                    onTouchMove={() => {
                      if (longPress.current) window.clearTimeout(longPress.current);
                    }}
                    className={`relative max-w-[78%] select-none whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed font-bangla ${
                      mine
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md border border-border bg-surface text-foreground"
                    } ${m.reaction ? "mb-3" : ""}`}
                  >
                    {m.replyTo && (
                      <div
                        className={`mb-1.5 truncate rounded-lg border-l-2 px-2 py-1 text-[11px] ${
                          mine
                            ? "border-white/60 bg-white/15 text-primary-foreground/85"
                            : "border-primary/50 bg-muted text-muted-foreground"
                        }`}
                      >
                        {m.replyTo.text}
                      </div>
                    )}
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
                    {m.reaction && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -bottom-3 ${mine ? "right-2" : "left-2"} rounded-full border border-border bg-surface px-1.5 py-0.5 text-[11px] shadow-sm`}
                      >
                        {m.reaction}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-surface px-3.5 py-2.5">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Message action sheet */}
      <AnimatePresence>
        {msgMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMsgMenu(null)}
            className="fixed inset-0 z-[70] bg-foreground/20 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                left: Math.min(Math.max(msgMenu.x - 110, 12), Math.max(window.innerWidth - 232, 12)),
                top: Math.min(Math.max(msgMenu.y - 60, 80), Math.max(window.innerHeight - 300, 80)),
              }}
              className="absolute w-56 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-2xl"
            >
              <div className="mb-1 flex items-center justify-between rounded-xl bg-muted/60 px-2 py-1.5">
                {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emo) => (
                  <motion.button
                    key={emo}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => {
                      setReaction(threadId, msgMenu.msg.id, emo);
                      setMsgMenu(null);
                    }}
                    className="text-lg"
                  >
                    {emo}
                  </motion.button>
                ))}
              </div>
              <MenuItem
                icon={<Reply className="h-4 w-4 text-primary" />}
                label="Reply"
                onClick={() => {
                  setReplyTo(msgMenu.msg);
                  setMsgMenu(null);
                  inputRef.current?.focus();
                }}
              />
              <MenuItem
                icon={<Forward className="h-4 w-4 text-primary" />}
                label="Forward"
                onClick={() => {
                  setMsgMenu(null);
                  notify("Message forwarded (demo)");
                }}
              />
              <MenuItem
                icon={<Copy className="h-4 w-4 text-primary" />}
                label="Copy text"
                onClick={() => {
                  navigator.clipboard?.writeText(msgMenu.msg.text);
                  setMsgMenu(null);
                  notify("Copied");
                }}
              />
              <MenuItem
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                label="Delete"
                danger
                onClick={() => {
                  deleteMessage(threadId, msgMenu.msg.id);
                  setMsgMenu(null);
                  notify("Message deleted");
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="z-10 flex shrink-0 flex-col gap-2 border-t border-border bg-surface py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] safe-x lg:pb-3"
      >
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 overflow-hidden rounded-xl border-l-2 border-primary bg-muted/60 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-primary">
                Replying to {replyTo.from === "me" ? "yourself" : thread.name}
              </p>
              <p className="truncate text-xs text-muted-foreground font-bangla">{replyTo.text}</p>
            </div>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              aria-label="Cancel reply"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-surface"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-end gap-2">
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
        </div>
      </form>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <CallOverlay
        open={call !== null}
        kind={call ?? "audio"}
        name={thread.name}
        initials={thread.initials}
        avatarColor={thread.avatarColor}
        onClose={() => setCall(null)}
      />
    </div>
  );
}

function MenuItem({
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
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-muted ${
        danger ? "text-red-600" : ""
      }`}
    >
      {icon}
      <span className="font-bangla">{label}</span>
    </button>
  );
}

