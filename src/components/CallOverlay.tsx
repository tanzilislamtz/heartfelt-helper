import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, ChevronDown, Phone, GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type CallKind = "audio";

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
  const [speaker, setSpeaker] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const dragArea = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!open) return;
    setPhase("ringing");
    setSeconds(0);
    setMuted(false);
    setSpeaker(true);
    setMinimized(false);
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
      ? "Ringing…"
      : phase === "connected"
        ? fmt(seconds)
        : "Call ended";

  if (open && minimized) {
    return (
      <div ref={dragArea} className="pointer-events-none fixed inset-0 z-[80]">
        <motion.button
          drag
          dragConstraints={dragArea}
          dragElastic={0.06}
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = false;
          }}
          onDrag={() => {
            dragged.current = true;
          }}
          whileDrag={{ scale: 1.03, cursor: "grabbing" }}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            if (dragged.current) {
              dragged.current = false;
              return;
            }
            setMinimized(false);
          }}
          className="pointer-events-auto absolute left-2 right-2 top-[calc(env(safe-area-inset-top)+0.5rem)] flex cursor-grab touch-none items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-left text-white shadow-lg active:cursor-grabbing lg:left-auto lg:right-6 lg:top-4 lg:w-auto lg:px-4"
        >
          <span className="hidden shrink-0 text-white/60 lg:block">
            <GripVertical className="h-4 w-4" />
          </span>
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/20"
          >
            <Phone className="h-3.5 w-3.5" />
          </motion.span>
          <span className="min-w-0 flex-1 truncate text-xs font-semibold">
            {name} · {phase === "ringing" ? "Ringing…" : fmt(seconds)}
          </span>
          <span className="shrink-0 rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
            Tap to return
          </span>
          <span
            role="button"
            aria-label="End call"
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              end();
            }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-500"
          >
            <PhoneOff className="h-3.5 w-3.5" />
          </span>
        </motion.button>
      </div>
    );
  }


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-primary/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.94, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative flex h-full w-full max-w-md flex-col items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[calc(env(safe-area-inset-top)+40px)] text-primary-foreground sm:h-[640px] sm:rounded-[2rem] sm:border sm:border-white/15 sm:pb-8 sm:pt-10 sm:shadow-2xl"
          >
            {/* top */}
            <div className="flex w-full items-center justify-between">
              <button
                onClick={() => setMinimized(true)}
                aria-label="Back to chat"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
              <span className="text-[11px] uppercase tracking-[0.18em] opacity-70">Voice call</span>
              <span className="text-[11px] uppercase tracking-[0.18em] opacity-70">Learns Academy</span>
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

            {/* controls */}
            <div className="w-full">
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

                <button
                  onClick={() => setSpeaker((v) => !v)}
                  aria-label="Speaker"
                  className={`grid h-14 w-14 place-items-center rounded-full transition ${
                    speaker ? "bg-white text-primary" : "bg-white/15 hover:bg-white/25"
                  }`}
                >
                  {speaker ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
