import { AnimatePresence, motion } from "framer-motion";
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  Volume2,
  UserPlus,
  MessageSquare,
  Maximize2,
  SwitchCamera,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type CallKind = "audio" | "video";

type Props = {
  open: boolean;
  kind: CallKind;
  name: string;
  initials: string;
  avatarColor: string;
  onClose: () => void;
};

type Phase = "ringing" | "connected" | "ended";

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function CallOverlay({ open, kind, name, initials, avatarColor, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("ringing");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!open) return;
    setPhase("ringing");
    setSeconds(0);
    setMuted(false);
    setCamOff(false);
    // Demo: auto "answer" after a few rings.
    const t = window.setTimeout(() => setPhase("connected"), 4200);
    timers.current.push(t);
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [open, kind]);

  useEffect(() => {
    if (phase !== "connected") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const end = () => {
    setPhase("ended");
    const t = window.setTimeout(onClose, 1100);
    timers.current.push(t);
  };

  const status =
    phase === "ringing"
      ? kind === "video"
        ? "Ringing… video call"
        : "Ringing…"
      : phase === "connected"
        ? fmt(seconds)
        : "Call ended";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-primary/95 backdrop-blur-xl"
        >
          {/* video "feed" backdrop */}
          {kind === "video" && !camOff && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute inset-0"
                style={{ background: `radial-gradient(70% 60% at 50% 35%, ${avatarColor}, transparent 70%)` }}
              />
            </div>
          )}

          <motion.div
            initial={{ scale: 0.94, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative flex h-full w-full max-w-md flex-col items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[calc(env(safe-area-inset-top)+40px)] text-primary-foreground sm:h-[640px] sm:rounded-[2rem] sm:border sm:border-white/15 sm:pb-8 sm:pt-10 sm:shadow-2xl"
          >
            {/* top */}
            <div className="flex w-full items-center justify-between text-[11px] uppercase tracking-[0.18em] opacity-70">
              <span>{kind === "video" ? "Video call" : "Voice call"}</span>
              <span>Learns Academy</span>
            </div>

            {/* identity */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {phase === "ringing" && (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full border border-white/40"
                      animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full border border-white/30"
                      animate={{ scale: [1, 2.1], opacity: [0.5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                    />
                  </>
                )}
                <div
                  className="grid h-28 w-28 place-items-center rounded-full text-3xl font-bold text-white shadow-xl ring-4 ring-white/15"
                  style={{ background: avatarColor }}
                >
                  {initials}
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">{name}</p>
                <motion.p
                  key={status}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm tabular-nums opacity-80"
                >
                  {status}
                </motion.p>
              </div>

              {phase === "connected" && (
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Connected · demo call
                </div>
              )}
            </div>

            {/* self preview for video */}
            {kind === "video" && (
              <motion.div
                drag
                dragMomentum={false}
                className="absolute right-5 top-24 h-32 w-24 cursor-grab overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur active:cursor-grabbing"
              >
                <div className="grid h-full place-items-center text-[11px] opacity-80">
                  {camOff ? <VideoOff className="h-5 w-5" /> : "You"}
                </div>
              </motion.div>
            )}

            {/* controls */}
            <div className="w-full">
              <div className="mb-5 flex items-center justify-center gap-3">
                <Ctl label="Add" icon={<UserPlus className="h-4 w-4" />} />
                <Ctl label="Chat" icon={<MessageSquare className="h-4 w-4" />} />
                <Ctl label="Speaker" icon={<Volume2 className="h-4 w-4" />} />
                {kind === "video" ? (
                  <Ctl label="Flip" icon={<SwitchCamera className="h-4 w-4" />} />
                ) : (
                  <Ctl label="Expand" icon={<Maximize2 className="h-4 w-4" />} />
                )}
              </div>

              <div className="flex items-center justify-center gap-5">
                <button
                  onClick={() => setMuted((v) => !v)}
                  aria-label="Mute"
                  className={`grid h-14 w-14 place-items-center rounded-full transition ${
                    muted ? "bg-white text-primary" : "bg-white/15 hover:bg-white/25"
                  }`}
                >
                  {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={end}
                  aria-label="End call"
                  className="grid h-16 w-16 place-items-center rounded-full bg-red-500 shadow-lg shadow-red-500/30"
                >
                  <PhoneOff className="h-6 w-6" />
                </motion.button>

                {kind === "video" ? (
                  <button
                    onClick={() => setCamOff((v) => !v)}
                    aria-label="Camera"
                    className={`grid h-14 w-14 place-items-center rounded-full transition ${
                      camOff ? "bg-white text-primary" : "bg-white/15 hover:bg-white/25"
                    }`}
                  >
                    {camOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </button>
                ) : (
                  <button
                    onClick={() => setCamOff((v) => !v)}
                    aria-label="Switch to video"
                    className="grid h-14 w-14 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Ctl({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="flex w-16 flex-col items-center gap-1.5 text-[10px] opacity-85 transition hover:opacity-100">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10">{icon}</span>
      {label}
    </button>
  );
}
