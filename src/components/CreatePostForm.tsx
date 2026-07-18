import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  HelpCircle,
  UserSearch,
  GraduationCap,
  ChevronDown,
  Upload,
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
  { id: "learning", label: "Learning post", short: "Learning", icon: BookOpen, hint: "Share notes, tips or resources" },
  { id: "question", label: "Question", short: "Question", icon: HelpCircle, hint: "Ask the community for help" },
  { id: "tutor", label: "Looking for Tutor", short: "Tutor", icon: UserSearch, hint: "Find a tutor near you" },
  { id: "student", label: "Looking for Student", short: "Student", icon: GraduationCap, hint: "Offer your teaching" },
];

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
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-foreground">
        <span>{label}</span>
        {required && <span className="text-danger">*</span>}
        {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 transition focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10";

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
    <div className="group cursor-pointer rounded-xl border-2 border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-center transition hover:border-primary/50 hover:bg-primary/10">
      <div className="mx-auto mb-1.5 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary">
        <Upload className="h-4 w-4" /> Click to upload or drag and drop
      </div>
      <div className="text-[11px] text-muted-foreground">
        Images, video, PDF, DOC, PPT, XLS, TXT · ≤5 MB file / ≤50 MB video
      </div>
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold">
      {label}
      <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
        <span className="absolute right-0.5 h-4 w-4 rounded-full bg-white shadow" />
      </span>
    </label>
  );
}

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  tone,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  tone: "accent" | "tutor" | "primary";
}) {
  const map = {
    accent: "border-accent/20 bg-accent/5 text-accent",
    tutor: "border-tutor/20 bg-tutor/5 text-tutor",
    primary: "border-primary/20 bg-primary/5 text-primary",
  };
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3.5 ${map[tone]}`}>
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-current/15`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}

function LearningForm() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <SectionCard icon={BookOpen} title="Share Knowledge" subtitle="Share educational content, notes, tips, or resources with others." tone="accent" />
      </div>
      <Field label="Title" required className="md:col-span-2">
        <input className={inputCls} placeholder="Enter post title" />
      </Field>
      <Field label="Education Level" required>
        <Select placeholder="Select Education Level" />
      </Field>
      <Field label="Version">
        <Select placeholder="Select an education level first" />
      </Field>
      <Field label="Class / Level">
        <Select placeholder="Select a version first" />
      </Field>
      <Field label="Subject">
        <Select placeholder="Select a class / level first" />
      </Field>
      <Field label="Topic" hint="(Optional)">
        <input className={inputCls} placeholder="Enter topic" />
      </Field>
      <Field label="Chapter" hint="(Optional)">
        <input className={inputCls} placeholder="Enter chapter" />
      </Field>
      <Field label="Content" required className="md:col-span-2">
        <textarea rows={6} placeholder="Share your learning experience…" className={`${inputCls} resize-none`} />
      </Field>
      <Field label="Attach File" hint="(Optional)" className="md:col-span-2">
        <UploadBox />
      </Field>
      <Field label="Add Tags" hint="(Optional)">
        <input className={inputCls} placeholder="Add tags and press enter" />
      </Field>
      <Field label="Visibility">
        <Select placeholder="Public" />
      </Field>
      <div className="md:col-span-2">
        <Toggle label="Allow Comments" />
      </div>
    </div>
  );
}

function QuestionForm() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <SectionCard icon={HelpCircle} title="Ask a Question" subtitle="Get help from the community by asking your question." tone="tutor" />
      </div>
      <Field label="Education Level" required>
        <Select placeholder="Select Education Level" />
      </Field>
      <Field label="Version" required>
        <Select placeholder="Select an education level first" />
      </Field>
      <Field label="Class / Level" required>
        <Select placeholder="Select a version first" />
      </Field>
      <Field label="Subject" required>
        <Select placeholder="Select a class / level first" />
      </Field>
      <Field label="Chapter / Topic" hint="(Optional)">
        <input className={inputCls} placeholder="Enter chapter or topic" />
      </Field>
      <Field label="Urgency">
        <Select placeholder="Normal" />
      </Field>
      <Field label="Tags" hint="(Optional)" className="md:col-span-2">
        <input className={inputCls} placeholder="Add tags (optional)…" />
      </Field>
      <Field label="Question Details" required className="md:col-span-2">
        <textarea rows={6} className={`${inputCls} resize-none`} placeholder="Write your question clearly…" />
      </Field>
      <Field label="Attach File" hint="(Optional)">
        <UploadBox />
      </Field>
      <Field label="Visibility">
        <Select placeholder="Public" />
      </Field>
      <Toggle label="Allow Comments" />
      <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold">
        <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" /> Mark as solved
      </label>
    </div>
  );
}

