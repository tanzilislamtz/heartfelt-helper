import { Link, useRouterState } from "@tanstack/react-router";
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

// Background color behind the nav — used for the notch cut-out illusion.
const BG = "#06021b";
const COUNT = items.length;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(0, items.findIndex((i) => i.to === pathname));
  const unread = useUnreadMessages();

  // --item scales with viewport; clamp keeps it usable on tiny + large phones.
  // Bar width = --item * COUNT. Height tracks --item so the indicator stays circular.
  const style = {
    // 56px min → ~17vw → 72px max
    ["--item" as string]: "clamp(56px, 17vw, 72px)",
  } as React.CSSProperties;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 sm:px-4 lg:hidden"
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        ...style,
      }}
    >

      <div
        className="relative flex items-center justify-center rounded-[16px]"
        style={{
          width: `calc(var(--item) * ${COUNT})`,
          maxWidth: "100%",
          height: "var(--item)",
          background: "transparent",

        }}
      >
        <ul
          className="relative flex"
          style={{ width: `calc(var(--item) * ${COUNT})` }}
        >
          {items.map((item, i) => {
            const active = i === activeIndex;
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
                  aria-current={active ? "page" : undefined}
                  className="relative flex h-full w-full flex-col items-center justify-center text-center font-medium"
                >
                  <span
                    className="relative grid place-items-center text-white transition-transform duration-500"
                    style={{
                      transform: active
                        ? "translateY(calc(var(--item) * -0.46))"
                        : "translateY(0)",
                    }}
                  >
                    <Icon
                      className="h-[clamp(20px,5.5vw,24px)] w-[clamp(20px,5.5vw,24px)]"
                      strokeWidth={2}
                    />
                    {showBadge && (
                      <span className="absolute -right-2 -top-1 grid min-w-[16px] place-items-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-rose-600 shadow ring-2 ring-rose-500">
                        {badgeLabel}
                      </span>
                    )}
                  </span>

                  <span
                    className="absolute font-normal tracking-wide text-white transition-all duration-500"
                    style={{
                      fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)",
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(10px)" : "translateY(20px)",
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Ring around the indicator */}
                  <span
                    className="pointer-events-none absolute block rounded-full border-[1.8px] border-white transition-all duration-500"
                    style={{
                      width: "calc(var(--item) * 0.71)",
                      height: "calc(var(--item) * 0.71)",
                      transform: active
                        ? "translateY(calc(var(--item) * -0.53)) scale(1)"
                        : "translateY(calc(var(--item) * -0.53)) scale(0)",
                      transitionDelay: active ? "0.5s" : "0s",
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Floating indicator */}
        <span
          aria-hidden
          className="absolute flex items-center justify-center rounded-full transition-transform duration-500"
          style={{
            top: "-50%",
            left: 0,
            width: "var(--item)",
            height: "var(--item)",
            background: "linear-gradient(45deg, #2196f3, #e91e63)",
            boxShadow: "0 10px 24px -6px rgba(233, 30, 99, 0.45)",
            transform: `translateX(calc(var(--item) * ${activeIndex}))`,
          }}
        />

      </div>
    </nav>
  );
}
