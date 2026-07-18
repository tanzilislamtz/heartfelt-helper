import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Lightbulb, MessageSquare, User } from "lucide-react";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";
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

  // Mount flag: enable transitions only after first paint so the orb doesn't
  // slide in from index 0 on load and the nav gently fades in.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Debug overlay: toggle with `?navdebug=1` in the URL, or Alt+D.
  const [debug, setDebug] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("navdebug");
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "d" || e.key === "D")) setDebug((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Springy easing for state changes (bar/orb/icons)
  const EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
  const orbTransition = mounted
    ? `transform 550ms ${EASE}, background 400ms ease, box-shadow 400ms ease`
    : "none";
  const glowTransition = mounted
    ? "background 700ms ease, opacity 500ms ease"
    : "none";
  const iconTransition = mounted
    ? `transform 500ms ${EASE}, opacity 300ms ease, filter 300ms ease`
    : "none";


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
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 380ms ease, transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {/* Ambient aurora glow that follows the active tab */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[999px] blur-2xl"
        style={{
          bottom: "calc(0.4rem + env(safe-area-inset-bottom))",
          width: "calc(var(--bar) * 0.85)",
          height: "calc(var(--h) * 1.1)",
          background: active.gradient,
          opacity: 0.35,
          transition: glowTransition,
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
                    className="relative grid place-items-center text-white"
                    style={{
                      transform: isActive
                        ? "translateY(calc(var(--item) * -0.38)) scale(1.05)"
                        : "translateY(0) scale(1)",
                      filter: isActive
                        ? "drop-shadow(0 2px 4px rgba(0,0,0,0.35))"
                        : "none",
                      opacity: isActive ? 1 : 0.72,
                      transition: iconTransition,
                      willChange: "transform",
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
                    className="absolute left-1/2 -translate-x-1/2 font-semibold tracking-wide text-white"
                    style={{
                      bottom: "calc(var(--h) * 0.12)",
                      fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)",
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translate(-50%, 0)"
                        : "translate(-50%, 6px)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                      transition: mounted
                        ? "opacity 320ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1)"
                        : "none",
                    }}
                  >

                    {item.label}
                  </span>

                  {/* Pulse ring around indicator */}
                  <span
                    className="pointer-events-none absolute left-1/2 top-1/2 block rounded-full"
                    style={{
                      width: "calc(var(--item) * 0.72)",
                      height: "calc(var(--item) * 0.72)",
                      marginLeft: "calc(var(--item) * -0.36)",
                      marginTop: "calc(var(--item) * -0.36)",
                      border: "1.5px solid rgba(255,255,255,0.55)",
                      transform: isActive
                        ? `translateY(calc(var(--item) * -0.38)) scale(1)`
                        : `translateY(calc(var(--item) * -0.38)) scale(0)`,
                      opacity: isActive ? 1 : 0,
                      transition: mounted
                        ? `transform 500ms ${EASE} ${isActive ? "450ms" : "0ms"}, opacity 300ms ease`
                        : "none",
                      animation: isActive && mounted
                        ? "nav-pulse 2.4s ease-out infinite 0.9s"
                        : "none",
                    }}
                  />

                </Link>
              </li>
            );
          })}
        </ul>

        {/* Floating indicator orb — vertically centered on the bar's top edge, slightly lifted; horizontally aligned to each tab's center. */}
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            top: 0,
            left: "calc(var(--pad) + var(--item) * 0.5)",
            width: "calc(var(--item) * 0.72)",
            height: "calc(var(--item) * 0.72)",
            marginLeft: "calc(var(--item) * -0.36)",
            marginTop: "calc(var(--item) * -0.32)",
            background: active.gradient,
            boxShadow: `0 10px 22px -6px ${active.glow}, 0 0 0 2px #ffffff, inset 0 -6px 16px rgba(0,0,0,0.15)`,
            transform: `translateX(calc(var(--item) * ${activeIndex}))`,
            transition: orbTransition,
            willChange: "transform",
          }}
        />

        {/* ────────── Debug overlay ────────── */}
        {debug && (
          <>
            {/* Bar bounds outline */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ border: "1px dashed rgba(255,80,80,0.9)" }}
            />
            {/* Bar center horizontal + vertical crosshair */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 top-1/2"
              style={{ height: 1, background: "rgba(255,255,0,0.7)" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 top-0 left-1/2"
              style={{ width: 1, background: "rgba(255,255,0,0.5)" }}
            />
            {/* Per-tab center + lift range */}
            {items.map((it, i) => (
              <span
                key={`dbg-tab-${it.to}`}
                aria-hidden
                className="pointer-events-none absolute top-0"
                style={{
                  left: "calc(var(--pad) + var(--item) * 0.5)",
                  transform: `translateX(calc(var(--item) * ${i}))`,
                  height: "var(--h)",
                  width: 0,
                  borderLeft: "1px dashed rgba(0,255,180,0.9)",
                }}
              >
                {/* tab index label */}
                <span
                  style={{
                    position: "absolute",
                    top: -14,
                    left: -6,
                    fontSize: 9,
                    color: "#0ff",
                    fontWeight: 700,
                  }}
                >
                  {i}
                </span>
              </span>
            ))}
            {/* Orb lift range (from bar top down to bar top + orb height, centered) */}
            <span
              aria-hidden
              className="pointer-events-none absolute"
              style={{
                top: "calc(var(--item) * -0.32)",
                left: "calc(var(--pad) + var(--item) * 0.5)",
                width: "calc(var(--item) * 0.72)",
                height: "calc(var(--item) * 0.72)",
                marginLeft: "calc(var(--item) * -0.36)",
                transform: `translateX(calc(var(--item) * ${activeIndex}))`,
                border: "1px solid rgba(255,0,255,0.9)",
                borderRadius: "999px",
                transition: orbTransition,
              }}
            />
            {/* Orb center dot */}
            <span
              aria-hidden
              className="pointer-events-none absolute"
              style={{
                top: "calc(var(--item) * -0.32 + var(--item) * 0.36)",
                left: "calc(var(--pad) + var(--item) * 0.5)",
                width: 6,
                height: 6,
                marginLeft: -3,
                marginTop: -3,
                background: "#ff0",
                borderRadius: 999,
                boxShadow: "0 0 0 1px #000",
                transform: `translateX(calc(var(--item) * ${activeIndex}))`,
                transition: orbTransition,
              }}
            />
            {/* Legend */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-[10px] font-mono"
              style={{
                background: "rgba(0,0,0,0.75)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              active={activeIndex} · orb ⌀ 0.72·item · lift −0.32·item · Alt+D toggle
            </span>
          </>
        )}

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
