import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Bot, Send, Sparkles, User } from "lucide-react";

export const Route = createFileRoute("/quiz/ai-solver")({
  component: AISolver,
});

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "ফোটোসিনথেসিসের বিক্রিয়া লেখো",
  "নিউটনের ৩য় সূত্র ব্যাখ্যা করো",
  "Passive voice এর নিয়ম কি?",
  "log 100 এর মান কত?",
];

function AISolver() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "হাই! আমি তোমার AI টিউটর। যেকোন প্রশ্ন করো — বই ও ব্যাচ অনুযায়ী ব্যাখ্যা দিব।" },
  ]);
  const [loading, setLoading] = useState(false);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: `"${text}" — এই প্রশ্নটির ধাপে ধাপে সমাধান:\n\n১. প্রথমে মূল ধারণাটি বুঝে নাও।\n২. সংশ্লিষ্ট সূত্র/নিয়ম প্রয়োগ করো।\n৩. উদাহরণসহ অনুশীলন করো।\n\nআরও বিস্তারিত জানতে চাইলে বলো!`,
        },
      ]);
      setLoading(false);
    }, 900);
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-background to-background pb-28 font-bangla dark:from-sky-950/20">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-xl font-black">
              <Bot className="h-5 w-5 text-sky-600" /> AI সলভার
            </h1>
            <p className="text-xs text-muted-foreground">যেকোন প্রশ্নের ব্যাখ্যা AI থেকে</p>
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pb-4">
          <AnimatePresence initial={false}>
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white"
                      : "border border-border/60 bg-card"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
                <div className="rounded-2xl border border-border/60 bg-card px-3.5 py-2.5 text-sm text-muted-foreground">
                  ভাবছি<span className="animate-pulse">...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {msgs.length <= 1 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium hover:border-sky-500 hover:text-sky-600"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="sticky bottom-24 flex items-center gap-2 rounded-2xl border border-border/60 bg-card p-2 shadow-lg"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="তোমার প্রশ্ন লেখো..."
            className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
