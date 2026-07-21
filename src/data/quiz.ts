export type Subject = {
  id: string;
  name: string;
  nameBn: string;
  emoji: string;
  color: string;
  questions: number;
};

export const subjects: Subject[] = [
  { id: "math", name: "Mathematics", nameBn: "গণিত", emoji: "📐", color: "from-indigo-500 to-purple-500", questions: 12400 },
  { id: "physics", name: "Physics", nameBn: "পদার্থবিজ্ঞান", emoji: "⚛️", color: "from-blue-500 to-cyan-500", questions: 9800 },
  { id: "chem", name: "Chemistry", nameBn: "রসায়ন", emoji: "🧪", color: "from-emerald-500 to-teal-500", questions: 8600 },
  { id: "bio", name: "Biology", nameBn: "জীববিজ্ঞান", emoji: "🧬", color: "from-rose-500 to-pink-500", questions: 7200 },
  { id: "english", name: "English", nameBn: "ইংরেজি", emoji: "🔤", color: "from-amber-500 to-orange-500", questions: 6500 },
  { id: "bangla", name: "Bangla", nameBn: "বাংলা", emoji: "📖", color: "from-fuchsia-500 to-pink-500", questions: 5400 },
  { id: "ict", name: "ICT", nameBn: "তথ্য প্রযুক্তি", emoji: "💻", color: "from-sky-500 to-indigo-500", questions: 3200 },
  { id: "gk", name: "General Knowledge", nameBn: "সাধারণ জ্ঞান", emoji: "🌍", color: "from-lime-500 to-emerald-500", questions: 4800 },
];

export type Question = {
  id: string;
  subject: string;
  topic: string;
  text: string;
  options: string[];
  answer: number; // index
  explanation: string;
  year?: string;
  board?: string;
  difficulty: "easy" | "medium" | "hard";
};

export const questions: Question[] = [
  {
    id: "q1",
    subject: "math",
    topic: "বীজগণিত",
    text: "যদি x + 1/x = 3 হয়, তবে x² + 1/x² এর মান কত?",
    options: ["7", "9", "11", "5"],
    answer: 0,
    explanation: "(x + 1/x)² = x² + 2 + 1/x² → 9 = x² + 1/x² + 2 → x² + 1/x² = 7",
    year: "2023",
    board: "ঢাকা",
    difficulty: "easy",
  },
  {
    id: "q2",
    subject: "physics",
    topic: "বলবিদ্যা",
    text: "একটি বস্তুর ভর 5 kg। এর উপর 10 N বল প্রয়োগ করলে ত্বরণ কত হবে?",
    options: ["0.5 m/s²", "2 m/s²", "5 m/s²", "50 m/s²"],
    answer: 1,
    explanation: "F = ma → a = F/m = 10/5 = 2 m/s²",
    year: "2022",
    board: "রাজশাহী",
    difficulty: "easy",
  },
  {
    id: "q3",
    subject: "chem",
    topic: "পর্যায় সারণি",
    text: "নিচের কোনটি নোবেল গ্যাস?",
    options: ["Cl", "Ar", "O", "N"],
    answer: 1,
    explanation: "Ar (আর্গন) একটি নোবেল গ্যাস। এটি অষ্টম গ্রুপের অন্তর্ভুক্ত।",
    year: "2024",
    board: "চট্টগ্রাম",
    difficulty: "easy",
  },
  {
    id: "q4",
    subject: "bio",
    topic: "কোষ বিভাজন",
    text: "মাইটোসিস কোষ বিভাজনে কয়টি অপত্য কোষ তৈরি হয়?",
    options: ["2", "4", "8", "1"],
    answer: 0,
    explanation: "মাইটোসিসে একটি মাতৃ কোষ থেকে দুটি অপত্য কোষ তৈরি হয়।",
    year: "2023",
    board: "সিলেট",
    difficulty: "easy",
  },
  {
    id: "q5",
    subject: "english",
    topic: "Grammar",
    text: "Choose the correct passive form: 'He writes a letter.'",
    options: [
      "A letter was written by him.",
      "A letter is written by him.",
      "A letter has been written by him.",
      "A letter is being written by him.",
    ],
    answer: 1,
    explanation: "Simple present active → 'is/are + past participle' passive form.",
    year: "2024",
    board: "ঢাকা",
    difficulty: "medium",
  },
  {
    id: "q6",
    subject: "bangla",
    topic: "ব্যাকরণ",
    text: "'চন্দ্র' শব্দের সমার্থক শব্দ কোনটি?",
    options: ["রবি", "শশী", "ভানু", "দিবাকর"],
    answer: 1,
    explanation: "শশী অর্থ চাঁদ। রবি, ভানু, দিবাকর সবই সূর্যের সমার্থক।",
    year: "2022",
    board: "বরিশাল",
    difficulty: "easy",
  },
  {
    id: "q7",
    subject: "ict",
    topic: "নেটওয়ার্কিং",
    text: "HTTP এর পূর্ণরূপ কী?",
    options: [
      "HyperText Transfer Protocol",
      "HyperText Transmission Protocol",
      "HighText Transfer Protocol",
      "HyperTool Transfer Protocol",
    ],
    answer: 0,
    explanation: "HTTP = HyperText Transfer Protocol — ওয়েব যোগাযোগের একটি প্রোটোকল।",
    year: "2023",
    board: "ঢাকা",
    difficulty: "easy",
  },
  {
    id: "q8",
    subject: "gk",
    topic: "বাংলাদেশ",
    text: "বাংলাদেশের জাতীয় ফুল কোনটি?",
    options: ["গোলাপ", "শাপলা", "পদ্ম", "গাঁদা"],
    answer: 1,
    explanation: "শাপলা বাংলাদেশের জাতীয় ফুল।",
    year: "2024",
    board: "সকল",
    difficulty: "easy",
  },
  {
    id: "q9",
    subject: "math",
    topic: "ত্রিকোণমিতি",
    text: "sin 30° + cos 60° এর মান কত?",
    options: ["0", "1", "1/2", "√3/2"],
    answer: 1,
    explanation: "sin 30° = 1/2, cos 60° = 1/2 → 1/2 + 1/2 = 1",
    year: "2023",
    board: "যশোর",
    difficulty: "medium",
  },
  {
    id: "q10",
    subject: "physics",
    topic: "আলোকবিজ্ঞান",
    text: "শূন্যস্থানে আলোর বেগ কত?",
    options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"],
    answer: 0,
    explanation: "শূন্যস্থানে আলোর বেগ প্রায় 3×10⁸ মিটার/সেকেন্ড।",
    year: "2024",
    board: "কুমিল্লা",
    difficulty: "medium",
  },
];

