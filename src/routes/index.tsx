import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Home,
  Compass,
  BookOpen,
  Bell,
  MessageCircle,
  Bookmark,
  Award,
  Users,
  Sparkles,
  Image as ImageIcon,
  Paperclip,
  BarChart3,
  Heart,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowUpRight,
  GraduationCap,
  Menu,
} from "lucide-react";

import { MobileNav } from "@/components/MobileNav";
import { Topbar } from "@/components/Topbar";
import { FeedToolbar } from "@/components/FeedToolbar";
import { hasWelcomed, isAuthed } from "@/lib/session";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      navigate({ to: hasWelcomed() ? "/login" : "/welcome", replace: true });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background text-muted-foreground">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          Loading your space…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar onMenu={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:px-8">
        <LeftNav />
        <Feed />
        <RightRail />
      </main>
      <MobileTabBar />
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 lg:px-8">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-foreground/70 hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            <span className="font-display italic">Learns</span>
            <span className="ml-1 text-primary">Academy</span>
          </span>
        </a>

        <div className="relative ml-auto hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics, tutors, courses…"
            className="h-10 w-full rounded-full border border-border bg-muted/60 pl-10 pr-4 text-sm outline-none transition focus:border-primary/40 focus:bg-surface focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <IconBtn label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </IconBtn>
          <IconBtn label="Messages">
            <MessageCircle className="h-5 w-5" />
          </IconBtn>
          <Link
            to="/login"
            className="ml-2 hidden items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="ml-1 hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 sm:inline-flex"
          >
            <Plus className="h-4 w-4" /> Join
          </Link>
          <div className="ml-2 h-9 w-9 overflow-hidden rounded-full border-2 border-accent bg-muted">
            <div className="grid h-full w-full place-items-center bg-primary text-sm font-bold text-primary-foreground">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

function LeftNav() {
  const items = [
    { icon: Home, label: "Home", active: true },
    { icon: Compass, label: "Explore" },
    { icon: BookOpen, label: "Courses" },
    { icon: Users, label: "Communities" },
    { icon: Award, label: "Rewards" },
    { icon: Bookmark, label: "Saved" },
  ];
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-24 space-y-1">
        {items.map(({ icon: Icon, label, active }) => (
          <a
            key={label}
            href="#"
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/75 hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
            {label}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
          </a>
        ))}

        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Your progress
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold text-foreground">72</span>
            <span className="text-xs text-muted-foreground">/ 100 XP</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[72%] rounded-full bg-tutor" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            28 XP to <span className="font-medium text-foreground">Level 4</span>
          </p>
        </div>
      </nav>
    </aside>
  );
}

function Feed() {
  return (
    <section className="space-y-5">
      
      <Composer />
      <TopicChips />
      <NearbyTutors />

      <Post
        author="Alia Bhatt"
        role="tutor"
        handle="@alia.tutors"
        time="2h · Public"
        verified
        title="Free doubt-solving session tonight — Class 9 & 10 Math"
        body="আজ রাত ৯টায় ফ্রি ডাউট সলভিং সেশন। Algebra, Geometry, Trigonometry — যেকোনো প্রশ্ন নিয়ে আসুন। জুম লিঙ্ক কমেন্টে দেওয়া হবে।"
        tag="Class 9-10 Math"
        stats={{ likes: 328, comments: 42, shares: 18 }}
      />

      <BestTutorCard />

      <Post
        author="Nabila Chowdhury"
        role="student"
        handle="@nabila.bio"
        time="4h · Public"
        title="Butterfly on marigold — captured for my Biology assignment"
        body="Field notes for chapter 7 (Pollination). Any tips on identifying this species? Guessing it's a Plain Tiger."
        tag="Biology · Class 10"
        stats={{ likes: 512, comments: 88, shares: 24 }}
        mediaUrl="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&auto=format&fit=crop"
      />

      <Post
        author="Rafi Islam"
        role="tutor"
        handle="@rafi.stem"
        time="6h · Public"
        title="Weekend group class — pick your subjects"
        body="ছুটির দিনে অনলাইন গ্রুপ ক্লাস নিচ্ছি। প্রতিটি সেশন ৪৫ মিনিট, ছোট ব্যাচ। আগ্রহীরা কমেন্ট করুন কোন সাবজেক্ট চান।"
        tag="Weekend Batch"
        tags={["Math", "Physics", "Chemistry", "Bangla Math"]}
        stats={{ likes: 176, comments: 51, shares: 9 }}
      />

      <Post
        author="Rayhan Chowdhury"
        role="student"
        handle="@rayhan.reads"
        time="Yesterday · Public"
        title="Study setup for finals week"
        body="একটা আপেল, কয়েকটা বই — ব্যস, এটাই এই সপ্তাহের রুটিন। Board exam ঠিক ১২ দিন দূরে।"
        tag="Motivation"
        stats={{ likes: 421, comments: 66, shares: 12 }}
        mediaUrl="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop"
      />
    </section>
  );
}


