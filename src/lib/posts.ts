export type Role = "tutor" | "student" | "guest";
export type Kind = "learning" | "question" | "seeking-tutor" | "offering-tutor" | "seeking-student";

export type PostData = {
  id: string;
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
  kind: Kind;
  meta?: { label: string; value: string }[];
};

export const posts: PostData[] = [
  {
    id: "lily-baba-convo",
    author: "SOJIB KHAN",
    role: "student",
    handle: "Verified Student",
    time: "10 days ago",
    verified: true,
    kind: "learning",
    title: "A Conversation Between Lily and Her Father",
    body: "Lily: Hello, Baba!\nBaba: Lily? How are you?\nLily: Fine, Baba. I just got my exam result. I've got an A in my English test!\nBaba: That's wonderful, my dear. I'm so proud of you.\n\nLily: Thank you, Baba. I studied hard for it. The reading section was tricky, but I managed to answer everything.\nBaba: Hard work always pays off. Keep going, and never lose that curiosity of yours.",
    tag: "Learning Content",
    stats: { likes: 214, comments: 36, shares: 11 },
  },
  {
    id: "light-bend-water",
    author: "Tania Rahman",
    role: "student",
    handle: "@tania.q",
    time: "1h · Public",
    kind: "question",
    title: "Why does light bend when it enters water from air?",
    body: "Physics class 10 এ পড়াচ্ছে refraction, কিন্তু bending এর reason টা mathematically ঠিকমতো বুঝছি না। কেউ কি Snell's law টা সহজ ভাষায় explain করতে পারবেন?\n\nBook এ শুধু formula দেওয়া — n1 sinθ1 = n2 sinθ2 — কিন্তু কেন এটা হয়, physically কি ঘটছে জানতে চাই।",
    tag: "Physics · Refraction",
    tags: ["Class 10", "Optics"],
    stats: { likes: 87, comments: 24, shares: 5 },
  },
  {
    id: "alia-free-math",
    author: "Alia Bhatt",
    role: "tutor",
    handle: "@alia.tutors",
    time: "2h · Public",
    verified: true,
    kind: "offering-tutor",
    title: "Free doubt-solving session tonight — Class 9 & 10 Math",
    body: "আজ রাত ৯টায় ফ্রি ডাউট সলভিং সেশন। Algebra, Geometry, Trigonometry — যেকোনো প্রশ্ন নিয়ে আসুন। জুম লিঙ্ক কমেন্টে দেওয়া হবে।\n\n45 মিনিটের সেশন, শেষে ৫ মিনিট ১:১ সময় থাকবে যাদের personal doubt আছে।",
    tag: "Class 9-10 Math",
    meta: [
      { label: "Subject", value: "Mathematics" },
      { label: "Class", value: "9 – 10" },
      { label: "Mode", value: "Online · Zoom" },
      { label: "Fee", value: "Free tonight" },
    ],
    stats: { likes: 328, comments: 42, shares: 18 },
  },
  {
    id: "imran-chem-tutor",
    author: "Imran Hossain",
    role: "student",
    handle: "@imran.hsc",
    time: "3h · Public",
    kind: "seeking-tutor",
    title: "Need a Chemistry tutor for HSC — Dhanmondi area",
    body: "HSC 2nd year, Chemistry 2nd paper তে দুর্বলতা আছে। সপ্তাহে ৩ দিন, বিকেল ৫টার পর হলে ভালো হয়। Home tuition or nearby coaching দুটোই চলবে।\n\nEnglish medium background, তাই Bangla বা English দুই মাধ্যমেই comfortable।",
    tag: "HSC · Chemistry",
    tags: ["Dhanmondi", "Home Tuition"],
    meta: [
      { label: "Subject", value: "Chemistry" },
      { label: "Level", value: "HSC 2nd Yr" },
      { label: "Location", value: "Dhanmondi" },
      { label: "Budget", value: "৳4–6k/mo" },
    ],
    stats: { likes: 96, comments: 31, shares: 7 },
  },
  {
    id: "nabila-butterfly",
    author: "Nabila Chowdhury",
    role: "student",
    handle: "@nabila.bio",
    time: "4h · Public",
    kind: "learning",
    title: "Butterfly on marigold — captured for my Biology assignment",
    body: "Field notes for chapter 7 (Pollination). Any tips on identifying this species? Guessing it's a Plain Tiger.",
    tag: "Biology · Class 10",
    stats: { likes: 512, comments: 88, shares: 24 },
    mediaUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&auto=format&fit=crop",
  },
  {
    id: "rafi-weekend-batch",
    author: "Rafi Islam",
    role: "tutor",
    handle: "@rafi.stem",
    time: "6h · Public",
    kind: "seeking-student",
    title: "Weekend group class — 3 seats left",
    body: "ছুটির দিনে অনলাইন গ্রুপ ব্যাচ শুরু করছি। ছোট ব্যাচ (৫ জনের মধ্যে), interactive সেশন। আগ্রহী হলে DM করুন।\n\nSyllabus: Class 9-10 Science group, mock test প্রতি মাসে ২টা।",
    tag: "Weekend Batch",
    tags: ["Math", "Physics", "Chemistry"],
    meta: [
      { label: "Batch", value: "Weekend AM" },
      { label: "Seats", value: "3 left" },
      { label: "Duration", value: "45 min × 6" },
      { label: "Fee", value: "৳2,500/mo" },
    ],
    stats: { likes: 176, comments: 51, shares: 9 },
  },
  {
    id: "rayhan-setup",
    author: "Rayhan Chowdhury",
    role: "student",
    handle: "@rayhan.reads",
    time: "Yesterday · Public",
    kind: "learning",
    title: "Study setup for finals week",
    body: "একটা আপেল, কয়েকটা বই — ব্যস, এটাই এই সপ্তাহের রুটিন। Board exam ঠিক ১২ দিন দূরে।",
    tag: "Motivation",
    stats: { likes: 421, comments: 66, shares: 12 },
    mediaUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop",
  },
];

