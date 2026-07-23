import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  Filter,
  Sparkles,
  ArrowUpRight,
  Send,
  ThumbsUp,
} from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { MobileNav } from "@/components/MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getPostById, getRelatedPosts, seedComments, type PostData } from "@/lib/posts";
import { hasWelcomed, isAuthed } from "@/lib/session";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/post/$postId")({
  loader: ({ params }) => {
    const post = getPostById(params.postId);
    if (!post) throw notFound();
    return { post };
  },
  component: PostDetail,
  notFoundComponent: () => (
    <div className="grid min-h-[60dvh] place-items-center text-center">
      <div>
        <p className="text-sm text-muted-foreground">Post not found.</p>
        <Link to="/" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
          Back to feed
        </Link>
      </div>
    </div>
  ),
});

type CommentFilter = "top" | "newest" | "oldest";

const kindMeta: Record<string, { label: string; chip: string; ribbon: string }> = {
  learning: { label: "Article", chip: "bg-primary/10 text-primary", ribbon: "from-primary/25 via-primary/10 to-transparent" },
  question: { label: "Question", chip: "bg-primary/10 text-primary", ribbon: "from-primary/20 via-primary/5 to-transparent" },
  "seeking-tutor": { label: "Seeking Tutor", chip: "bg-cyan-500/15 text-cyan-800", ribbon: "from-cyan-300/40 via-cyan-100/50 to-transparent" },
  "offering-tutor": { label: "Available Tutor", chip: "bg-emerald-500/20 text-emerald-900", ribbon: "from-emerald-300/40 via-emerald-100/50 to-transparent" },
  "seeking-student": { label: "Admission Open", chip: "bg-fuchsia-500/20 text-fuchsia-900", ribbon: "from-fuchsia-300/40 via-fuchsia-100/50 to-transparent" },
};

function PostDetail() {
  const { post } = Route.useLoaderData();
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
          Opening post…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="mx-auto max-w-3xl px-4 py-6 lg:px-6">
        <button
          onClick={() => navigate({ to: "/" })}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground/75 shadow-sm transition hover:bg-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to feed
        </button>

        <FullPost post={post} />

        <CommentsSection postId={post.id} baseCount={post.stats.comments} />

        <RelatedLoop currentId={post.id} />
      </main>
    </div>
  );
}

