// UI-only mock store for "Message requests" (unknown senders).
// Rule shown in the UI: a requester can send max 3 messages before you accept.

export type RequestMessage = { id: string; from: "me" | "them"; text: string; at: number };

export type MessageRequest = {
  id: string;
  name: string;
  role: "tutor" | "student" | "parent";
  meta: string;
  initials: string;
  avatarColor: string;
  mutual?: string;
  messages: RequestMessage[];
};

const now = Date.now();
const m = (n: number) => now - n * 60 * 1000;

export const MAX_REQUEST_MESSAGES = 3;

export const messageRequests: MessageRequest[] = [
  {
    id: "req-sadia",
    name: "Sadia Islam",
    role: "student",
    meta: "Class 9 · Dhaka",
    initials: "SI",
    avatarColor: "linear-gradient(135deg,#ec4899,#f97316)",
    mutual: "2 mutual connections",
    messages: [
      { id: "1", from: "them", text: "আসসালামু আলাইকুম আপু, আপনি কি Physics পড়ান?", at: m(24) },
      { id: "2", from: "them", text: "Class 9-এর জন্য weekly 3 দিন লাগবে।", at: m(22) },
    ],
  },
  {
    id: "req-tanvir",
    name: "Tanvir Hasan",
    role: "tutor",
    meta: "HSC · ICT tutor",
    initials: "TH",
    avatarColor: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    messages: [
      { id: "1", from: "them", text: "Hi! আপনার post দেখে message দিলাম।", at: m(180) },
      { id: "2", from: "them", text: "আমি ICT-তে 3 বছর পড়াচ্ছি।", at: m(178) },
      { id: "3", from: "them", text: "Demo class নিতে চাইলে জানাবেন।", at: m(176) },
    ],
  },
  {
    id: "req-parent-rumi",
    name: "Rumi Akter (Parent)",
    role: "parent",
    meta: "Guardian of Nabila",
    initials: "RA",
    avatarColor: "linear-gradient(135deg,#7c3aed,#ec4899)",
    mutual: "1 mutual connection",
    messages: [
      { id: "1", from: "them", text: "আমার মেয়ের জন্য Math tutor খুঁজছি।", at: m(600) },
    ],
  },
];

export function getRequest(id: string) {
  return messageRequests.find((r) => r.id === id);
}

export function timeAgo(at: number) {
  const diff = Math.max(1, Math.round((Date.now() - at) / 60000));
  if (diff < 60) return `${diff}m`;
  if (diff < 1440) return `${Math.round(diff / 60)}h`;
  return `${Math.round(diff / 1440)}d`;
}
