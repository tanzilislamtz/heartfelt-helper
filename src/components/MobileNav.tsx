import { AnimatePresence, motion } from "framer-motion";
import { X, Home, Flame, MessageSquare, UserSearch, BookOpenCheck, UserCheck, Sparkles, GraduationCap, Brain } from "lucide-react";
import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const items = [
  { icon: Home, label: "Home", to: "/" as const },
  { icon: Brain, label: "Quiz", to: "/quiz" as const },
  { icon: Flame, label: "Popular", to: "/" as const },
  { icon: MessageSquare, label: "Q&A", to: "/" as const },
  { icon: UserSearch, label: "Looking for Tutor", to: "/" as const },
  { icon: BookOpenCheck, label: "Looking for Student", to: "/" as const },
  { icon: UserCheck, label: "Available Tutor", to: "/" as const },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-sm border-r border-border bg-surface p-5 shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="text-lg font-semibold">
                  <span className="font-display italic">Learns</span>
                  <span className="ml-1 text-primary">Academy</span>
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 space-y-1">
              {items.map(({ icon: Icon, label, to }, i) => {
                const active = to === "/quiz" ? pathname.startsWith("/quiz") : pathname === to && label === "Home";
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      to={to}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground/80 hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Your progress
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold">72</span>
                <span className="text-xs text-muted-foreground">/ 100 XP</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full rounded-full bg-tutor"
                />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
