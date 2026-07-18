import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
  { to: "/message", label: "Chat", Icon: MessageSquare },
  { to: "/profile", label: "You", Icon: User },
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-5 lg:hidden"
      style={{ paddingBottom: "calc(0.6rem + env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto relative w-full max-w-[340px]">
        {/* Floating gradient orb that lifts above the bar */}
        <motion.div
          aria-hidden
          className="absolute -top-5 h-11 w-11"
          style={{ left: `calc(${activeIndex} * 25% + 12.5% - 22px)` }}
          initial={false}
          animate={{ left: `calc(${activeIndex} * 25% + 12.5% - 22px)` }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 shadow-[0_10px_24px_-4px_rgba(124,58,237,0.55)]" />
            <div className="absolute inset-0 rounded-full ring-4 ring-white/95" />
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </motion.div>

        {/* Slim capsule bar */}
        <div
          className="relative h-14 rounded-full border border-white/70 bg-white/70 shadow-[0_14px_36px_-14px_rgba(79,70,229,0.35),0_2px_10px_-2px_rgba(15,23,42,0.08)]"
          style={{ backdropFilter: "blur(20px) saturate(160%)" }}
        >
          <ul className="grid h-full grid-cols-4">
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
                    className="group relative flex w-full items-end justify-center pb-2 outline-none"
                  >
                    {/* Icon slot — hidden when active because the floating orb takes its place */}
                    <motion.span
                      className="relative grid place-items-center"
                      animate={{
                        opacity: active ? 0 : 1,
                        y: active ? -6 : 0,
                        scale: active ? 0.6 : 1,
                      }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    >
                      <Icon
                        className="h-[22px] w-[22px] text-slate-400 transition-colors group-hover:text-indigo-600"
                        strokeWidth={2}
                      />
                      {showBadge && !active && (
                        <span className="absolute -right-2 -top-2 grid min-w-[18px] place-items-center rounded-full bg-gradient-to-tr from-rose-500 to-fuchsia-500 px-1 text-[10px] font-bold leading-none text-white shadow ring-2 ring-white">
                          {badgeLabel}
                        </span>
                      )}
                    </motion.span>

                    {/* Active label sits below the orb */}
                    <motion.span
                      className="pointer-events-none absolute bottom-1.5 text-[10px] font-bold tracking-wide"
                      animate={{
                        opacity: active ? 1 : 0,
                        y: active ? 0 : 4,
                        color: active ? "#4f46e5" : "#94a3b8",
                      }}
                      transition={{ duration: 0.18 }}
                    >
                      {item.label}
                    </motion.span>

                    {/* Badge for active message tab (on the orb) */}
                    {showBadge && active && (
                      <span className="absolute -top-3 right-[calc(50%-22px)] z-10 grid min-w-[18px] place-items-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-rose-600 shadow ring-2 ring-rose-500">
                        {badgeLabel}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
