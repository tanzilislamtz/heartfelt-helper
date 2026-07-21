import { Link, useRouterState } from "@tanstack/react-router";
import {
  House,
  Sparkles,
  MessagesSquare,
  CircleUserRound,
} from "lucide-react";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

type Item = {
  to: "/" | "/quiz" | "/message" | "/profile";
  label: string;
  Icon: IconCmp;
  accent: string;
  glow: string;
};

const items: Item[] = [
  {
    to: "/",
    label: "Home",
    Icon: House,
    accent: "linear-gradient(135deg,#3730a3 0%,#6366f1 100%)",
    glow: "rgba(99,102,241,0.55)",
  },
  {
    to: "/quiz",
    label: "Quiz",
    Icon: Sparkles,
    accent: "linear-gradient(135deg,#f59e0b 0%,#f4c430 100%)",
    glow: "rgba(244,196,48,0.55)",
  },
  {
    to: "/message",
    label: "Chat",
    Icon: MessagesSquare,
    accent: "linear-gradient(135deg,#047857 0%,#10b981 100%)",
    glow: "rgba(16,185,129,0.5)",
  },
  {
    to: "/profile",
    label: "You",
    Icon: CircleUserRound,
    accent: "linear-gradient(135deg,#db2777 0%,#a855f7 100%)",
    glow: "rgba(168,85,247,0.5)",
  },
];

const COUNT = items.length;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(0, items.findIndex((i) => i.to === pathname));
  const active = items[activeIndex] ?? items[0];
  const unread = useUnreadMessages();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  const trans = mounted ? `all 520ms ${SPRING}` : "none";

  const slotPct = 100 / COUNT;
  const centerPct = slotPct * (activeIndex + 0.5);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
        paddingLeft: "14px",
        paddingRight: "14px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 420ms ease, transform 560ms ${EASE}`,
      }}
    >
      {/* Ambient aurora glow above bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 60px)",
          height: "70px",
          overflow: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `calc(14px + (100% - 28px) * ${centerPct / 100})`,
            bottom: 0,
            width: "140px",
            height: "70px",
            transform: "translateX(-50%)",
            background: `radial-gradient(60% 100% at 50% 100%, ${active.glow} 0%, transparent 72%)`,
            filter: "blur(8px)",
            opacity: 0.85,
            transition: trans,
          }}
        />
      </div>

      {/* Floating pill bar */}
      <div
        className="relative mx-auto w-full max-w-md"
        style={{
          height: "64px",
          borderRadius: "22px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(250,250,253,1) 100%)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow:
            "0 20px 40px -18px rgba(15,23,42,0.28), 0 2px 6px -2px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
          overflow: "visible",
        }}
      >
        {/* Floating orb — lifted above the bar */}
        <span
          aria-hidden
          className="absolute"
          style={{
            top: "-6px",
            left: `${centerPct}%`,
            width: "54px",
            height: "54px",
            marginLeft: "-27px",
            borderRadius: "50%",
            background: active.accent,
            boxShadow: `0 12px 24px -6px ${active.glow}, 0 0 0 4px #fff, inset 0 1px 0 rgba(255,255,255,0.4)`,
            transition: trans,
          }}
        />

        {/* Pulsing halo */}
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            top: "-6px",
            left: `${centerPct}%`,
            width: "54px",
            height: "54px",
            marginLeft: "-27px",
            border: `2px solid ${active.glow}`,
            opacity: 0.6,
            transition: trans,
            animation: "navHalo 2s ease-out infinite",
            pointerEvents: "none",
          }}
        />

        <ul
          className="relative grid h-full"
          style={{ gridTemplateColumns: `repeat(${COUNT}, 1fr)` }}
        >
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            const Icon = item.Icon;
            const showBadge = item.to === "/message" && unread > 0;
            const badgeLabel = unread > 99 ? "99+" : String(unread);

            return (
              <li key={item.to} className="list-none">
                <Link
                  to={item.to}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex h-full w-full flex-col items-center justify-center gap-1"
                >
                  <span
                    className="relative grid place-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      transition: trans,
                      transform: isActive
                        ? "translateY(-10px) scale(1)"
                        : "translateY(2px) scale(0.95)",
                      zIndex: 2,
                    }}
                  >
                    <Icon
                      className="h-[22px] w-[22px]"
                      strokeWidth={isActive ? 2.4 : 2}
                      style={{
                        color: isActive ? "#ffffff" : "#94a3b8",
                        transition: `color 260ms ease`,
                        filter: isActive
                          ? "drop-shadow(0 2px 3px rgba(0,0,0,0.25))"
                          : "none",
                      }}
                    />

                    {showBadge && (
                      <span
                        className="absolute grid min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold leading-none text-white"
                        style={{
                          top: "-4px",
                          right: "-6px",
                          height: "18px",
                          background:
                            "linear-gradient(135deg,#f43f5e,#ec4899)",
                          boxShadow:
                            "0 0 0 2px #fff, 0 4px 10px -2px rgba(244,63,94,0.7)",
                        }}
                      >
                        {badgeLabel}
                      </span>
                    )}
                  </span>

                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        @keyframes navHalo {
          0%   { transform: scale(1); opacity: 0.6; }
          70%  { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>
    </nav>
  );
}
