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
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Learn Academy" },
      { name: "description", content: "Sign in to your Learn Academy account." },
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
            <span className="font-display italic">Learn</span>
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
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:block">
          <motion.div
            animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/30 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-tutor/40 blur-3xl"
          />
          <div className="relative flex h-full flex-col justify-between p-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground">
              ← Back to home
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {side}
              <div className="mt-8 flex -space-x-2">
                {["A", "R", "S", "N"].map((c, i) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-primary bg-accent/80 text-xs font-bold text-accent-foreground"
                  >
                    {c}
                  </motion.div>
                ))}
                <div className="ml-4 self-center text-xs text-primary-foreground/70">
                  12k+ learners joined this month
                </div>
              </div>
            </motion.div>
            <div className="text-xs text-primary-foreground/60">
              © Learn Academy
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
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      type="button"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-medium text-foreground/80 transition hover:bg-muted"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-muted text-[10px] font-bold">
        {label.charAt(0)}
      </span>
      {label}
    </motion.button>
  );
}
