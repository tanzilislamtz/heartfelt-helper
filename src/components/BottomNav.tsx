import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Lightbulb, MessageSquare, User } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

type Item = {
  to: "/" | "/quiz" | "/message" | "/profile";
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const items: Item[] = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/quiz", label: "Quiz", Icon: Lightbulb },
  { to: "/message", label: "Message", Icon: MessageSquare },
  { to: "/profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.to === pathname),
  );
  const unread = useUnreadMessages();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-3 lg:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div
        className="relative w-full max-w-[420px] rounded-[32px] border border-white/60 bg-white/75 p-2 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.28),0_4px_16px_-6px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
      >
        {/* Sliding active indicator */}
        <motion.div
          aria-hidden
          className="absolute top-2 bottom-2 rounded-[24px] bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 shadow-[0_10px_24px_-6px_rgba(124,58,237,0.55)]"
          style={{ width: `calc(25% - 4px)` }}
          initial={false}
          animate={{ left: `calc(${activeIndex} * 25% + 2px)` }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        >
          {/* subtle iridescent sheen */}
          <span className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/25 to-transparent" />
        </motion.div>

        {/* Tabs */}
        <ul className="relative grid grid-cols-4">
          {items.map((item, i) => {
            const active = i === activeIndex;
            const Icon = item.Icon;
            const showBadge = item.to === "/message" && unread > 0;
            const badgeLabel = unread > 99 ? "99+" : String(unread);
            return (
              <li key={item.to} className="flex">
                <Link
                  to={item.to}
                  aria-label={showBadge ? `${item.label} (${unread} unread)` : item.label}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-[24px] outline-none"
                >
                  <motion.span
                    className="relative grid place-items-center"
                    animate={{ scale: active ? 1.05 : 1, y: active ? -1 : 0 }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  >
                    <Icon
                      className={`h-[22px] w-[22px] transition-colors duration-200 ${
                        active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                      }`}
                      strokeWidth={active ? 2.4 : 2}
                    />
                    {showBadge && <Badge label={badgeLabel} />}
                  </motion.span>
                  <span
                    className={`text-[10.5px] font-semibold tracking-wide transition-colors duration-200 ${
                      active ? "text-white" : "text-slate-500 group-hover:text-indigo-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function Badge({ label }: { label: string }) {
  const wide = label.length > 1;
  return (
    <AnimatePresence>
      <motion.span
        key={label}
        initial={{ scale: 0.4, opacity: 0, y: -2 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className={`pointer-events-none absolute -right-2 -top-1.5 z-10 flex ${
          wide ? "h-[18px] min-w-[22px] px-1" : "h-[18px] w-[18px]"
        } items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold leading-none text-white ring-2 ring-white shadow-[0_4px_10px_-2px_rgba(244,63,94,0.55)]`}
        aria-hidden
      >
        {label}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-rose-500/60" />
      </motion.span>
    </AnimatePresence>
  );
}
