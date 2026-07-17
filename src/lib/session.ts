// Lightweight client-only session gate. Demo — no backend.
const KEY = "la_session_v1";
const WELCOMED = "la_welcomed_v1";

export type Session = { email: string; name?: string; at: number };

const isBrowser = () => typeof window !== "undefined";

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function isAuthed(): boolean {
  return !!getSession();
}

export function signIn(s: Omit<Session, "at">) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify({ ...s, at: Date.now() }));
  window.dispatchEvent(new Event("la:auth"));
}

export function signOut() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("la:auth"));
}

export function hasWelcomed(): boolean {
  if (!isBrowser()) return true;
  return localStorage.getItem(WELCOMED) === "1";
}

export function markWelcomed() {
  if (!isBrowser()) return;
  localStorage.setItem(WELCOMED, "1");
}
