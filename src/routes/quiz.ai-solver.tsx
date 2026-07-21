import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";

export const Route = createFileRoute("/quiz/ai-solver")({
  component: AISolver,
});

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Explain Newton's third law",
  "How does photosynthesis work?",
  "Rules for passive voice",
  "What is log 100?",
];

function AISolver() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi. Ask me anything — I'll walk you through it, step by step." },
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
          text: `Here's how I'd think about "${text}":\n\n1. Start with the core idea.\n2. Apply the relevant rule or formula.\n3. Try a small example to make it stick.\n\nWant me to go deeper on any step?`,
        },
      ]);
      setLoading(false);
    }, 900);
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pb-28 text-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="grid h-10 w-10 place-items-center rounded-full border border-border">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">AI solver</h1>
            <p className="text-sm text-muted-foreground">Explanations, not just answers.</p>
          </div>
        </div>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto pb-4">
          <AnimatePresence initial={false}>
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-foreground text-background"
                      : "border border-border bg-card"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
                <div className="rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                  Thinking<span className="animate-pulse">...</span>
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
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="sticky bottom-24 flex items-center gap-2 rounded-full border border-border bg-card p-1.5"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question"
            className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background transition disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
