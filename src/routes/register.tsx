import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  GraduationCap,
  BookOpen,
  Users,
  Code2,
  Languages,
  Palette,
  Calculator,
  FlaskConical,
  Music,
  Camera,
  Sparkles,
} from "lucide-react";
import { AuthShell, Field, SocialBtn } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Learn Academy" },
      { name: "description", content: "Join Learn Academy in three quick steps." },
    ],
  }),
  component: RegisterPage,
});

type Role = "student" | "tutor" | "guest";

const TOPICS = [
  { id: "math", label: "Math", icon: Calculator },
  { id: "code", label: "Programming", icon: Code2 },
  { id: "lang", label: "Languages", icon: Languages },
  { id: "sci", label: "Science", icon: FlaskConical },
  { id: "design", label: "Design", icon: Palette },
  { id: "biz", label: "Business", icon: BookOpen },
  { id: "music", label: "Music", icon: Music },
  { id: "photo", label: "Photography", icon: Camera },
];

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  // Step 1: Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Step 2: Profile
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("student");

  // Step 3: Interests
  const [topics, setTopics] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const pwStrength = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const canNext =
    (step === 0 && email.includes("@") && password.length >= 6) ||
    (step === 1 && name.trim().length > 1) ||
    (step === 2 && topics.length >= 1);

  const next = () => {
    if (!canNext) return;
    if (step === 2) return submit();
    setDir(1);
    setStep((s) => s + 1);
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => navigate({ to: "/" }), 1400);
    }, 900);
  };

  const toggleTopic = (id: string) =>
    setTopics((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  return (
    <AuthShell
      side={
        <>
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Three quick steps.{" "}
            <em className="text-accent not-italic">A lifetime of learning.</em>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">
            Tell us who you are and what you love. We'll shape your feed and
            match you with the right people.
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

        <div className="mt-8 flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-semibold">Create account</h1>
          <span className="text-xs font-medium text-muted-foreground">
            Step {step + 1} of 3
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Already have one?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-1 items-center gap-2">
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={false}
                  animate={{ width: step >= i ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${
                    step > i ? "bg-tutor" : "bg-primary"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 text-[11px] font-medium text-muted-foreground">
          <span className={step >= 0 ? "text-foreground" : ""}>Account</span>
          <span className={`text-center ${step >= 1 ? "text-foreground" : ""}`}>
            Profile
          </span>
          <span className={`text-right ${step >= 2 ? "text-foreground" : ""}`}>
            Interests
          </span>
        </div>

        {/* Steps */}
        <div className="relative mt-6 min-h-[300px]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="grid place-items-center py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-tutor text-tutor-foreground"
                >
                  <Check className="h-8 w-8" strokeWidth={3} />
                </motion.div>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  You're in, {name || "learner"}.
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Taking you to your feed…
                </p>
              </motion.div>
            ) : step === 0 ? (
              <StepPane key="s0" dir={dir}>
                <div className="space-y-4">
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
                      placeholder="At least 6 characters"
                      required
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                    <div className="mt-2 flex items-center gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={false}
                          animate={{
                            backgroundColor:
                              i < pwStrength
                                ? pwStrength >= 3
                                  ? "var(--tutor)"
                                  : "var(--accent)"
                                : "var(--muted)",
                          }}
                          className="h-1.5 flex-1 rounded-full"
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {pwStrength >= 3
                        ? "Strong password"
                        : pwStrength >= 1
                          ? "Add a number or symbol to strengthen"
                          : "Use 8+ chars with a mix"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <SocialBtn label="Google" />
                    <SocialBtn label="Apple" />
                  </div>
                </div>
              </StepPane>
            ) : step === 1 ? (
              <StepPane key="s1" dir={dir}>
                <div className="space-y-5">
                  <Field
                    id="name"
                    label="Your name"
                    icon={UserIcon}
                    value={name}
                    onChange={setName}
                    placeholder="e.g. Ayesha Rahman"
                    required
                  />
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-foreground/80">
                      I'm joining as
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <RoleCard
                        label="Student"
                        desc="Learn & ask"
                        icon={BookOpen}
                        active={role === "student"}
                        onClick={() => setRole("student")}
                      />
                      <RoleCard
                        label="Tutor"
                        desc="Teach & mentor"
                        icon={GraduationCap}
                        active={role === "tutor"}
                        onClick={() => setRole("tutor")}
                      />
                      <RoleCard
                        label="Guest"
                        desc="Just exploring"
                        icon={Users}
                        active={role === "guest"}
                        onClick={() => setRole("guest")}
                      />
                    </div>
                  </div>
                </div>
              </StepPane>
            ) : (
              <StepPane key="s2" dir={dir}>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pick at least one topic —{" "}
                    <span className="font-medium text-foreground">
                      {topics.length} selected
                    </span>
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {TOPICS.map((t, i) => {
                      const on = topics.includes(t.id);
                      return (
                        <motion.button
                          key={t.id}
                          type="button"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => toggleTopic(t.id)}
                          className={`relative flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium transition ${
                            on
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-surface text-foreground/80 hover:border-foreground/30"
                          }`}
                        >
                          <t.icon className="h-4 w-4" />
                          {t.label}
                          <AnimatePresence>
                            {on && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"
                              >
                                <Check className="h-3 w-3" strokeWidth={3} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </StepPane>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        {!done && (
          <div className="mt-6 flex items-center gap-2">
            {step > 0 && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={back}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={next}
              disabled={!canNext || loading}
              className="ml-auto inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                  Creating…
                </>
              ) : step === 2 ? (
                <>
                  Finish <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        )}

        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" /> Demo screens — no data
          is stored.
        </p>
      </motion.div>
    </AuthShell>
  );
}

function StepPane({
  children,
  dir,
}: {
  children: React.ReactNode;
  dir: number;
}) {
  return (
    <motion.div
      custom={dir}
      initial={{ opacity: 0, x: 30 * dir, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -30 * dir, filter: "blur(4px)", position: "absolute" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function RoleCard({
  label,
  desc,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  desc: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative rounded-xl border p-3 text-left transition ${
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-surface hover:border-foreground/30"
      }`}
    >
      <Icon
        className={`h-5 w-5 ${active ? "text-primary" : "text-foreground/70"}`}
      />
      <div className="mt-2 text-sm font-semibold text-foreground">{label}</div>
      <div className="text-[11px] text-muted-foreground">{desc}</div>
      <AnimatePresence>
        {active && (
          <motion.span
            layoutId="role-check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
