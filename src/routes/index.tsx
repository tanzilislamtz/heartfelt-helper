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
  FileText,
  Flame,
  MessageSquare,
  UserSearch,
  BookOpenCheck,
  UserCheck,
  Trophy,
  ChevronRight,
  ShieldCheck,
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
      <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
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
    { icon: FileText, label: "Quiz" },
    { icon: Flame, label: "Popular" },
    { icon: MessageSquare, label: "Q&A" },
    { icon: UserSearch, label: "Looking for Tutor" },
    { icon: BookOpenCheck, label: "Looking for Student" },
    { icon: UserCheck, label: "Available Tutor" },
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

      </nav>
    </aside>
  );
}

function Feed() {
  return (
    <section className="space-y-5">
      <Composer />
      <FeedToolbar />
      <Leaderboard />

      <Post
        author="SOJIB KHAN"
        role="student"
        handle="Verified Student"
        time="10 days ago"
        verified
        title="A Conversation Between Lily and Her Father"
        body={"Lily: Hello, Baba!\nBaba: Lily? How are you?\nLily: Fine, Baba. I just got my exam result. I've got an A in my English test!\nBaba: That's wonderful, my dear. I'm so proud of you."}
        tag="Learning Content"
        stats={{ likes: 214, comments: 36, shares: 11 }}
      />

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

function Leaderboard() {
  const entries = [
    { rank: 1, name: "Md. Rajwanur R.", sub: "University of Dhaka", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop", following: false },
    { rank: 2, name: "Papul Halder", sub: "Chittagong College", img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&auto=format&fit=crop", following: false },
    { rank: 3, name: "Sojib Khan", sub: "Rajshahi University", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop", following: false },
    { rank: 4, name: "Sabuj Hossain", sub: "Notre Dame College", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop", following: false },
    { rank: 5, name: "Protiq Halder", sub: "Khulna Model School", img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format&fit=crop", following: true },
  ];
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/40 text-primary">
            <Trophy className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">
            Leaderboard <span className="text-muted-foreground">· top by points</span>
          </h3>
        </div>
        <button className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline">
          See all <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {entries.map((e) => (
          <motion.div
            key={e.rank}
            whileHover={{ y: -3 }}
            className="relative w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={e.img} alt={e.name} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute left-2 top-2 rounded-lg bg-background/95 px-1.5 py-0.5 text-[10px] font-bold text-primary shadow-sm">
                #{e.rank}
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent p-2">
                <p className="truncate text-xs font-semibold text-background">{e.name}</p>
                <p className="truncate text-[10px] text-background/80">{e.sub}</p>
              </div>
            </div>
            <div className="p-2">
              <button
                className={`w-full rounded-full py-1.5 text-[11px] font-semibold transition ${
                  e.following
                    ? "bg-foreground text-background"
                    : "bg-primary text-primary-foreground hover:opacity-95"
                }`}
              >
                {e.following ? "Following" : "Follow"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/75">{body}</p>
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
  const [msgTab, setMsgTab] = useState<"active" | "all">("active");
  return (
    <aside className="hidden space-y-5 lg:block">
      <div className="sticky top-24 space-y-5">
        {/* Sponsored */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Sponsored</h3>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ad
            </span>
          </div>
          <a
            href="#"
            className="group block overflow-hidden rounded-xl border border-border bg-muted"
          >
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop"
              alt="Exotic Collection — Unstitched Fabrics"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover transition group-hover:scale-[1.02]"
            />
          </a>
          <div className="mt-3">
            <p className="text-sm font-semibold text-foreground">Exotic Collection</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Unstitched fabrics · New arrivals for Eid
            </p>
          </div>
        </div>

        {/* Message List */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Message List</h3>
            <button className="text-xs font-medium text-primary hover:underline">See all</button>
          </div>
          <div className="mb-3 grid grid-cols-2 rounded-full bg-muted p-1 text-xs font-semibold">
            <button
              onClick={() => setMsgTab("active")}
              className={`rounded-full py-1.5 transition ${
                msgTab === "active" ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setMsgTab("all")}
              className={`rounded-full py-1.5 transition ${
                msgTab === "all" ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              All <span className="opacity-70">(3)</span>
            </button>
          </div>

          {msgTab === "active" ? (
            <div className="rounded-xl border border-dashed border-border py-6 text-center">
              <p className="text-xs text-muted-foreground">
                No one is online right now.{" "}
                <button className="font-semibold text-primary hover:underline">Show all</button>
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {[
                { name: "Nadia Karim", msg: "Sent the notes ✓", time: "2m", unread: 2 },
                { name: "Tanvir Ahmed", msg: "See you at 8pm class", time: "1h", unread: 0 },
                { name: "Meherun Nisa", msg: "Thanks for the feedback!", time: "3h", unread: 0 },
              ].map((m) => (
                <li key={m.name} className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{m.name}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{m.time}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{m.msg}</p>
                  </div>
                  {m.unread > 0 && (
                    <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                      {m.unread}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
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
