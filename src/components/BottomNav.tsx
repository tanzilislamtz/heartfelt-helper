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
const ITEM = 70; // px per item
const COUNT = items.length;
const BAR_WIDTH = ITEM * COUNT;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(0, items.findIndex((i) => i.to === pathname));
  const unread = useUnreadMessages();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 lg:hidden"
      style={{ paddingBottom: "calc(0.9rem + env(safe-area-inset-bottom))" }}
    >
      {/* Background pad so the notch cut-out has something to bite into */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: BG }} />

      <div
        className="relative flex h-[70px] items-center justify-center rounded-[16px]"
        style={{
          width: BAR_WIDTH,
          background: "linear-gradient(45deg, #2196f3, #e91e63)",
        }}
      >
        <ul className="relative flex" style={{ width: BAR_WIDTH }}>
          {items.map((item, i) => {
            const active = i === activeIndex;
            const Icon = item.Icon;
            const showBadge = item.to === "/message" && unread > 0;
            const badgeLabel = unread > 99 ? "99+" : String(unread);

            return (
              <li
                key={item.to}
                className="relative z-10 list-none"
                style={{ width: ITEM, height: 70 }}
              >
                <Link
                  to={item.to}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className="relative flex h-full w-full flex-col items-center justify-center text-center font-medium"
                >
                  <span
                    className="relative block text-white transition-transform duration-500"
                    style={{
                      transform: active ? "translateY(-32px)" : "translateY(0)",
                      lineHeight: "75px",
                    }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                    {showBadge && (
                      <span className="absolute -right-2 -top-1 grid min-w-[16px] place-items-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-rose-600 shadow ring-2 ring-rose-500">
                        {badgeLabel}
                      </span>
                    )}
                  </span>

                  <span
                    className="absolute text-[0.7rem] font-normal tracking-wide text-white transition-all duration-500"
                    style={{
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
                      width: 50,
                      height: 50,
                      transform: active ? "translateY(-37px) scale(1)" : "translateY(-37px) scale(0)",
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
            width: 70,
            height: 70,
            background: "linear-gradient(45deg, #2196f3, #e91e63)",
            border: `6px solid ${BG}`,
            transform: `translateX(${activeIndex * ITEM}px)`,
          }}
        >
          {/* Left notch curve */}
          <span
            aria-hidden
            className="absolute"
            style={{
              top: "50%",
              left: -22,
              width: 20,
              height: 20,
              borderTopRightRadius: 20,
              boxShadow: `1px -10px 0 ${BG}`,
            }}
          />
          {/* Right notch curve */}
          <span
            aria-hidden
            className="absolute"
            style={{
              top: "50%",
              right: -22,
              width: 20,
              height: 20,
              borderTopLeftRadius: 20,
              boxShadow: `-1px -10px 0 ${BG}`,
            }}
          />
        </span>
      </div>
    </nav>
  );
}
