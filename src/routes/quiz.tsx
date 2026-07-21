import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Learns Academy" },
      { name: "description", content: "মক টেস্ট, প্রশ্ন ব্যাংক, AI সলভার, লিডারবোর্ড — একসাথে সব প্রস্তুতি Learns Academy তে।" },
      { property: "og:title", content: "Quiz — Learns Academy" },
      { property: "og:description", content: "চর্চা করো নিজের গতিতে — বাংলা মিডিয়ামের জন্য সম্পূর্ণ কুইজ প্ল্যাটফর্ম।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Outlet />,
});