export function getPostById(id: string): PostData | undefined {
  return posts.find((p) => p.id === id);
}

// Related = same kind first, then same tag, exclude self. Loops back to top if fewer than n.
export function getRelatedPosts(id: string, n = 4): PostData[] {
  const src = getPostById(id);
  if (!src) return posts.slice(0, n);
  const others = posts.filter((p) => p.id !== id);
  const sameKind = others.filter((p) => p.kind === src.kind);
  const sameTag = others.filter((p) => p.kind !== src.kind && (p.tag === src.tag || p.tags?.some((t) => src.tags?.includes(t))));
  const rest = others.filter((p) => !sameKind.includes(p) && !sameTag.includes(p));
  const combined = [...sameKind, ...sameTag, ...rest];
  // Loop content — if fewer than n, repeat
  const result: PostData[] = [];
  let i = 0;
  while (result.length < n && combined.length > 0) {
    result.push(combined[i % combined.length]);
    i++;
    if (i > combined.length * 3) break;
  }
  return result;
}

// Seed comments per post so the detail page feels populated
export const seedComments: Record<string, { id: number; author: string; role: Role; text: string; time: string; likes: number }[]> = {
  "light-bend-water": [
    { id: 1, author: "Dr. Kamal", role: "tutor", text: "সহজ ভাষায়: আলো air আর water এ different speed এ চলে। যখন medium change হয়, speed বদলায়, আর সেই কারণে direction ও বেঁকে যায় — ঠিক যেমন গাড়ির এক চাকা কাদায় পড়লে গাড়ি ঘুরে যায়।", time: "45m", likes: 34 },
    { id: 2, author: "Sami Ahmed", role: "student", text: "Snell's law এর derivation Feynman's path integral দিয়ে দেখলে সবচেয়ে সুন্দর লাগে — light সবসময় shortest time এর path নেয়।", time: "30m", likes: 12 },
    { id: 3, author: "Tania Rahman", role: "student", text: "ধন্যবাদ! গাড়ির analogy টা perfect বুঝেছি এখন।", time: "20m", likes: 5 },
    { id: 4, author: "Nusrat", role: "student", text: "আমারও same doubt ছিল, thanks for asking 🙌", time: "10m", likes: 3 },
  ],
  "alia-free-math": [
    { id: 1, author: "Rakib Hasan", role: "student", text: "Zoom link টা কখন পাবো?", time: "1h", likes: 8 },
    { id: 2, author: "Alia Bhatt", role: "tutor", text: "৮:৫০ এ pinned comment এ দিয়ে দেব। ততক্ষণ chapter revise করে রেখো!", time: "55m", likes: 22 },
    { id: 3, author: "Munia", role: "student", text: "Trigonometry এর identity গুলা কি cover হবে?", time: "40m", likes: 4 },
  ],
  "lily-baba-convo": [
    { id: 1, author: "Miss Rehana", role: "tutor", text: "Beautifully written. Vocabulary চর্চার জন্য এই ধরনের dialog খুব কার্যকর।", time: "5d", likes: 41 },
    { id: 2, author: "Rifat", role: "student", text: "আমার class এ এটা ব্যবহার করতে পারি? Credit দিয়ে দেব।", time: "3d", likes: 9 },
  ],
};
