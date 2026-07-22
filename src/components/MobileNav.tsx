import { AnimatePresence, motion } from "framer-motion";
import { X, Home, Flame, MessageSquare, UserSearch, BookOpenCheck, UserCheck, GraduationCap, Brain } from "lucide-react";
import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

type NavItem = { icon: typeof Home; label: string; to: "/" | "/quiz" | "/available-tutor" };

const sections: { items: NavItem[] }[] = [
  {
    items: [
      { icon: Home, label: "Home", to: "/" },
      { icon: Brain, label: "Quiz", to: "/quiz" },
    ],
  },
  {
    items: [
      { icon: Flame, label: "Popular", to: "/" },
      { icon: MessageSquare, label: "Q&A", to: "/" },
      { icon: UserSearch, label: "Looking for Tutor", to: "/" },
      { icon: BookOpenCheck, label: "Looking for Student", to: "/" },
    ],
  },
  {
    items: [
      { icon: UserCheck, label: "Available Tutor", to: "/available-tutor" },
    ],
  },
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

            <nav className="mt-6 space-y-4">
              {sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className={`space-y-1 ${sIdx > 0 ? "border-t border-border pt-4" : ""}`}
                >
                  {section.items.map(({ icon: Icon, label, to }, i) => {
                    const active =
                      to === "/quiz"
                        ? pathname.startsWith("/quiz")
                        : to === "/available-tutor"
                          ? pathname.startsWith("/available-tutor")
                          : pathname === to && label === "Home";
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + (sIdx * 0.06) + i * 0.04 }}
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
                </div>
              ))}
            </nav>
          </motion.aside>

        </>
      )}
    </AnimatePresence>
  );
}
