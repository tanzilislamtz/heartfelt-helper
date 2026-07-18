import { AnimatePresence, motion } from "framer-motion";
import { X, Home, FileText, Flame, MessageSquare, UserSearch, BookOpenCheck, UserCheck, GraduationCap } from "lucide-react";
import { useEffect } from "react";

const items = [
  { icon: Home, label: "Home", active: true },
  { icon: FileText, label: "Quiz" },
  { icon: Flame, label: "Popular" },
  { icon: MessageSquare, label: "Q&A" },
  { icon: UserSearch, label: "Looking for Tutor" },
  { icon: BookOpenCheck, label: "Looking for Student" },
  { icon: UserCheck, label: "Available Tutor" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
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
              {items.map(({ icon: Icon, label, active }, i) => (
                <motion.a
                  key={label}
                  href="#"
                  onClick={onClose}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </motion.a>
              ))}
            </nav>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
