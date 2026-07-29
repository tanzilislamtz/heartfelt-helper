import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, UserCheck, MessagesSquare, Timer } from "lucide-react";

const items = [
  { icon: Home, label: "Home", to: "/" as const, match: "home" as const },
  { icon: BookOpen, label: "Practice", to: "/quiz" as const, match: "practice" as const },
  { icon: Timer, label: "Mock Test", to: "/quiz/mock-test" as const, match: "mock" as const },
  { icon: MessagesSquare, label: "Messages", to: "/message" as const, match: "message" as const },
  { icon: UserCheck, label: "Available Tutor", to: "/available-tutor" as const, match: "available" as const },
];


export function LeftNav({ stickyClass = "sticky top-24" }: { stickyClass?: string } = {}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isMock = pathname.startsWith("/quiz/mock-test");
  return (
    <aside className="hidden lg:block">
      <nav className={`${stickyClass} space-y-1`}>
        {items.map(({ icon: Icon, label, to, match }) => {
          const active =
            match === "home"
              ? pathname === "/"
              : match === "practice"
                ? pathname.startsWith("/quiz") && !isMock
                : match === "mock"
                  ? isMock
                  : match === "message"
                    ? pathname.startsWith("/message")
                    : match === "available"
                      ? pathname.startsWith("/available-tutor")
                      : false;
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
