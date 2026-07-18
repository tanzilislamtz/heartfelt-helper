import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  Flame,
  MessageCircleQuestion,
  GraduationCap,
  MapPin,
  ArrowDownWideNarrow,
} from "lucide-react";

const TABS = [
  { label: "For You", Icon: Sparkles },
  { label: "Popular", Icon: Flame },
  { label: "Q&A", Icon: MessageCircleQuestion },
  { label: "Trending Tutors", Icon: GraduationCap },
  { label: "Nearby", Icon: MapPin },
];
const SORTS = ["Latest", "Top", "Rising"];

const POST_TYPES = ["Questions", "Notes", "Tutor posts", "Study groups"];
const TIME_RANGES = ["Today", "This week", "This month", "All time"];

export function FeedToolbar() {
  const [active, setActive] = useState(0);
  const [sort, setSort] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [range, setRange] = useState(1);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [filterOpen]);

  const toggleType = (t: string) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  const activeCount = types.length + (verifiedOnly ? 1 : 0) + (range !== 1 ? 1 : 0);

  

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface via-background to-surface p-2 shadow-sm">
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-accent/40 blur-3xl" />

      <div className="relative flex items-center gap-2">
        {/* Tab chips */}
        <div className="relative flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t, i) => {
            const isActive = i === active;
            const Icon = t.Icon;
            return (
              <button
                key={t.label}
                onClick={() => setActive(i)}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? "text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="feed-tab-pill"
                    className="absolute inset-0 rounded-full bg-foreground shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <span className="hidden h-6 w-px bg-border/70 sm:block" />

        {/* Sort — segmented dark pill */}
        <div className="hidden items-center gap-0.5 rounded-full bg-foreground/[0.06] p-0.5 ring-1 ring-inset ring-border md:flex">
          {SORTS.map((s, i) => (
            <button
              key={s}
              onClick={() => setSort(i)}
              className={`relative rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                sort === i
                  ? "text-background"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {sort === i && (
                <motion.span
                  layoutId="feed-sort-pill"
                  className="absolute inset-0 rounded-full bg-foreground shadow-sm"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{s}</span>
            </button>
          ))}
        </div>


        <div ref={filterRef} className="relative shrink-0">
          <button
            aria-label="Filters"
            onClick={() => setFilterOpen((o) => !o)}
            className={`relative grid h-9 w-9 place-items-center rounded-full border transition ${
              filterOpen || activeCount > 0
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-surface text-foreground/70 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-border bg-background p-3 shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Filters</p>
                  <button
                    onClick={() => {
                      setTypes([]);
                      setRange(1);
                      setVerifiedOnly(false);
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <p className="mb-1.5 text-[11px] font-semibold text-foreground/70">Post type</p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {POST_TYPES.map((t) => {
                    const on = types.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                          on
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface text-foreground/70 hover:border-primary/40"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                <p className="mb-1.5 text-[11px] font-semibold text-foreground/70">Time range</p>
                <div className="mb-3 grid grid-cols-2 gap-1.5">
                  {TIME_RANGES.map((r, i) => (
                    <button
                      key={r}
                      onClick={() => setRange(i)}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                        range === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-foreground/70 hover:border-primary/40"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-2.5 py-2">
                  <span className="text-xs font-medium text-foreground">Verified tutors only</span>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>

                <button
                  onClick={() => setFilterOpen(false)}
                  className="mt-3 w-full rounded-lg bg-foreground py-2 text-xs font-semibold text-background transition hover:opacity-90"
                >
                  Apply filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Meta row */}
      <div className="relative mt-2 hidden items-center gap-3 border-t border-dashed border-border/70 pt-2 text-xs text-muted-foreground sm:flex">
        <span className="inline-flex items-center gap-1.5">
          <ArrowDownWideNarrow className="h-3 w-3" />
          Showing <span className="font-semibold text-foreground">{TABS[active].label}</span>
          <span className="text-foreground/30">·</span>
          sorted by <span className="font-semibold text-foreground">{SORTS[sort]}</span>
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-tutor/10 px-2 py-0.5 font-medium text-tutor">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tutor opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-tutor" />
          </span>
          128 tutors online
        </span>
      </div>
    </div>
  );
}
