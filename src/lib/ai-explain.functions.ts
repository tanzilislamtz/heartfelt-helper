import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctIndex: z.number().int().min(0),
  userIndex: z.number().int(),
  subject: z.string().optional(),
});

export const explainAnswer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { explanation: "AI explanation is unavailable right now. Please review your notes for this topic." };
    }

    const correct = data.options[data.correctIndex] ?? "";
    const chosen = data.options[data.userIndex] ?? "";

    const prompt = `You are a friendly SSC-level tutor. A student answered a multiple-choice question incorrectly.
Explain in 3-5 short sentences: (1) why the student's choice is wrong, (2) why the correct answer is right, (3) a small tip to remember it. Use simple English. Do not use markdown headings.

Subject: ${data.subject ?? "general"}
Question: ${data.question}
Options: ${data.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join(" | ")}
Student's answer: ${chosen}
Correct answer: ${correct}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Lovable-API-Key": key,
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a concise, encouraging tutor." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        return { explanation: `Explanation unavailable (status ${res.status}). The correct answer is ${correct}.` };
      }
      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = json.choices?.[0]?.message?.content?.trim();
      return { explanation: text || `The correct answer is ${correct}.` };
    } catch {
      return { explanation: `The correct answer is ${correct}. (AI service temporarily unavailable.)` };
    }
  });
