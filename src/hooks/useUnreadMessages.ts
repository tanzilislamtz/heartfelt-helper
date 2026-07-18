import { useEffect, useState } from "react";
import { getUnread, subscribeUnread, incrementUnread } from "@/lib/notifications";

/**
 * Returns the live unread-message count and keeps it in sync with the store.
 * Also simulates incoming messages every ~25s so the badge feels alive
 * until real realtime wiring is added.
 */
export function useUnreadMessages() {
  const [count, setCount] = useState<number>(() => (typeof window === "undefined" ? 0 : getUnread()));

  useEffect(() => {
    setCount(getUnread());
    const unsub = subscribeUnread(setCount);

    // Simulate new incoming messages periodically
    const t = window.setInterval(() => {
      // 60% chance to bump by 1, 15% chance to bump by 2
      const r = Math.random();
      if (r < 0.6) incrementUnread(1);
      else if (r < 0.75) incrementUnread(2);
    }, 25000);

    return () => {
      unsub();
      window.clearInterval(t);
    };
  }, []);

  return count;
}
