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

const BRAND_GRADIENT =
  "linear-gradient(135deg,#292C75 0%,#006747 60%,#F4C430 100%)";
const BRAND_GLOW = "rgba(41,44,117,0.55)";

const items: Item[] = [
  {
    to: "/",
    label: "Home",
    Icon: Home,
    gradient: BRAND_GRADIENT,
    glow: BRAND_GLOW,
  },
  {
    to: "/quiz",
    label: "Quiz",
    Icon: Lightbulb,
    gradient: BRAND_GRADIENT,
    glow: BRAND_GLOW,
  },
  {
    to: "/message",
    label: "Chat",
    Icon: MessageSquare,
    gradient: BRAND_GRADIENT,
    glow: BRAND_GLOW,
  },
  {
    to: "/profile",
    label: "You",
    Icon: User,
    gradient: BRAND_GRADIENT,
    glow: BRAND_GLOW,
  },
];

const COUNT = items.length;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(0, items.findIndex((i) => i.to === pathname));
  const active = items[activeIndex];
  const unread = useUnreadMessages();

  // Bar takes ~70% of viewport width (clamped for tiny + large screens).
  // --item is derived from the inner track so 4 tabs perfectly fill the bar,
  // and the floating orb / icons all scale from --item.
  const style = {
    ["--bar" as string]: "clamp(260px, 70vw, 420px)",
    ["--pad" as string]: "clamp(6px, 2.2vw, 12px)",
    // inner track = bar - 2*pad, divided across tabs
    ["--item" as string]:
      "calc((clamp(260px, 70vw, 420px) - (clamp(6px, 2.2vw, 12px) * 2)) / 4)",
    ["--h" as string]: "clamp(52px, 14vw, 64px)",
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
          width: "calc(var(--bar) * 0.85)",
          height: "calc(var(--h) * 1.1)",
          background: active.gradient,
          opacity: 0.35,
        }}
      />

      <div
        className="relative flex items-center justify-center rounded-full backdrop-blur-xl"
        style={{
          width: "var(--bar)",
          height: "var(--h)",
          padding: "0 var(--pad)",
          background:
            "linear-gradient(135deg, rgba(20,22,60,0.92) 0%, rgba(41,44,117,0.9) 55%, rgba(0,103,71,0.88) 100%)",
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
                style={{ width: "var(--item)", height: "var(--h)" }}

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
                        ? "translateY(calc(var(--item) * -0.28)) scale(1.05)"
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
                        ? "translateY(calc(var(--item) * -0.3)) scale(1)"
                        : "translateY(calc(var(--item) * -0.3)) scale(0)",
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
            top: "calc(var(--item) * -0.15)",
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
