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
  accent: string; // per-tab accent gradient
  glow: string;
};

const BRAND_GRADIENT =
  "linear-gradient(135deg,#292C75 0%,#006747 60%,#F4C430 100%)";

const items: Item[] = [
  {
    to: "/",
    label: "Home",
    Icon: House,
    accent: "linear-gradient(135deg,#292C75 0%,#4f46e5 100%)",
    glow: "rgba(79,70,229,0.55)",
  },
  {
    to: "/quiz",
    label: "Quiz",
    Icon: Sparkles,
    accent: "linear-gradient(135deg,#F4C430 0%,#f59e0b 100%)",
    glow: "rgba(244,196,48,0.6)",
  },
  {
    to: "/message",
    label: "Chat",
    Icon: MessagesSquare,
    accent: "linear-gradient(135deg,#006747 0%,#10b981 100%)",
    glow: "rgba(16,185,129,0.55)",
  },
  {
    to: "/profile",
    label: "You",
    Icon: CircleUserRound,
    accent: "linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)",
    glow: "rgba(139,92,246,0.55)",
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
  const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
  const trans = mounted ? `all 520ms ${SPRING}` : "none";

  // Position math for the sliding blob (percentage of bar width)
  const slotPct = 100 / COUNT;
  const centerPct = slotPct * (activeIndex + 0.5);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 380ms ease, transform 520ms ${EASE_OUT}`,
      }}
    >
      {/* Ambient aurora that follows the active tab, sits ABOVE the bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 40px)",
          height: "80px",
          overflow: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${centerPct}%`,
            bottom: 0,
            width: "160px",
            height: "80px",
            transform: "translateX(-50%)",
            background: `radial-gradient(60% 100% at 50% 100%, ${active.glow} 0%, transparent 70%)`,
            filter: "blur(6px)",
            opacity: 0.9,
            transition: trans,
          }}
        />
      </div>

      {/* Bar wrapper */}
      <div
        className="relative w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,1) 100%)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(15,23,42,0.06)",
          boxShadow:
            "0 -12px 32px -16px rgba(15,23,42,0.18), 0 -1px 0 rgba(15,23,42,0.04)",
          height: "72px",
        }}
      >
        {/* Morphing gradient blob behind active icon */}
        <span
          aria-hidden
          className="absolute"
          style={{
            top: "10px",
            left: `${centerPct}%`,
            width: "52px",
            height: "52px",
            marginLeft: "-26px",
            borderRadius: "22px 26px 22px 26px / 26px 22px 26px 22px",
            background: active.accent,
            boxShadow: `0 10px 24px -6px ${active.glow}, inset 0 1px 0 rgba(255,255,255,0.35)`,
            transition: trans,
            transform: `rotate(${activeIndex * 8 - 4}deg)`,
          }}
        />

        {/* Top hairline gradient underline */}
        <span
          aria-hidden
          className="absolute top-0"
          style={{
            left: `${activeIndex * slotPct}%`,
            width: `${slotPct}%`,
            height: "2px",
            background: BRAND_GRADIENT,
            transition: trans,
            opacity: 0.9,
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
                  className="relative flex h-full w-full flex-col items-center justify-center"
                >
                  {/* Icon — active one sits on top of the morphing blob */}
                  <span
                    className="relative grid place-items-center"
                    style={{
                      width: "52px",
                      height: "52px",
                      transition: trans,
                      transform: isActive
                        ? "translateY(-2px) scale(1)"
                        : "translateY(6px) scale(0.92)",
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      className="h-[22px] w-[22px]"
                      strokeWidth={isActive ? 2.4 : 2}
                      style={{
                        color: isActive ? "#ffffff" : "#94a3b8",
                        transition: `color 260ms ease, transform 500ms ${SPRING}`,
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                        filter: isActive
                          ? "drop-shadow(0 2px 3px rgba(0,0,0,0.25))"
                          : "none",
                      }}
                    />

                    {/* Sparkle accents on active — tiny orbiting dots */}
                    {isActive && (
                      <>
                        <span
                          aria-hidden
                          className="absolute rounded-full"
                          style={{
                            top: "2px",
                            right: "4px",
                            width: "4px",
                            height: "4px",
                            background: "#fff",
                            opacity: 0.9,
                            animation: "navSparkle 1.6s ease-in-out infinite",
                          }}
                        />
                        <span
                          aria-hidden
                          className="absolute rounded-full"
                          style={{
                            bottom: "6px",
                            left: "6px",
                            width: "3px",
                            height: "3px",
                            background: "#fff",
                            opacity: 0.7,
                            animation:
                              "navSparkle 1.8s ease-in-out infinite 0.4s",
                          }}
                        />
                      </>
                    )}

                    {showBadge && (
                      <span
                        className="absolute grid min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold leading-none text-white"
                        style={{
                          top: "-2px",
                          right: "-2px",
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

                  {/* Label */}
                  <span
                    className="mt-0.5 text-[10.5px] font-semibold tracking-wide"
                    style={{
                      color: isActive ? "#0f172a" : "#94a3b8",
                      transition: `color 260ms ease, transform 500ms ${SPRING}, opacity 260ms ease`,
                      transform: isActive
                        ? "translateY(0) scale(1)"
                        : "translateY(-2px) scale(0.95)",
                      opacity: isActive ? 1 : 0.85,
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        @keyframes navSparkle {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50%      { transform: scale(0.4); opacity: 0.3; }
        }
      `}</style>
    </nav>
  );
}
