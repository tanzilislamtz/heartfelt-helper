import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Heart,
  MessageCircle,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  BadgeCheck,
  Clock,
  Video,
  Users,
} from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { MobileNav } from "@/components/MobileNav";
import { LeftNav } from "@/components/LeftNav";

export const Route = createFileRoute("/available-tutor")({
  head: () => ({
    meta: [
      { title: "Available Tutors — Learns Academy" },
      { name: "description", content: "Browse verified tutors ready to teach — filter by subject, class, location, teaching mode and fee." },
      { property: "og:title", content: "Available Tutors — Learns Academy" },
      { property: "og:description", content: "Find your perfect tutor. Verified profiles, real reviews, transparent fees." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AvailableTutorPage,
});

type Availability = "today" | "busy" | "week";

type Tutor = {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  gradient: string;
  verified: boolean;
  subjects: string[];
  board: string;
  experience: string;
  location: string;
  online: boolean;
  rating: number;
  reviews: number;
  availability: Availability;
  fee: number;
  mode: "Online" | "In-person" | "Both";
};

const tutors: Tutor[] = [
  {
    id: "protiq",
    name: "Protiq Halder",
    initials: "PH",
    gradient: "from-orange-400 to-rose-500",
    verified: true,
    subjects: ["Physics", "English", "Math"],
    board: "SSC",
    experience: "3 Years",
    location: "Dhaka, Dhaka",
    online: true,
    rating: 4.8,
    reviews: 35,
    availability: "today",
    fee: 1200,
    mode: "Both",
  },
  {
    id: "anika",
    name: "Anika Rahman",
    initials: "AR",
    gradient: "from-indigo-500 to-purple-600",
    verified: true,
    subjects: ["Mathematics", "English"],
    board: "HSC",
    experience: "5 Years",
    location: "Dhanmondi, Dhaka",
    online: false,
    rating: 4.8,
    reviews: 21,
    availability: "busy",
    fee: 1500,
    mode: "Online",
  },
  {
    id: "sadman",
    name: "Sadman Chowdhury",
    initials: "SC",
    gradient: "from-emerald-500 to-teal-600",
    verified: true,
    subjects: ["Chemistry", "Biology"],
    board: "SSC",
    experience: "2 Years",
    location: "Mirpur, Dhaka",
    online: true,
    rating: 4.6,
    reviews: 18,
    availability: "today",
    fee: 900,
    mode: "In-person",
  },
  {
    id: "farhana",
    name: "Farhana Islam",
    initials: "FI",
    gradient: "from-pink-500 to-fuchsia-600",
    verified: true,
    subjects: ["Bangla", "English", "ICT"],
    board: "JSC · SSC",
    experience: "6 Years",
    location: "Uttara, Dhaka",
    online: true,
    rating: 4.9,
    reviews: 54,
    availability: "week",
    fee: 1800,
    mode: "Both",
  },
  {
    id: "raihan",
    name: "Raihan Kabir",
    initials: "RK",
    gradient: "from-sky-500 to-blue-600",
    verified: false,
    subjects: ["Higher Math", "Physics"],
    board: "HSC",
    experience: "4 Years",
    location: "Gulshan, Dhaka",
    online: false,
    rating: 4.7,
    reviews: 27,
    availability: "today",
    fee: 2000,
    mode: "Online",
  },
];

const filterChips = ["Subject", "Class / Level", "Location", "Teaching Mode", "Fee Range", "Rating"];

const availabilityMeta: Record<Availability, { label: string; className: string; dot: string }> = {
  today: { label: "Available Today", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  busy: { label: "Busy · Book in Advance", className: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
  week: { label: "Available This Week", className: "bg-sky-50 text-sky-700 border border-sky-200", dot: "bg-sky-500" },
};

function AvailableTutorPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState<"top" | "fee-low" | "fee-high" | "new">("top");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tutors.filter((t) =>
      !q
        ? true
        : t.name.toLowerCase().includes(q) ||
          t.subjects.join(" ").toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q),
    );
    const sorted = [...list];
    if (sort === "top") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "fee-low") sorted.sort((a, b) => a.fee - b.fee);
    if (sort === "fee-high") sorted.sort((a, b) => b.fee - a.fee);
    if (sort === "new") sorted.sort((a, b) => b.reviews - a.reviews);
    return sorted;
  }, [query, sort]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 pb-28 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <LeftNav />

        <div className="min-w-0 space-y-5">
          {/* Hero header */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/10 blur-2xl" />
            <div className="relative flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Learns Academy</p>
                <h1 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">Available Tutors</h1>
                <p className="mt-1 max-w-lg text-sm text-white/85">
                  Verified educators ready to teach — filter, chat, and book in minutes.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {filtered.length} tutors found
              </span>
            </div>
          </section>

          {/* Search + sort */}
          <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by tutor name, subject, institute or keyword..."
                  className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-background pl-4 pr-9 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-56"
                >
                  <option value="top">Sort: Top Rated</option>
                  <option value="fee-low">Sort: Fee (Low → High)</option>
                  <option value="fee-high">Sort: Fee (High → Low)</option>
                  <option value="new">Sort: Most Reviewed</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Filter chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {filterChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  {chip}
                  <ChevronDown className="h-3 w-3" />
                </button>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
              >
                More Filters
                <SlidersHorizontal className="h-3 w-3" />
              </button>
            </div>
          </section>

          {/* Tutor list */}
          <section className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((t, i) => {
                const avail = availabilityMeta[t.availability];
                const isSaved = !!saved[t.id];
                return (
                  <motion.article
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 240, damping: 24 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-violet-500 to-fuchsia-500 opacity-0 transition group-hover:opacity-100" />

                    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                      {/* Avatar */}
                      <div className="relative">
                        <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${t.gradient} text-lg font-black text-white shadow-md`}>
                          {t.initials}
                        </div>
                        {t.online && (
                          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-surface bg-emerald-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          </span>
                        )}
                      </div>

                      {/* Center: name + subjects + meta */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h3 className="truncate text-base font-bold text-foreground">{t.name}</h3>
                          {t.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                              <BadgeCheck className="h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {t.subjects.map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-gradient-to-r from-fuchsia-50 to-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {t.board}</span>
                          <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {t.experience} Experience</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {t.location}</span>
                          <span className="inline-flex items-center gap-1">
                            {t.mode === "Online" ? <Video className="h-3.5 w-3.5" /> : t.mode === "In-person" ? <Users className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                            {t.mode}
                          </span>
                          {t.online && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: rating + availability + fee */}
                      <div className="col-span-2 flex flex-wrap items-start justify-between gap-3 border-t border-dashed border-border pt-4 sm:col-span-1 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-foreground">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {t.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">({t.reviews} Reviews)</span>
                          <button
                            type="button"
                            aria-label={isSaved ? "Unsave tutor" : "Save tutor"}
                            onClick={() => setSaved((s) => ({ ...s, [t.id]: !s[t.id] }))}
                            className="ml-1 grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition hover:bg-rose-50 hover:text-rose-500"
                          >
                            <Heart className={`h-4 w-4 transition ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
                          </button>
                        </div>

                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${avail.className}`}>
                          <CheckCircle2 className="h-3 w-3" />
                          {avail.label}
                        </span>

                        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-1.5 text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">Tutor Fee</p>
                          <p className="text-sm font-black text-primary">
                            ৳{t.fee.toLocaleString()}<span className="text-xs font-medium text-primary/70">/hr</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                      <Link
                        to="/message"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                      >
                        <MessageCircle className="h-4 w-4" /> Message
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:shadow-lg hover:shadow-violet-500/40"
                      >
                        View Profile
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <p className="text-sm font-medium text-foreground">No tutors match your search</p>
                <p className="mt-1 text-xs text-muted-foreground">Try clearing filters or searching a different subject.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
