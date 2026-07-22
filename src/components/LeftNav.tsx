import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Brain,
  Flame,
  MessageSquare,
  UserSearch,
  BookOpenCheck,
  UserCheck,
} from "lucide-react";

const items = [
  { icon: Home, label: "Home", to: "/" as const, match: "home" as const },
  { icon: Brain, label: "Quiz", to: "/quiz" as const, match: "quiz" as const },
  { icon: Flame, label: "Popular", to: "/" as const, match: "none" as const },
  { icon: MessageSquare, label: "Q&A", to: "/" as const, match: "none" as const },
  { icon: UserSearch, label: "Looking for Tutor", to: "/" as const, match: "none" as const },
  { icon: BookOpenCheck, label: "Looking for Student", to: "/" as const, match: "none" as const },
  { icon: UserCheck, label: "Available Tutor", to: "/" as const, match: "none" as const },
];

export function LeftNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-24 space-y-1">
        {items.map(({ icon: Icon, label, to, match }) => {
          const active =
            match === "home" ? pathname === "/" : match === "quiz" ? pathname.startsWith("/quiz") : false;
          return (
            <Link
              key={label}
              to={to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/75 hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              {label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