function TutorRequestForm({ mode }: { mode: "tutor" | "student" }) {
  const isTutor = mode === "tutor";
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <SectionCard
          icon={isTutor ? UserSearch : GraduationCap}
          title={isTutor ? "Find a Tutor" : "Find a Student"}
          subtitle={
            isTutor
              ? "Find the right tutor who can help you learn better."
              : "Post your teaching offer and connect with students."
          }
          tone="primary"
        />
      </div>
      <Field label="Education Level" required>
        <Select placeholder="Select Education Level" />
      </Field>
      <Field label="Version" required>
        <Select placeholder="Select an education level first" />
      </Field>
      <Field label="Class / Level" required>
        <Select placeholder="Select a version first" />
      </Field>
      <Field label="Subject" required>
        <Select placeholder="Select a class / level first" />
      </Field>
      <Field label="Institute" hint="(Optional)">
        <input className={inputCls} placeholder="Enter institute name" />
      </Field>
      <Field label="Preferred Learning Mode">
        <div className="flex flex-wrap gap-1.5">
          {["Online", "Offline", "Hybrid", "Home Tutoring"].map((o) => (
            <label
              key={o}
              className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium transition hover:border-primary/40 hover:text-primary"
            >
              <input type="checkbox" className="mr-1.5 accent-primary" />
              {o}
            </label>
          ))}
        </div>
      </Field>
      <Field
        label={isTutor ? "Tutor Requirement Duration" : "Teaching Availability"}
        hint="(Optional)"
      >
        <Select placeholder="Select duration" />
      </Field>
      <Field label="Preferred Days">
        <div className="flex flex-wrap gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <label
              key={d}
              className="cursor-pointer rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] font-semibold transition hover:border-primary/40"
            >
              <input type="checkbox" className="mr-1 accent-primary" />
              {d}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Preferred Time">
        <Select placeholder="Select time" />
      </Field>
      <Field label="Division">
        <Select placeholder="Select division" />
      </Field>
      <Field label="District">
        <Select placeholder="Select district" />
      </Field>
      <Field label="Thana / Upazila">
        <Select placeholder="Select thana" />
      </Field>
      <Field label="Location / Area" hint="(Optional)">
        <input className={inputCls} placeholder="Enter area" />
      </Field>
      <Field label={isTutor ? "Budget (Monthly)" : "Expected Salary"} hint="(Optional)">
        <input className={inputCls} placeholder="Enter your budget" />
      </Field>
      <Field label="Start Date" hint="(Optional)">
        <input type="date" className={inputCls} />
      </Field>
      <Field label="Visibility">
        <Select placeholder="Public" />
      </Field>
      <Field label="Details" required className="md:col-span-2">
        <textarea
          rows={5}
          className={`${inputCls} resize-none`}
          placeholder={
            isTutor ? "Describe what you need from a tutor…" : "Describe your teaching offer…"
          }
        />
      </Field>
      <Field label="Attach File" hint="(Optional)" className="md:col-span-2">
        <UploadBox />
      </Field>
      <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold">
        <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" /> Urgent Need — show an urgent badge on this post
      </label>
      <Toggle label="Allow Comments" />
    </div>
  );
}

export function CreatePostForm({ initialTab = "learning" }: { initialTab?: PostTab }) {
  const [tab, setTab] = useState<PostTab>(initialTab);
  const current = POST_TABS.find((t) => t.id === tab)!;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Sidebar — post type picker */}
      <aside className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
        <div className="rounded-2xl border border-border bg-surface p-3 shadow-sm">
          <div className="mb-2 px-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Post type
          </div>
          <div className="flex flex-col gap-1">
            {POST_TABS.map((t) => {
              const active = t.id === tab;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="postTabActive"
                      className="absolute inset-y-2 left-0 w-1 rounded-r bg-primary"
                    />
                  )}
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{t.label}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {t.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 hidden rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-surface to-accent/8 p-4 lg:block">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Pro tip
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Add clear tags and a specific title — posts with tags get 3× more engagement.
          </p>
        </div>
      </aside>

      {/* Main form area */}
      <section className="min-w-0">
        {/* Mobile tab pills */}
        <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {POST_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-foreground/70"
              }`}
            >
              {t.short}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6">
          {/* Author strip */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                A
              </div>
              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-semibold">You</div>
                <div className="text-xs text-muted-foreground">
                  Posting to <span className="font-medium text-foreground">Everyone</span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80 transition hover:border-primary/40 hover:text-primary">
              Change <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "learning" && <LearningForm />}
              {tab === "question" && <QuestionForm />}
              {tab === "tutor" && <TutorRequestForm mode="tutor" />}
              {tab === "student" && <TutorRequestForm mode="student" />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action bar — sticky on mobile for reachability */}
        <div className="sticky bottom-0 z-10 mt-4 flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur sm:static sm:shadow-sm">
          <div className="mr-auto hidden text-[11px] text-muted-foreground sm:block">
            Your content must reach community standards.
          </div>
          <button className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-muted">
            Save Draft
          </button>
          <button className="rounded-lg border border-primary/40 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5">
            Preview
          </button>
          <button className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-md transition hover:opacity-95">
            Post Now
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] text-muted-foreground sm:hidden">
          Your content must reach community standards.
        </p>
      </section>
    </div>
  );
}
