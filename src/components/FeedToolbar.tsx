import { motion } from "framer-motion";
import { useState } from "react";
import {
  SlidersHorizontal,
  LayoutGrid,
  Rows3,
  Sparkles,
  Plus,
  ArrowDownWideNarrow,
} from "lucide-react";

const TABS = ["For You", "Popular", "Q&A", "Trending Tutors", "Nearby"];
const SORTS = ["Latest", "Top", "Rising"];

export function FeedToolbar() {
  const [active, setActive] = useState(0);
  const [sort, setSort] = useState(0);
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <div className="sticky top-[64px] z-30 -mx-4 rounded-none border-y border-border bg-background/80 px-4 py-2.5 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-3 sm:py-2">
      <div className="flex items-center gap-2">
        {/* Tab chips */}
        <div className="relative flex min-w-0 flex-1 gap-1.5 overflow-x-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t}
                onClick={() => setActive(i)}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="feed-tab-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {i === 0 && <Sparkles className="mr-1 inline h-3.5 w-3.5" />}
                {t}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <span className="hidden h-6 w-px bg-border sm:block" />

        {/* Sort */}
        <div className="hidden items-center gap-1 rounded-full border border-border bg-surface p-0.5 md:flex">
          {SORTS.map((s, i) => (
            <button
              key={s}
              onClick={() => setSort(i)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                sort === i
                  ? "bg-foreground text-background"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="hidden items-center rounded-full border border-border bg-surface p-0.5 sm:flex">
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`grid h-7 w-7 place-items-center rounded-full transition ${
              view === "list" ? "bg-foreground text-background" : "text-foreground/60"
            }`}
          >
            <Rows3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`grid h-7 w-7 place-items-center rounded-full transition ${
              view === "grid" ? "bg-foreground text-background" : "text-foreground/60"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          aria-label="Filters"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-surface text-foreground/70 transition hover:text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

      </div>

      {/* Meta row */}
      <div className="mt-2 hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
        <span className="inline-flex items-center gap-1">
          <ArrowDownWideNarrow className="h-3 w-3" />
          Showing <span className="font-medium text-foreground">{TABS[active]}</span> · sorted by{" "}
          <span className="font-medium text-foreground">{SORTS[sort]}</span>
        </span>
        <span className="ml-auto inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tutor" />
          128 tutors online
        </span>
      </div>
    </div>
  );
}