export type LeaderboardEntry = {
  rank: number;
  name: string;
  institute: string;
  xp: number;
  streak: number;
  avatar: string;
};

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "সাদিয়া রহমান", institute: "নটরডেম কলেজ", xp: 12480, streak: 62, avatar: "🥇" },
  { rank: 2, name: "রায়হান হোসেন", institute: "ঢাকা কলেজ", xp: 11930, streak: 48, avatar: "🥈" },
  { rank: 3, name: "তানভীর আহমেদ", institute: "রাজউক উত্তরা", xp: 11240, streak: 55, avatar: "🥉" },
  { rank: 4, name: "নাফিসা ইসলাম", institute: "ভিকারুননিসা", xp: 10820, streak: 41, avatar: "🎓" },
  { rank: 5, name: "ইমরান খান", institute: "হলিক্রস কলেজ", xp: 10450, streak: 39, avatar: "🎓" },
  { rank: 6, name: "মৌসুমী সুলতানা", institute: "উইলস লিটল ফ্লাওয়ার", xp: 9980, streak: 34, avatar: "🎓" },
  { rank: 7, name: "আরিফ চৌধুরী", institute: "সেন্ট জোসেফ", xp: 9540, streak: 30, avatar: "🎓" },
  { rank: 8, name: "তামান্না বেগম", institute: "আইডিয়াল স্কুল", xp: 9210, streak: 28, avatar: "🎓" },
  { rank: 9, name: "সাইফ উদ্দিন", institute: "মিরপুর ক্যান্ট.", xp: 8890, streak: 26, avatar: "🎓" },
  { rank: 10, name: "রুবাইয়া হক", institute: "মতিঝিল আইডিয়াল", xp: 8620, streak: 24, avatar: "🎓" },
];

export const badges = [
  { id: "streak7", name: "৭ দিন স্ট্রিক", emoji: "🔥", desc: "টানা ৭ দিন কুইজ" },
  { id: "streak30", name: "৩০ দিন স্ট্রিক", emoji: "⚡", desc: "টানা ৩০ দিন কুইজ" },
  { id: "correct50", name: "৫০ সঠিক", emoji: "🎯", desc: "৫০টি সঠিক উত্তর" },
  { id: "mock10", name: "১০ মক টেস্ট", emoji: "🏆", desc: "১০টি মক টেস্ট" },
  { id: "topper", name: "টপার", emoji: "👑", desc: "টপ ১০ এ প্রবেশ" },
  { id: "scholar", name: "স্কলার", emoji: "📚", desc: "৫০০ প্রশ্ন সমাধান" },
];
