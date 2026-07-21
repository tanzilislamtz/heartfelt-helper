import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { MobileNav } from "@/components/MobileNav";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Learns Academy" },
      { name: "description", content: "Your Learns Academy profile, activity, achievements and settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar variant="app" onMenu={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="pb-28">
        <div className="mx-auto max-w-2xl px-5 pt-10">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          <h1 className="h2">Profile</h1>
          <p className="mt-2 body text-muted-foreground">
            Your profile hub — activity, saved posts, achievements and settings will live here.
          </p>
        </div>
      </main>
    </div>
  );
}