function FullPost({ post }: { post: PostData }) {
  const km = kindMeta[post.kind];
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.stats.likes);
  const [saved, setSaved] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_20px_50px_-30px_rgba(41,44,117,0.35)]"
    >
      <div className={`h-24 w-full bg-gradient-to-br ${km.ribbon}`} />
      <div className="-mt-14 px-5 pb-6 sm:px-8">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${km.chip}`}>
            {km.label}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">#{post.tag}</span>
        </div>

        <header className="mt-3 flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md ring-4 ring-surface">
            {post.author.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-foreground">{post.author}</span>
              {post.verified && <CheckCircle2 className="h-4 w-4 text-tutor" />}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {post.handle} · {post.time}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => toast.success("Marked as interested")}>Interested</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.success("We'll show fewer like this")}>Not interested</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
                Copy link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <h1 className="mt-5 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">{post.title}</h1>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-foreground/85">{post.body}</p>

        {post.meta && (
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {post.meta.map((m) => (
              <div key={m.label} className="rounded-xl border border-border bg-muted/40 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{m.label}</div>
                <div className="mt-0.5 truncate text-sm font-semibold text-foreground">{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {post.mediaUrl && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-muted">
            <img src={post.mediaUrl} alt={post.title} className="aspect-[16/10] w-full object-cover" />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/70">#{t}</span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setLiked((v) => !v); setLikes((n) => n + (liked ? -1 : 1)); }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${liked ? "bg-destructive/10 text-destructive" : "text-foreground/70 hover:bg-muted"}`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likes}
            </motion.button>
            <a href="#comments" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:bg-muted">
              <MessageCircle className="h-4 w-4" /> {post.stats.comments}
            </a>
            <button onClick={() => toast.success("Shared")} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:bg-muted">
              <Share2 className="h-4 w-4" /> {post.stats.shares}
            </button>
          </div>
          <button
            onClick={() => { setSaved((v) => !v); toast.success(saved ? "Removed from saved" : "Saved"); }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${saved ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted"}`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} /> {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

type UIComment = { id: number; author: string; role: string; text: string; time: string; likes: number; ts: number };

function CommentsSection({ postId, baseCount }: { postId: string; baseCount: number }) {
  const initial: UIComment[] = useMemo(
    () =>
      (seedComments[postId] ?? []).map((c, i) => ({
        ...c,
        ts: Date.now() - (i + 1) * 60_000 * 5,
      })),
    [postId],
  );
  const [comments, setComments] = useState<UIComment[]>(initial);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<CommentFilter>("top");
  const [likedIds, setLikedIds] = useState<Record<number, boolean>>({});

  const sorted = useMemo(() => {
    const arr = [...comments];
    if (filter === "top") arr.sort((a, b) => b.likes - a.likes);
    else if (filter === "newest") arr.sort((a, b) => b.ts - a.ts);
    else arr.sort((a, b) => a.ts - b.ts);
    return arr;
  }, [comments, filter]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setComments((c) => [
      { id: Date.now(), author: "You", role: "student", text, time: "now", likes: 0, ts: Date.now() },
      ...c,
    ]);
    setDraft("");
    toast.success("Comment posted");
  };

  const toggleLike = (id: number) => {
    setLikedIds((m) => ({ ...m, [id]: !m[id] }));
    setComments((cs) => cs.map((c) => (c.id === id ? { ...c, likes: c.likes + (likedIds[id] ? -1 : 1) } : c)));
  };

  const total = baseCount + comments.length - initial.length;

  return (
    <section id="comments" className="mt-6 rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <MessageCircle className="h-5 w-5 text-primary" />
          Comments <span className="text-sm font-medium text-muted-foreground">· {total}</span>
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/75 hover:bg-muted">
              <Filter className="h-3.5 w-3.5" />
              {filter === "top" ? "Top" : filter === "newest" ? "Newest" : "Oldest"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={() => setFilter("top")}>Top comments</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("newest")}>Newest first</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("oldest")}>Oldest first</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          A
        </div>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a comment…"
          className="h-10 min-w-0 flex-1 rounded-full border border-transparent bg-muted/60 px-4 text-sm outline-none focus:border-primary/30 focus:bg-surface focus:ring-4 focus:ring-primary/10"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" /> Post
        </button>
      </form>

      <ul className="mt-5 space-y-3">
        <AnimatePresence initial={false}>
          {sorted.map((c) => (
            <motion.li
              key={c.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex gap-3"
            >
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-primary-foreground ${c.role === "tutor" ? "bg-tutor text-tutor-foreground" : "bg-primary"}`}>
                {c.author.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="rounded-2xl bg-muted/60 px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-foreground">{c.author}</span>
                    {c.role === "tutor" && (
                      <span className="rounded-full bg-tutor/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-tutor">
                        Tutor
                      </span>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{c.text}</p>
                </div>
                <div className="mt-1 flex items-center gap-3 pl-2 text-[11px] font-medium text-muted-foreground">
                  <span>{c.time}</span>
                  <button
                    onClick={() => toggleLike(c.id)}
                    className={`inline-flex items-center gap-1 transition ${likedIds[c.id] ? "text-primary" : "hover:text-foreground"}`}
                  >
                    <ThumbsUp className={`h-3 w-3 ${likedIds[c.id] ? "fill-current" : ""}`} /> {c.likes}
                  </button>
                  <button className="hover:text-foreground">Reply</button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

function RelatedLoop({ currentId }: { currentId: string }) {
  const related = useMemo(() => getRelatedPosts(currentId, 4), [currentId]);
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Related posts
        </h2>
        <Link to="/" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline">
          Browse feed <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((p, i) => (
          <RelatedCard key={`${p.id}-${i}`} post={p} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ post }: { post: PostData }) {
  const km = kindMeta[post.kind];
  return (
    <Link
      to="/post/$postId"
      params={{ postId: post.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${km.chip}`}>
          {km.label}
        </span>
        <span className="truncate text-[10px] text-muted-foreground">#{post.tag}</span>
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary">{post.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.body}</p>
      <div className="mt-3 flex items-center gap-2">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[10px] font-bold text-foreground">
          {post.author.charAt(0)}
        </div>
        <span className="truncate text-[11px] font-medium text-foreground/75">{post.author}</span>
        <span className="ml-auto inline-flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5"><Heart className="h-3 w-3" /> {post.stats.likes}</span>
          <span className="inline-flex items-center gap-0.5"><MessageCircle className="h-3 w-3" /> {post.stats.comments}</span>
        </span>
      </div>
    </Link>
  );
}
