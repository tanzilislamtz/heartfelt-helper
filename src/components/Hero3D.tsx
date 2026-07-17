import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, BookOpen, GraduationCap, Award } from "lucide-react";

export function Hero3D() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-border bg-primary p-6 text-primary-foreground sm:p-8"
    >
      {/* Ambient blobs */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-tutor/40 blur-3xl"
      />

      {/* Floating chips */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-6 top-6 hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-3 backdrop-blur-md sm:block"
      >
        <BookOpen className="h-5 w-5 text-accent" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="pointer-events-none absolute right-24 top-24 hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-3 backdrop-blur-md md:block"
      >
        <Award className="h-5 w-5 text-accent" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="pointer-events-none absolute bottom-8 right-10 hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-3 backdrop-blur-md sm:block"
      >
        <GraduationCap className="h-5 w-5 text-accent" />
      </motion.div>

      <div className="relative max-w-xl">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent ring-1 ring-inset ring-accent/30"
        >
          <Sparkles className="h-3 w-3" /> New this week
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl"
        >
          Learn out loud.{" "}
          <em className="text-accent not-italic">Grow together.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mt-2 max-w-md text-sm text-primary-foreground/75"
        >
          A quieter, kinder social space made for students and tutors. Share notes,
          ask questions, earn rewards.
        </motion.p>
        <div className="mt-5 flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30"
          >
            Join a community <ArrowUpRight className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/25 px-4 py-2 text-sm font-medium text-primary-foreground/90 hover:bg-primary-foreground/10"
          >
            Explore courses
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
