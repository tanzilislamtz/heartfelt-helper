import { Link, useRouterState } from "@tanstack/react-router";
import {
  HomeIcon,
  SparklesIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as HomeOutline,
  SparklesIcon as SparklesOutline,
  ChatBubbleOvalLeftEllipsisIcon as ChatOutline,
  UserCircleIcon as UserOutline,
} from "@heroicons/react/24/outline";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

type IconCmp = ComponentType<SVGProps<SVGSVGElement>>;

type Item = {
  to: "/" | "/quiz" | "/message" | "/profile";
  label: string;
  Solid: IconCmp;
  Outline: IconCmp;
};

const BRAND_GRADIENT =
  "linear-gradient(135deg,#292C75 0%,#006747 60%,#F4C430 100%)";

const items: Item[] = [
  { to: "/", label: "Home", Solid: HomeIcon, Outline: HomeOutline },
  { to: "/quiz", label: "Quiz", Solid: SparklesIcon, Outline: SparklesOutline },
  {
    to: "/message",
    label: "Chat",
    Solid: ChatBubbleOvalLeftEllipsisIcon,
    Outline: ChatOutline,
  },
  { to: "/profile", label: "You", Solid: UserCircleIcon, Outline: UserOutline },
];

const COUNT = items.length;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(0, items.findIndex((i) => i.to === pathname));
  const unread = useUnreadMessages();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
  const trans = mounted ? `all 500ms ${EASE}` : "none";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity 380ms ease, transform 480ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* White bar, full width */}
      <div
        className="relative w-full"
        style={{
          background: "#ffffff",
          borderTop: "1px solid rgba(15,23,42,0.06)",
          boxShadow:
            "0 -8px 24px -12px rgba(15,23,42,0.15), 0 -1px 0 rgba(15,23,42,0.04)",
          height: "68px",
        }}
      >
        {/* Sliding gradient underline indicator */}
        <span
          aria-hidden
          className="absolute top-0 rounded-b-full"
          style={{
            left: 0,
            width: `${100 / COUNT}%`,
            height: "3px",
            background: BRAND_GRADIENT,
            transform: `translateX(${activeIndex * 100}%)`,
            transition: trans,
            boxShadow: "0 4px 12px -2px rgba(41,44,117,0.5)",
          }}
        />

        <ul className="relative grid h-full" style={{ gridTemplateColumns: `repeat(${COUNT}, 1fr)` }}>
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            const Icon = isActive ? item.Solid : item.Outline;
            const showBadge = item.to === "/message" && unread > 0;
            const badgeLabel = unread > 99 ? "99+" : String(unread);

            return (
              <li key={item.to} className="list-none">
                <Link
                  to={item.to}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex h-full w-full flex-col items-center justify-center gap-0.5"
                >
                  {/* Icon wrapper with active pill */}
                  <span
                    className="relative grid place-items-center"
                    style={{
                      width: "44px",
                      height: "30px",
                      borderRadius: "999px",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(41,44,117,0.10), rgba(0,103,71,0.10) 60%, rgba(244,196,48,0.18))"
                        : "transparent",
                      transition: trans,
                      transform: isActive ? "scale(1)" : "scale(0.95)",
                    }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{
                        color: isActive ? "#292C75" : "#64748b",
                        transition: "color 250ms ease, transform 400ms ease",
                        transform: isActive ? "translateY(-1px)" : "none",
                        filter: isActive
                          ? "drop-shadow(0 2px 4px rgba(41,44,117,0.25))"
                          : "none",
                      }}
                    />
                    {showBadge && (
                      <span
                        className="absolute -right-1 -top-0.5 grid min-w-[16px] place-items-center rounded-full px-1 text-[10px] font-bold leading-none text-white"
                        style={{
                          background: "linear-gradient(135deg,#f43f5e,#ec4899)",
                          boxShadow:
                            "0 0 0 2px #fff, 0 2px 6px -1px rgba(244,63,94,0.7)",
                        }}
                      >
                        {badgeLabel}
                      </span>
                    )}
                  </span>

                  <span
                    className="text-[10.5px] font-semibold tracking-wide"
                    style={{
                      color: isActive ? "#292C75" : "#94a3b8",
                      transition: "color 250ms ease, transform 400ms ease",
                      transform: isActive ? "translateY(0)" : "translateY(1px)",
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Active dot underline */}
                  <span
                    aria-hidden
                    className="absolute rounded-full"
                    style={{
                      bottom: "6px",
                      width: "4px",
                      height: "4px",
                      background: BRAND_GRADIENT,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scale(1)" : "scale(0)",
                      transition: trans,
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
