import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { signIn } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Learns Academy" },
      { name: "description", content: "Sign in to your Learns Academy account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn({ email });
      navigate({ to: "/" });
    }, 900);
  };

  return (
    <AuthShell
      side={
        <>
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Welcome back to <em className="text-accent not-italic">Learn</em>{" "}
            Academy.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">
            Pick up where you left off — your notes, communities, and streaks
            are waiting.
          </p>
        </>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold">
            <span className="font-display italic">Learns</span>
            <span className="ml-1 text-primary">Academy</span>
          </span>
        </div>

        <h1 className="mt-8 font-display text-3xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field
            id="email"
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@school.edu"
            required
          />
          <div>
            <Field
              id="password"
              label="Password"
              icon={Lock}
              type={showPw ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Your password"
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
                Remember me
              </label>
              <a href="#" className="font-medium text-primary hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                Signing in…
              </span>
            ) : (
              <>
                Sign in <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or continue with
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <SocialBtn label="Google" />
          <SocialBtn label="Apple" />
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" /> Demo screens — no data
          is stored.
        </p>
      </motion.div>
    </AuthShell>
  );
}

export function AuthShell({
  side,
  children,
}: {
  side: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Form side */}
        <div className="relative flex items-start justify-center px-5 pb-10 pt-8 sm:p-10 lg:items-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)",
              backgroundSize: "22px 22px",
              maskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 75%)",
            }}
          />
          <div className="relative w-full max-w-md">{children}</div>
        </div>

        {/* Decorative side */}
        <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:block">
          {/* animated gradient orbs */}
          <motion.div
            animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/40 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-tutor/50 blur-3xl"
          />
          {/* faint grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-primary-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary-foreground) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative flex h-full flex-col justify-between p-12">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1.5 text-xs font-medium text-primary-foreground/80 backdrop-blur-md hover:bg-primary-foreground/10"
            >
              ← Back to home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {side}

              {/* Floating preview stack */}
              <div className="relative mt-10 h-56">
                {/* card 3 (back) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: [0, -6, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.2 },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute right-2 top-0 w-56 rotate-6 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Streak
                  </div>
                  <div className="mt-2 font-display text-3xl font-semibold">
                    12 days
                  </div>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 flex-1 rounded ${
                          i < 5 ? "bg-accent" : "bg-primary-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* card 2 (middle) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: [0, -8, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.35 },
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    },
                  }}
                  className="absolute left-0 top-8 w-60 -rotate-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        Verified Helper
                      </div>
                      <div className="text-[11px] text-primary-foreground/70">
                        Badge unlocked
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary-foreground/15">
                    <div className="h-full w-[82%] rounded-full bg-tutor" />
                  </div>
                </motion.div>

                {/* card 1 (front) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: [0, -10, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.5 },
                    y: {
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6,
                    },
                  }}
                  className="absolute left-6 top-24 w-64 rotate-2 rounded-2xl border border-primary-foreground/20 bg-surface p-4 text-foreground shadow-2xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tutor text-tutor-foreground">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-sm font-semibold">
                          Dr. Ayesha
                        </span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-tutor" />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        A visual way to understand eigenvectors — 3 minute
                        intuition
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["A", "R", "S", "N"].map((c, i) => (
                    <motion.div
                      key={c}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="grid h-9 w-9 place-items-center rounded-full border-2 border-primary bg-accent/80 text-xs font-bold text-accent-foreground"
                    >
                      {c}
                    </motion.div>
                  ))}
                </div>
                <div className="text-xs text-primary-foreground/70">
                  <span className="font-semibold text-primary-foreground">
                    12k+
                  </span>{" "}
                  learners joined this month
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-between text-xs text-primary-foreground/60">
              <span>© Learns Academy</span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tutor" />
                All systems normal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({
  id,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  trailing,
}: {
  id: string;
  label: string;
  icon?: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-foreground/80">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`h-11 w-full rounded-xl border border-border bg-surface text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10 ${
            Icon ? "pl-10" : "pl-4"
          } ${trailing ? "pr-10" : "pr-4"}`}
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>
    </div>
  );
}

export function SocialBtn({ label }: { label: string }) {
  const isGoogle = label.toLowerCase() === "google";
  const isApple = label.toLowerCase() === "apple";
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      type="button"
      className="group relative inline-flex h-11 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-border/70 bg-gradient-to-b from-surface to-muted/40 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-foreground/20 hover:shadow-md"
    >
      {/* Shine sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="grid h-5 w-5 place-items-center">
        {isGoogle ? (
          <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        ) : isApple ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-foreground" aria-hidden>
            <path d="M16.365 1.43c0 1.14-.42 2.22-1.24 3.02-.9.9-2.02 1.4-3.14 1.32-.14-1.1.42-2.24 1.22-3.04.9-.9 2.14-1.36 3.16-1.3zM20.5 17.09c-.56 1.3-.82 1.88-1.54 3.02-1 1.6-2.42 3.6-4.18 3.62-1.56.02-1.96-1.02-4.08-1-2.12.02-2.56 1.02-4.12 1-1.76-.02-3.1-1.82-4.1-3.42C-.32 15.86-.62 9.5 2.14 6.14c1.96-2.38 5.06-3.78 7.98-3.78 2.98 0 4.86 1.62 7.32 1.62 2.4 0 3.86-1.62 7.32-1.62 2.62 0 5.4 1.42 7.36 3.88-6.46 3.54-5.4 12.78-1.62 10.85z"/>
          </svg>
        ) : (
          <span className="text-[10px] font-bold">{label.charAt(0)}</span>
        )}
      </span>
      <span className="relative">
        <span className="sm:hidden">{label}</span>
        <span className="hidden sm:inline">Continue with {label}</span>
      </span>
    </motion.button>
  );
}

