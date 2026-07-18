import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  HelpCircle,
  UserSearch,
  GraduationCap,
  ChevronDown,
  Upload,
  ArrowLeft,
  FileText,
  Globe2,
  Lock,
  Users,
  Check,
  Image as ImageIcon,
  Video,
  Hash,
  X,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export type PostTab = "learning" | "question" | "tutor" | "student";

export const POST_TABS: {
  id: PostTab;
  label: string;
  short: string;
  icon: React.ElementType;
  hint: string;
}[] = [
  { id: "learning", label: "Learning Post", short: "Learning", icon: BookOpen, hint: "Share notes, tips or resources" },
  { id: "question", label: "Question", short: "Question", icon: HelpCircle, hint: "Ask the community for help" },
  { id: "tutor", label: "Looking for Tutor", short: "Tutor", icon: UserSearch, hint: "Find a tutor near you" },
  { id: "student", label: "Looking for Student", short: "Student", icon: GraduationCap, hint: "Offer your teaching" },
];

/* ─────────────────────────  audience picker  ───────────────────────── */

const AUDIENCES = [
  { id: "public", label: "Public", desc: "Anyone on Learns Academy", icon: Globe2 },
  { id: "friends", label: "Friends only", desc: "Only your connections", icon: Users },
  { id: "onlyme", label: "Only me", desc: "Just for you", icon: Lock },
] as const;

type AudienceId = (typeof AUDIENCES)[number]["id"];

