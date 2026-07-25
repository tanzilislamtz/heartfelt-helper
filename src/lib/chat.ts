// Lightweight chat store — mock threads + localStorage-persisted messages.
// UI-only, no backend. Simulates a small circle of conversations.

export type ChatRole = "tutor" | "student" | "parent";

export type ChatThread = {
  id: string;
  name: string;
  role: ChatRole;
  subject?: string;
  avatarColor: string;
  initials: string;
  online?: boolean;
  lastSeen?: string;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  from: "me" | "them";
  text: string;
  at: number; // epoch ms
  status?: "sent" | "delivered" | "read";
  reaction?: string;
  replyTo?: { from: "me" | "them"; text: string };
};

export const threads: ChatThread[] = [
  {
    id: "rafiq",
    name: "Rafiqul Islam",
    role: "tutor",
    subject: "Higher Math",
    avatarColor: "linear-gradient(135deg,#292C75,#4f52c9)",
    initials: "RI",
    online: true,
  },
  {
    id: "nusrat",
    name: "Nusrat Jahan",
    role: "student",
    subject: "Class 10 · Physics",
    avatarColor: "linear-gradient(135deg,#006747,#22a06b)",
    initials: "NJ",
    online: true,
  },
  {
    id: "shahed",
    name: "Shahed Ahmed",
    role: "tutor",
    subject: "English Grammar",
    avatarColor: "linear-gradient(135deg,#F4C430,#e6a800)",
    initials: "SA",
    lastSeen: "2h ago",
  },
  {
    id: "parent-tania",
    name: "Tania Rahman (Parent)",
    role: "parent",
    subject: "Ayman's guardian",
    avatarColor: "linear-gradient(135deg,#7c3aed,#ec4899)",
    initials: "TR",
    lastSeen: "yesterday",
  },
  {
    id: "mahin",
    name: "Mahin Chowdhury",
    role: "student",
    subject: "SSC · Chemistry",
    avatarColor: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    initials: "MC",
    lastSeen: "5m ago",
  },
];

const seed: Record<string, ChatMessage[]> = {
  rafiq: [
    { id: "1", threadId: "rafiq", from: "them", text: "আজকে integration-এর chapter টা শেষ করতে পারবা?", at: Date.now() - 1000 * 60 * 40 },
    { id: "2", threadId: "rafiq", from: "me", text: "Yes sir, শুধু last exercise টা বাকি।", at: Date.now() - 1000 * 60 * 38, status: "read" },
    { id: "3", threadId: "rafiq", from: "them", text: "Great. Class-এ ওইটা একসাথে solve করব।", at: Date.now() - 1000 * 60 * 30 },
  ],
  nusrat: [
    { id: "1", threadId: "nusrat", from: "them", text: "Bhaiya, Newton's 3rd law একটু explain করবেন?", at: Date.now() - 1000 * 60 * 12 },
  ],
  shahed: [
    { id: "1", threadId: "shahed", from: "me", text: "Sir, tomorrow's class-এ passive voice কি cover হবে?", at: Date.now() - 1000 * 60 * 60 * 3, status: "delivered" },
  ],
  "parent-tania": [
    { id: "1", threadId: "parent-tania", from: "them", text: "Ayman-এর progress report টা কবে পাব?", at: Date.now() - 1000 * 60 * 60 * 26 },
  ],
  mahin: [
    { id: "1", threadId: "mahin", from: "them", text: "vaia notes ta share korben?", at: Date.now() - 1000 * 60 * 6 },
    { id: "2", threadId: "mahin", from: "me", text: "Sure, 5 min-এ pathacchi.", at: Date.now() - 1000 * 60 * 5, status: "read" },
  ],
};

const KEY = "la_chat_messages_v1";
type Listener = () => void;
const listeners = new Set<Listener>();

function load(): Record<string, ChatMessage[]> {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seed;
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

function save(store: Record<string, ChatMessage[]>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(store));
  listeners.forEach((l) => l());
}

export function getMessages(threadId: string): ChatMessage[] {
  const store = load();
  return store[threadId] ?? [];
}

