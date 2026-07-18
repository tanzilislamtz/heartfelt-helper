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

// Build the bar SVG path with a scooped notch under the active tab.
// viewBox is 400 x 88, tabs centered at x = 50, 150, 250, 350.
function buildPath(activeIndex: number) {
  const cx = 50 + activeIndex * 100;
  const scoopLeft = cx - 34;
  const scoopRight = cx + 34;

  const left =
    activeIndex === 0
      ? `M 0,88 L 0,26`
      : `M 0,88 L 0,50 Q 0,26 24,26`;

  const scoop =
    `L ${scoopLeft},26` +
    ` C ${cx - 18},26 ${cx - 18},50 ${cx},50` +
    ` C ${cx + 18},50 ${cx + 18},26 ${scoopRight},26`;

  const right =
    activeIndex === 3
      ? `L 400,26 L 400,88 Z`
      : `L 376,26 Q 400,26 400,50 L 400,88 Z`;

  return `${left} ${scoop} ${right}`;
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.to === pathname),
  );
  const d = buildPath(activeIndex);
  const unread = useUnreadMessages();


  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative h-[88px] w-full">
        {/* Curved bar background */}
        <svg
          className="absolute inset-0 h-full w-full drop-shadow-[0_-8px_24px_rgba(15,23,42,0.10)]"
          viewBox="0 0 400 88"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.path
            d={d}
            initial={false}
            animate={{ d }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            fill="var(--color-surface)"
          />
        </svg>

        {/* Tabs */}
        <ul className="relative grid h-full grid-cols-4 items-end pb-3">
          {items.map((item, i) => {
            const active = i === activeIndex;
            const Icon = item.Icon;
            const showBadge = item.to === "/message" && unread > 0;
            const badgeLabel = unread > 99 ? "99+" : String(unread);
            return (
              <li key={item.to} className="relative flex justify-center">
                <Link
                  to={item.to}
                  aria-label={showBadge ? `${item.label} (${unread} unread)` : item.label}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex w-full flex-col items-center gap-1 outline-none"
                >

                  {active ? (
                    <>
                      {/* Elevated floating circle */}
                      <motion.span
                        layoutId="bnav-elevated"
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        className="absolute -top-8 grid h-14 w-14 place-items-center rounded-full bg-surface shadow-[0_12px_24px_-8px_rgba(49,46,129,0.45)] ring-[3px] ring-background"
                      >
                        <span className="relative grid h-11 w-11 place-items-center rounded-full">
                          <Icon
                            className="h-[22px] w-[22px] text-primary"
                            strokeWidth={2.2}
                            fill="currentColor"
                            fillOpacity={0.12}
                          />
                          {showBadge && <Badge label={badgeLabel} elevated />}
                        </span>
                      </motion.span>
                      {/* Spacer so label stays at bottom of bar */}
                      <span className="h-8" aria-hidden />
                    </>
                  ) : (
                    <span className="relative grid h-8 w-8 place-items-center text-muted-foreground/70 transition-colors group-hover:text-foreground">
                      <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
                      {showBadge && <Badge label={badgeLabel} />}
                    </span>
                  )}

                  <span
                    className={`text-[11px] font-medium tracking-tight ${
                      active ? "text-primary" : "text-muted-foreground"
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

function Badge({ label, elevated = false }: { label: string; elevated?: boolean }) {
  const wide = label.length > 1;
  return (
    <AnimatePresence>
      <motion.span
        key={label}
        initial={{ scale: 0.4, opacity: 0, y: -2 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className={`pointer-events-none absolute ${
          elevated ? "-right-1 -top-1" : "-right-2 -top-1"
        } z-10 flex ${wide ? "h-[18px] min-w-[22px] px-1" : "h-[18px] w-[18px]"} items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold leading-none text-white ring-2 ring-surface shadow-[0_4px_10px_-2px_rgba(244,63,94,0.55)]`}
        aria-hidden
      >
        {label}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-rose-500/60" />
      </motion.span>
    </AnimatePresence>
  );
}