function AudiencePicker() {
  const [value, setValue] = useState<AudienceId>("public");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = AUDIENCES.find((a) => a.id === value)!;
  const Icon = current.icon;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/5 sm:text-xs"
      >
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span>{current.label}</span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
          >
            <div className="border-b border-border px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Who can see this post?
            </div>
            <ul className="p-1">
              {AUDIENCES.map((a) => {
                const AIcon = a.icon;
                const active = a.id === value;
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setValue(a.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition ${
                        active ? "bg-primary/10" : "hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-full ${
                          active ? "bg-primary/15 text-primary" : "bg-muted text-foreground/70"
                        }`}
                      >
                        <AIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-foreground">{a.label}</span>
                        <span className="block text-[11px] text-muted-foreground">{a.desc}</span>
                      </span>
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────  primitives  ───────────────────────── */

function Field({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        {required && <span className="text-danger normal-case">*</span>}
        {hint && <span className="font-normal normal-case text-muted-foreground/70">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition focus:border-primary/50 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/10";

function Select({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <select className={`${inputCls} appearance-none pr-9`} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function UploadBox() {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-border bg-gradient-to-br from-muted/40 via-surface to-primary/5 p-6 transition hover:border-primary/60 hover:from-primary/5 hover:to-primary/10">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white shadow-md shadow-primary/20 transition group-hover:scale-105">
          <Upload className="h-5 w-5" strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground group-hover:text-primary">
            Click to upload or drag & drop
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            Max 5 MB per file · 50 MB per video
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {[
              { icon: ImageIcon, label: "Images" },
              { icon: Video, label: "Video" },
              { icon: FileText, label: "PDF · DOC · PPT · XLS · TXT" },
            ].map(({ icon: I, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                <I className="h-3 w-3" /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SUGGESTED_TAGS = ["math", "physics", "hsc", "notes", "help", "chemistry"];

function TagsInput({ placeholder = "Add a tag and press enter" }: { placeholder?: string }) {
  const [tags, setTags] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const addTag = (t: string) => {
    const clean = t.trim().replace(/^#/, "").toLowerCase();
    if (!clean || tags.includes(clean) || tags.length >= 8) return;
    setTags((prev) => [...prev, clean]);
    setValue("");
  };

  return (
    <div>
      <div className="group flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-2.5 py-2 transition focus-within:border-primary/50 focus-within:bg-surface focus-within:ring-4 focus-within:ring-primary/10">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pl-2 pr-1 text-xs font-semibold text-primary"
          >
            <Hash className="h-3 w-3" />
            {t}
            <button
              type="button"
              onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
              className="grid h-4 w-4 place-items-center rounded-full text-primary/70 hover:bg-primary/20 hover:text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(value);
            } else if (e.key === "Backspace" && !value && tags.length) {
              setTags((prev) => prev.slice(0, -1));
            }
          }}
          placeholder={tags.length ? "" : placeholder}
          className="min-w-[8ch] flex-1 bg-transparent px-1.5 py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Suggested</span>
        {SUGGESTED_TAGS.filter((s) => !tags.includes(s)).slice(0, 5).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => addTag(s)}
            className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            #{s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, defaultChecked = true }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span className="relative inline-flex">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h4 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h4>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ─────────────────────────  shared blocks  ───────────────────────── */

function TitleInput({ placeholder = "Enter a compelling title for your post…" }: { placeholder?: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="mb-8 w-full border-none bg-transparent p-0 text-2xl font-semibold leading-tight text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 sm:text-3xl"
    />
  );
}

function ContentEditor({ placeholder }: { placeholder: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 focus-within:border-primary/40 focus-within:bg-surface focus-within:ring-4 focus-within:ring-primary/10">
      <div className="flex items-center gap-1 border-b border-border/70 px-2 py-1.5 text-muted-foreground">
        <button type="button" className="rounded px-2 py-1 text-sm font-bold hover:bg-muted">B</button>
        <button type="button" className="rounded px-2 py-1 text-sm italic hover:bg-muted">I</button>
        <button type="button" className="rounded px-2 py-1 text-sm underline hover:bg-muted">U</button>
        <span className="mx-1 h-4 w-px bg-border" />
        <button type="button" className="rounded px-2 py-1 text-[11px] font-semibold hover:bg-muted">List</button>
        <button type="button" className="rounded px-2 py-1 text-[11px] font-semibold hover:bg-muted">Link</button>
        <button type="button" className="rounded px-2 py-1 text-[11px] font-semibold hover:bg-muted">Image</button>
      </div>
      <textarea
        rows={7}
        placeholder={placeholder}
        className="w-full resize-none rounded-b-xl bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
      />
    </div>
  );
}

function VisibilityRow() {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-muted/40 via-surface to-primary/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Interactions
          </div>
          <div className="text-sm font-semibold text-foreground">
            Let others comment on this post
          </div>
        </div>
      </div>
      <Toggle label="Allow comments" />
    </div>
  );
}


function InfoCard({
  icon: Icon,
  title,
  desc,
  tone,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  tone: "learning" | "question" | "tutor" | "student";
}) {
  const styles = {
    learning: "border-amber-200/60 bg-amber-50 text-amber-900 [--ic:theme(colors.amber.600)]",
    question: "border-sky-200/60 bg-sky-50 text-sky-900 [--ic:theme(colors.sky.600)]",
    tutor: "border-violet-200/60 bg-violet-50 text-violet-900 [--ic:theme(colors.violet.600)]",
    student: "border-emerald-200/60 bg-emerald-50 text-emerald-900 [--ic:theme(colors.emerald.600)]",
  }[tone];
  return (
    <div className={`mb-8 flex items-start gap-3 rounded-xl border p-4 ${styles}`}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/70 text-[color:var(--ic)]">
        <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <div className="text-base font-bold text-[color:var(--ic)]">{title}</div>
        <p className="mt-0.5 text-sm leading-snug opacity-80">{desc}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────  form bodies  ───────────────────────── */

function LearningForm() {
  return (
    <>
      <InfoCard icon={BookOpen} tone="learning" title="Share Knowledge" desc="Share educational content, notes, tips, or resources with others." />
      <TitleInput />

      <section className="mb-10">
        <SectionHeader title="Academic Context" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field label="Education Level" required><Select placeholder="Select level" /></Field>
          <Field label="Version"><Select placeholder="Select version" /></Field>
          <Field label="Class / Level"><Select placeholder="Select class" /></Field>
          <Field label="Subject"><Select placeholder="Select subject" /></Field>
          <Field label="Topic" hint="(Optional)"><input className={inputCls} placeholder="Enter topic" /></Field>
          <Field label="Chapter" hint="(Optional)"><input className={inputCls} placeholder="Enter chapter" /></Field>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="Post Content" />
        <ContentEditor placeholder="Share your learning experience…" />
      </section>

      <section className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <SectionHeader title="Attachments" />
          <UploadBox />
        </div>
        <div>
          <SectionHeader title="Tags" />
          <TagsInput placeholder="Add tags and press enter" />
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Posts with tags get <span className="font-semibold text-foreground">3× more</span> engagement.
          </p>
        </div>
      </section>

      <VisibilityRow />
    </>
  );
}

function QuestionForm() {
  return (
    <>
      <InfoCard icon={HelpCircle} tone="question" title="Ask a Question" desc="Get help from the community — the clearer your question, the better the answers." />
      <TitleInput placeholder="What's your question?" />

      <section className="mb-10">
        <SectionHeader title="Academic Context" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field label="Education Level" required><Select placeholder="Select level" /></Field>
          <Field label="Version" required><Select placeholder="Select version" /></Field>
          <Field label="Class / Level" required><Select placeholder="Select class" /></Field>
          <Field label="Subject" required><Select placeholder="Select subject" /></Field>
          <Field label="Chapter / Topic" hint="(Optional)"><input className={inputCls} placeholder="Chapter or topic" /></Field>
          <Field label="Urgency"><Select placeholder="Normal" /></Field>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="Question Details" />
        <ContentEditor placeholder="Explain your question clearly — include what you've tried and where you're stuck." />
      </section>

      <section className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <SectionHeader title="Attachments" />
          <UploadBox />
        </div>
        <div>
          <SectionHeader title="Tags" />
          <input className={inputCls} placeholder="Add tags (optional)" />
          <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
            Mark as solved when you get an accepted answer
          </label>
        </div>
      </section>

      <VisibilityRow />
    </>
  );
}

function TutorRequestForm({ mode }: { mode: "tutor" | "student" }) {
  const isTutor = mode === "tutor";
  return (
    <>
      {isTutor ? (
        <InfoCard icon={UserSearch} tone="tutor" title="Find a Tutor" desc="Tell us what you need — subjects, schedule, location — and connect with the right tutor." />
      ) : (
        <InfoCard icon={GraduationCap} tone="student" title="Offer Your Teaching" desc="Share your expertise and reach students looking for a tutor like you." />
      )}
      <TitleInput placeholder={isTutor ? "Looking for a tutor — briefly describe…" : "Offering to teach — briefly describe…"} />

      <section className="mb-10">
        <SectionHeader title="Academic Context" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field label="Education Level" required><Select placeholder="Select level" /></Field>
          <Field label="Version" required><Select placeholder="Select version" /></Field>
          <Field label="Class / Level" required><Select placeholder="Select class" /></Field>
          <Field label="Subject" required><Select placeholder="Select subject" /></Field>
          <Field label="Institute" hint="(Optional)"><input className={inputCls} placeholder="Institute name" /></Field>
          <Field label={isTutor ? "Budget (Monthly)" : "Expected Salary"} hint="(Optional)">
            <input className={inputCls} placeholder="Amount in BDT" />
          </Field>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="Schedule & Mode" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Preferred Learning Mode">
            <div className="flex flex-wrap gap-1.5">
              {["Online", "Offline", "Hybrid", "Home Tutoring"].map((o) => (
                <label key={o} className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium transition hover:border-primary/40 hover:text-primary">
                  <input type="checkbox" className="mr-1.5 accent-primary" />{o}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Preferred Days">
            <div className="flex flex-wrap gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <label key={d} className="cursor-pointer rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] font-semibold transition hover:border-primary/40">
                  <input type="checkbox" className="mr-1 accent-primary" />{d}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Preferred Time"><Select placeholder="Select time" /></Field>
          <Field label={isTutor ? "Requirement Duration" : "Teaching Availability"} hint="(Optional)">
            <Select placeholder="Select duration" />
          </Field>
          <Field label="Start Date" hint="(Optional)"><input type="date" className={inputCls} /></Field>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="Location" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <Field label="Division"><Select placeholder="Division" /></Field>
          <Field label="District"><Select placeholder="District" /></Field>
          <Field label="Thana / Upazila"><Select placeholder="Thana" /></Field>
          <Field label="Area" hint="(Optional)"><input className={inputCls} placeholder="Enter area" /></Field>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="Details" />
        <ContentEditor placeholder={isTutor ? "Describe what you need from a tutor…" : "Describe your teaching offer…"} />
      </section>

      <section className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <SectionHeader title="Attachments" />
          <UploadBox />
        </div>
        <div>
          <SectionHeader title="Options" />
          <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
            <span className="font-medium">Urgent — show an urgent badge on this post</span>
          </label>
        </div>
      </section>

      <VisibilityRow />
    </>
  );
}

/* ─────────────────────────  main shell  ───────────────────────── */

function ActionButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "sm:gap-3"}`}>
      <button className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground sm:text-sm">
        Save Draft
      </button>
      <button className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary sm:px-4 sm:text-sm">
        Preview
      </button>
      <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-95 sm:px-6 sm:text-sm">
        Post Now
      </button>
    </div>
  );
}

export function CreatePostForm({ initialTab = "learning" }: { initialTab?: PostTab }) {
  const [tab, setTab] = useState<PostTab>(initialTab);
  const current = POST_TABS.find((t) => t.id === tab)!;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg shadow-primary/5">
      <div className="flex flex-col lg:flex-row">
        {/* Dark sidebar — post type picker */}
        <aside className="hidden bg-primary p-6 text-primary-foreground lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
          <Link
            to="/"
            className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>

          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            Post Type
          </h2>
          <nav className="flex flex-col gap-1">
            {POST_TABS.map((t) => {
              const active = t.id === tab;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`group flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md transition ${
                      active ? "bg-white/15 text-white" : "bg-white/5 text-white/70"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-tight">{t.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-white/45">
                      {t.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 pt-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
                Pro tip
              </div>
              <p className="text-xs leading-relaxed text-white/75">
                Add a specific title and clear tags — posts with strong metadata reach 3× more learners.
              </p>
            </div>
            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 py-2 text-[11px] font-semibold text-white/80 transition hover:border-white/30 hover:text-white">
              <FileText className="h-3.5 w-3.5" /> My Drafts
            </button>
          </div>
        </aside>

        {/* Form area */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-8 sm:py-5">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                Create New Post
              </h1>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
                <span>Posting as <span className="font-semibold text-foreground">You</span> · to</span>
                <AudiencePicker />
              </div>
            </div>
            <div className="hidden sm:block">
              <ActionButtons />
            </div>
          </header>

          {/* Mobile back + tab pills */}
          <div className="border-b border-border px-5 py-3 lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Link>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Post Type
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {POST_TABS.map((t) => {
                const Icon = t.icon;
                const active = t.id === tab;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface text-foreground/70"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.short}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                {tab === "learning" && <LearningForm />}
                {tab === "question" && <QuestionForm />}
                {tab === "tutor" && <TutorRequestForm mode="tutor" />}
                {tab === "student" && <TutorRequestForm mode="student" />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky mobile action bar */}
          <div className="sticky bottom-0 z-10 flex items-center justify-between gap-2 border-t border-border bg-surface/95 px-5 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.04)] backdrop-blur sm:hidden">
            <span className="text-[10px] text-muted-foreground">Draft saved automatically</span>
            <ActionButtons compact />
          </div>
        </main>
      </div>
    </div>
  );
}
