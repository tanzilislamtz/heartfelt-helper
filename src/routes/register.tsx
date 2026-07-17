import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Camera as CameraIcon,
  Upload,
  X,
  Heart,
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
import { AvatarCropper } from "@/components/AvatarCropper";
import { signIn } from "@/lib/session";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Learn Academy" },
      { name: "description", content: "Join Learn Academy in three quick steps." },
    ],
  }),
  component: RegisterPage,
});

type Role = "student" | "tutor" | "parent";

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
  const [avatar, setAvatar] = useState<string | null>(null);
  const [rawAvatar, setRawAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setRawAvatar(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Step 2: OTP verification (demo — any 4 digits accepted)
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendIn, setResendIn] = useState(0);
  const otpValue = otp.join("");
  const otpValid = /^\d{4}$/.test(otpValue);

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
    (step === 1 && name.trim().length > 1 && !!avatar) ||
    (step === 2 && otpValid) ||
    (step === 3 && topics.length >= 1);

  const next = () => {
    if (!canNext) return;
    if (step === 3) return submit();
    // Entering OTP step: start resend cooldown
    if (step === 1) setResendIn(30);
    setDir(1);
    setStep((s) => s + 1);
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  // Countdown for OTP resend
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const setOtpAt = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const n = [...prev];
      n[i] = digit;
      return n;
    });
    if (digit && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const onOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", ""];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setOtp(next);
    otpRefs.current[Math.min(text.length, 3)]?.focus();
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      signIn({ email, name });
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

        <div className="mt-8 flex items-baseline justify-between gap-3">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Create account</h1>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            Step {step + 1} of 4
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Already have one?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>

        {/* Stepper */}
        <div className="mt-8">
          <div className="relative flex items-center justify-between">
            {/* base track */}
            <div className="absolute left-5 right-5 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-muted" />
            {/* progress track */}
            <motion.div
              initial={false}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-5 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-tutor"
              style={{ maxWidth: "calc(100% - 2.5rem)" }}
            />
            {["Account", "Profile", "Verify", "Interests"].map((label, i) => {
              const active = step === i;
              const done = step > i;
              return (
                <div key={label} className="relative flex flex-col items-center gap-2">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: active ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      done
                        ? "border-tutor bg-tutor text-tutor-foreground"
                        : active
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "border-border bg-surface text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                    {active && (
                      <motion.span
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-primary"
                      />
                    )}
                  </motion.div>
                  <span
                    className={`text-[11px] font-semibold ${
                      active || done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <div className="relative mt-5">
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
                  {/* Avatar upload — polished, drag-and-drop */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.dataset.drag = "on";
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.dataset.drag = "off";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.dataset.drag = "off";
                      onPickAvatar(e.dataTransfer.files?.[0]);
                    }}
                    className="group/upload relative flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-gradient-to-br from-surface to-muted/40 p-5 transition data-[drag=on]:border-primary data-[drag=on]:bg-primary/5"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground">
                        Profile picture
                      </p>
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
                        Required
                      </span>
                    </div>

                    {/* Big clickable avatar */}
                    <div className="relative">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => fileRef.current?.click()}
                        className="relative grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary/15 via-accent/10 to-tutor/15 ring-2 ring-background"
                        aria-label={avatar ? "Change profile picture" : "Upload profile picture"}
                      >
                        {/* Rotating dashed ring */}
                        <motion.span
                          aria-hidden
                          animate={{ rotate: 360 }}
                          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                        />
                        {avatar ? (
                          <img
                            src={avatar}
                            alt="Profile preview"
                            className="relative h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="relative flex flex-col items-center gap-1 text-primary/70">
                            <CameraIcon className="h-8 w-8" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide">
                              Tap to upload
                            </span>
                          </div>
                        )}
                        {/* Hover overlay */}
                        <span className="absolute inset-0 grid place-items-center rounded-full bg-foreground/60 text-background opacity-0 backdrop-blur-sm transition group-hover/upload:opacity-100">
                          <Upload className="h-6 w-6" />
                        </span>
                      </motion.button>
                      {/* Status dot */}
                      <span
                        className={`absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full ring-2 ring-background transition ${
                          avatar
                            ? "bg-tutor text-tutor-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {avatar ? (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        ) : (
                          <CameraIcon className="h-3.5 w-3.5" />
                        )}
                      </span>
                      {avatar && (
                        <button
                          type="button"
                          onClick={() => setAvatar(null)}
                          className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-foreground text-background shadow-md transition hover:scale-110"
                          aria-label="Remove photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        onPickAvatar(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />

                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setRawAvatar(avatar)}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        Re-crop photo
                      </button>
                    )}
                  </div>

                  <AvatarCropper
                    src={rawAvatar}
                    onCancel={() => setRawAvatar(null)}
                    onApply={(url) => {
                      setAvatar(url);
                      setRawAvatar(null);
                    }}
                  />



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
                        label="Parent"
                        desc="Guide a learner"
                        icon={Heart}
                        active={role === "parent"}
                        onClick={() => setRole("parent")}
                      />
                    </div>
                  </div>
                </div>
              </StepPane>
            ) : step === 2 ? (
              <StepPane key="s-otp" dir={dir}>
                <div className="space-y-5">
                  <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-surface to-muted/40 p-5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Check your inbox
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          We sent a 4-digit code to{" "}
                          <span className="font-medium text-foreground">
                            {email || "your email"}
                          </span>
                          . Enter it below to verify.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-2 sm:gap-3">
                      {otp.map((d, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            otpRefs.current[i] = el;
                          }}
                          value={d}
                          onChange={(e) => setOtpAt(i, e.target.value)}
                          onKeyDown={(e) => onOtpKeyDown(i, e)}
                          onPaste={onOtpPaste}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={1}
                          aria-label={`Digit ${i + 1}`}
                          className={`h-14 w-12 rounded-xl border-2 bg-surface text-center font-display text-2xl font-semibold tabular-nums text-foreground transition focus:outline-none sm:h-16 sm:w-14 sm:text-3xl ${
                            d
                              ? "border-primary shadow-md shadow-primary/20"
                              : "border-border focus:border-primary/60"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-accent" />
                        Demo — any 4 digits work
                      </span>
                      {resendIn > 0 ? (
                        <span>Resend in {resendIn}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOtp(["", "", "", ""]);
                            setResendIn(30);
                            otpRefs.current[0]?.focus();
                          }}
                          className="font-semibold text-primary hover:underline"
                        >
                          Resend code
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={back}
                    className="mx-auto flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Wrong email? Go back
                  </button>
                </div>
              </StepPane>
            ) : (
              <StepPane key="s3" dir={dir}>
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
              ) : step === 3 ? (
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