function Composer() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          A
        </div>
        <div className="min-w-0 flex-1">
          <textarea
            rows={2}
            placeholder="Share a thought, ask a question, drop a note…"
            className="w-full resize-none rounded-xl border border-transparent bg-muted/60 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary/30 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
          <div className="mt-3 flex flex-wrap items-center gap-1">
            <ComposerBtn icon={ImageIcon} label="Image" />
            <ComposerBtn icon={Paperclip} label="Attach" />
            <ComposerBtn icon={BarChart3} label="Poll" />
            <ComposerBtn icon={BookOpen} label="Note" />
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Posting to <span className="font-medium text-foreground">Everyone</span>
              </span>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-95">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposerBtn({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground">
      <Icon className="h-4 w-4 text-tutor" />
      {label}
    </button>
  );
}

function TopicChips() {
  const topics = ["For You", "Popular", "Q&A", "Trending Tutors"];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {topics.map((t, i) => (
        <button
          key={t}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            i === 0
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-surface text-foreground/70 hover:border-foreground/30 hover:text-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function NearbyTutors() {
  const tutors = [
    { name: "Nadia Karim", subject: "Physics · 2.1 km away", rating: 4.9, tone: "primary" as const },
    { name: "Tanvir Ahmed", subject: "Web Dev · 3.4 km away", rating: 4.8, tone: "tutor" as const },
    { name: "Meherun Nisa", subject: "IELTS · 1.6 km away", rating: 5.0, tone: "accent" as const },
    { name: "Sabbir Rahman", subject: "Chemistry · 4.2 km away", rating: 4.7, tone: "primary" as const },
  ];
  const toneMap = {
    primary: "from-primary/20 via-primary/10 to-transparent ring-primary/30 text-primary",
    tutor: "from-tutor/25 via-tutor/10 to-transparent ring-tutor/30 text-tutor",
    accent: "from-accent/40 via-accent/15 to-transparent ring-accent/40 text-foreground",
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Nearby tutors</h3>
        <button className="text-xs font-medium text-primary hover:underline">See all</button>
      </div>
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tutors.map((t) => (
          <motion.div
            key={t.name}
            whileHover={{ y: -3 }}
            className="relative w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
          >
            <div className={`aspect-[4/5] bg-gradient-to-br ${toneMap[t.tone]}`}>
              <div className="grid h-full w-full place-items-center">
                <div className={`grid h-16 w-16 place-items-center rounded-full bg-background text-xl font-bold ring-2 ${toneMap[t.tone].split(" ").find((c) => c.startsWith("ring-"))}`}>
                  <span className={toneMap[t.tone].split(" ").find((c) => c.startsWith("text-"))}>
                    {t.name.charAt(0)}
                  </span>
                </div>
              </div>
              <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
                ★ {t.rating}
              </span>
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.subject}</p>
              <button className="mt-2.5 w-full rounded-full bg-primary py-1.5 text-[11px] font-semibold text-primary-foreground transition hover:opacity-95">
                Follow
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BestTutorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl border border-accent/50 bg-gradient-to-br from-accent/40 via-surface to-surface p-4 shadow-sm"
    >
      <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/30 blur-2xl" />
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Best tutor available
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md">
            R
          </div>
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-tutor text-tutor-foreground ring-2 ring-surface">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            Rayhan Chowdhury <span className="text-xs text-muted-foreground">· ★ 4.9</span>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Physics · Chemistry · 6y experience · BUET
          </p>
          <p className="mt-0.5 text-[11px] text-primary">Available today · 2 slots left</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-muted">
          Join Now
        </button>
        <button className="flex-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-95">
          Book Now
        </button>
      </div>
    </motion.div>
  );
}

type Role = "tutor" | "student" | "guest";
function Post({
  author,
  role,
  handle,
  time,
  title,
  body,
  tag,
  tags,
  stats,
  verified,
  media,
  mediaUrl,
}: {
  author: string;
  role: Role;
  handle: string;
  time: string;
  title: string;
  body: string;
  tag: string;
  tags?: string[];
  stats: { likes: number; comments: number; shares: number };
  verified?: boolean;
  media?: boolean;
  mediaUrl?: string;
}) {
  const roleStyles: Record<Role, { badge: string; ring: string; label: string }> = {
    tutor: { badge: "bg-tutor text-tutor-foreground", ring: "ring-tutor", label: "Tutor" },
    student: { badge: "bg-primary text-primary-foreground", ring: "ring-primary", label: "Student" },
    guest: { badge: "bg-accent text-accent-foreground", ring: "ring-accent", label: "Guest" },
  };
  const rs = roleStyles[role];

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(stats.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(stats.shares);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{ id: number; author: string; text: string; time: string }[]>([]);
  const [draft, setDraft] = useState("");

  const commentCount = stats.comments + comments.length;

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikes((n) => n + (liked ? -1 : 1));
  };
  const onShare = () => setShared((n) => n + 1);
  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setComments((c) => [
      ...c,
      { id: Date.now(), author: "You", text, time: "now" },
    ]);
    setDraft("");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 18px 40px -20px rgba(41,44,117,0.25)" }}
      className="group rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted font-semibold text-foreground ring-2 ${rs.ring}`}>
            {author.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-foreground">{author}</span>
              {verified && <CheckCircle2 className="h-4 w-4 shrink-0 text-tutor" />}
              <span className={`ml-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${rs.badge}`}>
                {rs.label}
              </span>
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {handle} · {time}
            </div>
          </div>
        </div>
        <button aria-label="More" className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-4">
        <h2 className="font-display text-xl font-semibold leading-snug text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/75">{body}</p>
      </div>

      {mediaUrl ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={mediaUrl}
            alt={title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      ) : media ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-primary via-primary to-tutor">
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-xl bg-background/95 px-4 py-3 text-center shadow-lg">
                <div className="font-display text-2xl font-semibold text-foreground">Solved ✓</div>
                <div className="text-xs text-muted-foreground">Runtime beats 96% · Memory 87%</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          #{tag}
        </span>
        {tags?.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/70"
          >
            #{t}
          </span>
        ))}
      </div>


      <footer className="mt-4 flex items-center gap-1 border-t border-border pt-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleLike}
          aria-pressed={liked}
          className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            liked
              ? "bg-destructive/10 text-destructive"
              : "text-foreground/70 hover:bg-muted hover:text-foreground"
          }`}
        >
          <span className="relative inline-flex">
            <motion.span
              key={liked ? "on" : "off"}
              initial={{ scale: 0.6, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
              className="inline-flex"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            </motion.span>

            {/* Ripple ring */}
            <AnimatePresence>
              {liked && (
                <motion.span
                  key="ring"
                  initial={{ scale: 0.3, opacity: 0.6 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-destructive"
                />
              )}
            </AnimatePresence>

            {/* Floating burst hearts */}
            <AnimatePresence>
              {liked &&
                [0, 1, 2, 3, 4].map((i) => {
                  const angle = (i / 5) * Math.PI - Math.PI / 2;
                  const dist = 28 + (i % 2) * 10;
                  const x = Math.cos(angle) * dist;
                  const y = Math.sin(angle) * dist - 6;
                  return (
                    <motion.span
                      key={`burst-${i}`}
                      initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                      animate={{ x, y, scale: 1, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.02 }}
                      className="pointer-events-none absolute left-0 top-0 text-destructive"
                    >
                      <Heart className="h-3 w-3 fill-current" />
                    </motion.span>
                  );
                })}
            </AnimatePresence>
          </span>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={likes}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="tabular-nums"
            >
              {likes}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowComments((v) => !v)}
          aria-expanded={showComments}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            showComments
              ? "bg-primary/10 text-primary"
              : "text-foreground/70 hover:bg-muted hover:text-foreground"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {commentCount}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onShare}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          {shared}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setBookmarked((v) => !v)}
          aria-pressed={bookmarked}
          className={`ml-auto rounded-full p-2 transition ${
            bookmarked
              ? "bg-accent/25 text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
        </motion.button>
      </footer>

      <AnimatePresence initial={false}>
        {showComments && (
          <motion.div
            key="comments"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              {comments.length === 0 && (
                <p className="text-xs text-muted-foreground">Be the first to comment.</p>
              )}
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {c.author.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1 rounded-2xl bg-muted/60 px-3 py-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-foreground">{c.author}</span>
                      <span className="text-muted-foreground">· {c.time}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-foreground/85">{c.text}</p>
                  </div>
                </motion.div>
              ))}

              <form onSubmit={submitComment} className="flex gap-2 pt-1">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  A
                </div>
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a comment…"
                  className="h-9 min-w-0 flex-1 rounded-full border border-transparent bg-muted/60 px-4 text-sm outline-none focus:border-primary/30 focus:bg-surface focus:ring-4 focus:ring-primary/10"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="shrink-0 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-40"
                >
                  Post
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}


function RightRail() {
  return (
    <aside className="hidden space-y-5 lg:block">
      <div className="sticky top-24 space-y-5">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Trending now</h3>
            <TrendingUp className="h-4 w-4 text-tutor" />
          </div>
          <ul className="mt-3 space-y-3">
            {[
              { tag: "Calculus", posts: "1.2k posts", hot: true },
              { tag: "React 19", posts: "864 posts" },
              { tag: "IELTS Prep", posts: "512 posts" },
              { tag: "UX Research", posts: "310 posts" },
            ].map((t) => (
              <li key={t.tag} className="group flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium text-foreground">#{t.tag}</span>
                    {t.hot && (
                      <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.posts}</div>
                </div>
                <button className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground/70 opacity-0 transition hover:border-foreground/30 hover:text-foreground group-hover:opacity-100">
                  Follow
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-foreground">Suggested tutors</h3>
          <ul className="mt-3 space-y-3">
            {[
              { name: "Nadia Karim", subject: "Physics · IUT" },
              { name: "Tanvir Ahmed", subject: "Web Dev · 8y exp" },
              { name: "Meherun Nisa", subject: "English · IELTS 8.5" },
            ].map((u) => (
              <li key={u.name} className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tutor/15 text-sm font-semibold text-tutor ring-2 ring-tutor/20">
                  {u.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{u.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{u.subject}</div>
                </div>
                <button className="shrink-0 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background transition hover:opacity-90">
                  Follow
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-accent/60 p-5">
          <Award className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
            Earn your first badge
          </h3>
          <p className="mt-1 text-xs text-foreground/70">
            Post 3 helpful answers this week and unlock the Verified Helper badge.
          </p>
          <button className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-95">
            Get started <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="px-2 text-[11px] text-muted-foreground">
          © Learns Academy · About · Privacy · Terms · Help
        </p>
      </div>
    </aside>
  );
}

function MobileTabBar() {
  const items = [
    { icon: Home, label: "Home", active: true },
    { icon: Compass, label: "Explore" },
    { icon: Plus, label: "Post", primary: true },
    { icon: Bell, label: "Alerts" },
    { icon: Award, label: "You" },
  ];
  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl lg:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map(({ icon: Icon, label, active, primary }) => (
          <li key={label}>
            <button
              className={`grid place-items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[10px] font-medium ${
                primary
                  ? "bg-primary text-primary-foreground shadow-md"
                  : active
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {!primary && <span>{label}</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
