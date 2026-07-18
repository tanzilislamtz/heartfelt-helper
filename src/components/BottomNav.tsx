import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Lightbulb, MessageSquare, User } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

type Item = {
  to: "/" | "/quiz" | "/message" | "/profile";
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  gradient: string;
  glow: string;
};

const items: Item[] = [
  {
    to: "/",
    label: "Home",
    Icon: Home,
    gradient: "linear-gradient(135deg,#60a5fa 0%,#a855f7 50%,#ec4899 100%)",
    glow: "rgba(168,85,247,0.55)",
  },
  {
    to: "/quiz",
    label: "Quiz",
    Icon: Lightbulb,
    gradient: "linear-gradient(135deg,#fbbf24 0%,#f97316 55%,#ef4444 100%)",
    glow: "rgba(249,115,22,0.55)",
  },
  {
    to: "/message",
    label: "Chat",
    Icon: MessageSquare,
    gradient: "linear-gradient(135deg,#22d3ee 0%,#3b82f6 55%,#8b5cf6 100%)",
    glow: "rgba(59,130,246,0.55)",
  },
  {
    to: "/profile",
    label: "You",
    Icon: User,
    gradient: "linear-gradient(135deg,#34d399 0%,#14b8a6 55%,#6366f1 100%)",
    glow: "rgba(20,184,166,0.55)",
  },
];

const COUNT = items.length;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(0, items.findIndex((i) => i.to === pathname));
  const active = items[activeIndex];
  const unread = useUnreadMessages();

  const style = {
    ["--item" as string]: "clamp(48px, 13.5vw, 60px)",
  } as React.CSSProperties;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 sm:px-4 lg:hidden"
      style={{
        paddingBottom: "calc(0.9rem + env(safe-area-inset-bottom))",
        ...style,
      }}
    >
      {/* Ambient aurora glow that follows the active tab */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[999px] blur-2xl transition-all duration-700"
        style={{
          bottom: "calc(0.4rem + env(safe-area-inset-bottom))",
          width: "calc(var(--item) * 3.4)",
          height: "calc(var(--item) * 1.1)",
          background: active.gradient,
          opacity: 0.35,
        }}
      />

      <div
        className="relative flex items-center justify-center rounded-full px-[calc(var(--item)*0.35)] backdrop-blur-xl"
        style={{
          height: "var(--item)",
          background:
            "linear-gradient(135deg, rgba(15,10,45,0.85) 0%, rgba(30,15,60,0.85) 50%, rgba(60,15,55,0.85) 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 20px 40px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Sheen highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-60"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%)",
          }}
        />

        <ul
          className="relative flex"
          style={{ width: `calc(var(--item) * ${COUNT})` }}
        >
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            const Icon = item.Icon;
            const showBadge = item.to === "/message" && unread > 0;
            const badgeLabel = unread > 99 ? "99+" : String(unread);

            return (
              <li
                key={item.to}
                className="relative z-10 list-none"
                style={{ width: "var(--item)", height: "var(--item)" }}
              >
                <Link
                  to={item.to}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex h-full w-full flex-col items-center justify-center text-center font-medium"
                >
                  <span
                    className="relative grid place-items-center text-white transition-all duration-500"
                    style={{
                      transform: isActive
                        ? "translateY(calc(var(--item) * -0.48)) scale(1.05)"
                        : "translateY(0) scale(1)",
                      filter: isActive
                        ? "drop-shadow(0 2px 4px rgba(0,0,0,0.35))"
                        : "none",
                      opacity: isActive ? 1 : 0.72,
                    }}
                  >
                    <Icon
                      className="h-[clamp(20px,5.5vw,24px)] w-[clamp(20px,5.5vw,24px)]"
                      strokeWidth={2.1}
                    />
                    {showBadge && (
                      <span
                        className="absolute -right-2 -top-1 grid min-w-[16px] place-items-center rounded-full px-1 text-[10px] font-bold leading-none text-white shadow"
                        style={{
                          background:
                            "linear-gradient(135deg,#f43f5e,#ec4899)",
                          boxShadow:
                            "0 0 0 2px rgba(15,10,45,0.9), 0 4px 10px -2px rgba(244,63,94,0.7)",
                        }}
                      >
                        {badgeLabel}
                      </span>
                    )}
                  </span>

                  <span
                    className="absolute font-semibold tracking-wide text-white transition-all duration-500"
                    style={{
                      fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)",
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(14px)"
                        : "translateY(22px)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Pulse ring around indicator */}
                  <span
                    className="pointer-events-none absolute block rounded-full transition-all duration-500"
                    style={{
                      width: "calc(var(--item) * 0.6)",
                      height: "calc(var(--item) * 0.6)",
                      border: "1.5px solid rgba(255,255,255,0.55)",
                      transform: isActive
                        ? "translateY(calc(var(--item) * -0.5)) scale(1)"
                        : "translateY(calc(var(--item) * -0.5)) scale(0)",
                      transitionDelay: isActive ? "0.45s" : "0s",
                      opacity: isActive ? 1 : 0,
                      animation: isActive
                        ? "nav-pulse 2.4s ease-out infinite 0.6s"
                        : "none",
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Floating indicator orb */}
        <span
          aria-hidden
          className="absolute rounded-full transition-all duration-500"
          style={{
            top: "calc(var(--item) * -0.36)",
            left: "calc(var(--item) * 0.85)",
            width: "calc(var(--item) * 0.72)",
            height: "calc(var(--item) * 0.72)",
            marginLeft: "calc(var(--item) * -0.36)",
            background: active.gradient,
            boxShadow: `0 10px 22px -6px ${active.glow}, 0 0 0 3px rgba(15,10,45,0.9), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -6px 16px rgba(0,0,0,0.15)`,
            transform: `translateX(calc(var(--item) * ${activeIndex}))`,
          }}
        >
          {/* inner gloss */}
          <span
            className="pointer-events-none absolute inset-[3px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 55%)",
            }}
          />
        </span>
      </div>

      <style>{`
        @keyframes nav-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }
          70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}</style>
    </nav>
  );
}
