import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, Lightbulb, MessageSquare, User } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

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

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Curved white bar */}
      <div className="relative mx-auto">
        <div className="pointer-events-none absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-black/5 to-transparent" />
        <div className="relative rounded-t-[28px] border-t border-border/60 bg-surface shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.18)]">
          <ul className="grid grid-cols-4 items-end px-2 pt-2 pb-3">
            {items.map(({ to, label, Icon }) => {
              const active = pathname === to;
              return (
                <li key={to} className="flex justify-center">
                  <Link
                    to={to}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    className="group relative flex w-full flex-col items-center gap-1 py-1 outline-none"
                  >
                    {active ? (
                      <motion.span
                        layoutId="bottom-nav-active"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="relative -mt-8 grid h-14 w-14 place-items-center rounded-full bg-surface shadow-[0_10px_25px_-8px_rgba(49,46,129,0.45)] ring-4 ring-background"
                      >
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">
                          <Icon className="h-5 w-5" strokeWidth={2.2} />
                        </span>
                      </motion.span>
                    ) : (
                      <span className="grid h-9 w-9 place-items-center text-muted-foreground transition-colors group-hover:text-foreground">
                        <Icon className="h-6 w-6" strokeWidth={1.7} />
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-medium tracking-tight ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
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