export function getAllLatest(): Record<string, ChatMessage | undefined> {
  const store = load();
  const out: Record<string, ChatMessage | undefined> = {};
  for (const t of threads) {
    const list = store[t.id] ?? [];
    out[t.id] = list[list.length - 1];
  }
  return out;
}

/* ---------- read / unread tracking ---------- */

const READ_KEY = "la_chat_read_v1";

function loadRead(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(READ_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function markRead(threadId: string) {
  if (typeof window === "undefined") return;
  const read = loadRead();
  const list = getMessages(threadId);
  const last = list[list.length - 1];
  const at = last ? last.at : Date.now();
  if (read[threadId] === at) return;
  read[threadId] = at;
  window.localStorage.setItem(READ_KEY, JSON.stringify(read));
  listeners.forEach((l) => l());
}

/** Number of unread incoming messages per thread. */
export function getUnreadCounts(): Record<string, number> {
  const store = load();
  const read = loadRead();
  const out: Record<string, number> = {};
  for (const t of threads) {
    const list = store[t.id] ?? [];
    const since = read[t.id] ?? 0;
    out[t.id] = list.filter((m) => m.from === "them" && m.at > since).length;
  }
  return out;
}

export function getTotalUnread(): number {
  return Object.values(getUnreadCounts()).reduce((a, b) => a + b, 0);
}

/** Threads ordered by most recent activity (newest first). */
export function getSortedThreads(): ChatThread[] {
  const latest = getAllLatest();
  return [...threads].sort((a, b) => (latest[b.id]?.at ?? 0) - (latest[a.id]?.at ?? 0));
}


/* ---------- typing indicator ---------- */

const typing = new Set<string>();

export function isTyping(threadId: string) {
  return typing.has(threadId);
}

function setTyping(threadId: string, on: boolean) {
  if (on) typing.add(threadId);
  else typing.delete(threadId);
  listeners.forEach((l) => l());
}

/* ---------- reactions ---------- */

export function setReaction(threadId: string, messageId: string, emoji: string) {
  const s = load();
  const l = s[threadId] ?? [];
  s[threadId] = l.map((m) =>
    m.id === messageId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m,
  );
  save(s);
}

export function deleteMessage(threadId: string, messageId: string) {
  const s = load();
  const l = s[threadId] ?? [];
  s[threadId] = l.filter((m) => m.id !== messageId);
  save(s);
}

export function sendMessage(threadId: string, text: string, replyTo?: ChatMessage) {
  const store = load();
  const list = store[threadId] ?? [];
  const msg: ChatMessage = {
    id: Math.random().toString(36).slice(2),
    threadId,
    from: "me",
    text,
    at: Date.now(),
    status: "sent",
    replyTo: replyTo ? { from: replyTo.from, text: replyTo.text } : undefined,
  };
  store[threadId] = [...list, msg];
  save(store);

  // simulate delivered/read + auto reply
  setTimeout(() => {
    const s = load();
    const l = s[threadId] ?? [];
    s[threadId] = l.map((m) => (m.id === msg.id ? { ...m, status: "delivered" } : m));
    save(s);
  }, 600);

  const typingOn = setTimeout(() => setTyping(threadId, true), 900);
  void typingOn;

  setTimeout(() => {
    setTyping(threadId, false);
    const s = load();
    const l = s[threadId] ?? [];
    const replies = [
      "Got it 👍",
      "Thanks for letting me know!",
      "Ok, ami dekhchi.",
      "Sure, একটু পরে reply দিচ্ছি।",
      "Noted 🙌",
    ];
    const reply: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      threadId,
      from: "them",
      text: replies[Math.floor(Math.random() * replies.length)],
      at: Date.now(),
    };
    s[threadId] = [...l.map((m) => (m.id === msg.id ? { ...m, status: "read" as const } : m)), reply];
    save(s);
  }, 2600);
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getThread(id: string): ChatThread | undefined {
  return threads.find((t) => t.id === id);
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const diff = (now.getTime() - ts) / (1000 * 60 * 60 * 24);
  if (diff < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
