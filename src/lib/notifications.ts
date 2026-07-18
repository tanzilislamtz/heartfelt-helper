// Tiny in-memory unread-messages store with subscription + localStorage persistence.
// Simulates dynamic updates (new messages arriving) until real backend wiring exists.

const KEY = "la_unread_messages";
type Listener = (n: number) => void;
const listeners = new Set<Listener>();

function read(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(KEY);
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : 3; // default seed
}

function write(n: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, String(n));
  listeners.forEach((l) => l(n));
}

export function getUnread(): number {
  return read();
}

export function setUnread(n: number) {
  write(Math.max(0, Math.floor(n)));
}

export function incrementUnread(by = 1) {
  write(Math.max(0, read() + by));
}

export function clearUnread() {
  write(0);
}

export function subscribeUnread(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) listeners.forEach((l) => l(read()));
  });
}
