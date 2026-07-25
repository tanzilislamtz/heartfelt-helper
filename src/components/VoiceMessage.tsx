import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Mic } from "lucide-react";
import { formatClock, type VoiceClip } from "@/lib/chat";

const SPEEDS = [1, 1.5, 2] as const;

/** Deterministic pseudo-waveform so every clip keeps a stable shape. */
function bars(seed: string, count = 30): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: count }, (_, i) => {
    h = (h * 1103515245 + 12345 + i) >>> 0;
    return 0.26 + ((h >>> 8) % 100) / 135;
  });
}

export default function VoiceMessage({
  clip,
  mine,
  seed,
  statusSlot,
}: {
  clip: VoiceClip;
  mine: boolean;
  seed: string;
  /** Read/delivered ticks, rendered on the meta row instead of inside the player. */
  statusSlot?: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [rateIdx, setRateIdx] = useState(0);
  const shape = useMemo(() => bars(seed), [seed]);
  const speed = SPEEDS[rateIdx];
  const total = clip.duration || 0;
  const progress = total ? Math.min(1, time / total) : 0;

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.playbackRate = speed;
  }, [speed, playing]);

  // Stop this clip whenever another one starts.
  useEffect(() => {
    const onOther = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail !== seed && audioRef.current) {
        audioRef.current.pause();
        setPlaying(false);
      }
    };
    window.addEventListener("la-voice-play", onOther);
    return () => window.removeEventListener("la-voice-play", onOther);
  }, [seed]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      window.dispatchEvent(new CustomEvent("la-voice-play", { detail: seed }));
      a.playbackRate = speed;
      void a.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !total) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * total;
    setTime(ratio * total);
  };

  const accent = mine ? "bg-primary-foreground" : "bg-primary";
  const dim = mine ? "bg-primary-foreground/30" : "bg-foreground/15";
  const meta = mine ? "text-primary-foreground/75" : "text-muted-foreground";

  return (
    <div className="w-[min(66vw,250px)] py-0.5 sm:w-[250px]">
      {clip.url ? (
        <audio
          ref={audioRef}
          src={clip.url}
          preload="metadata"
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onEnded={() => {
            setPlaying(false);
            setTime(0);
          }}
        />
      ) : null}

      {/* Row 1 — play control + waveform, both the same height */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={!clip.url}
          aria-label={playing ? "Pause voice message" : "Play voice message"}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition active:scale-95 disabled:opacity-40 ${
            mine
              ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>

        <div
          onClick={seek}
          role="presentation"
          className="flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-[2px]"
        >
          {shape.map((h, i) => {
            const filled = i / shape.length <= progress;
            return (
              <span
                key={i}
                style={{ height: `${Math.round(h * 30)}px` }}
                className={`min-w-0 flex-1 rounded-full transition-colors ${filled ? accent : dim}`}
              />
            );
          })}
        </div>
      </div>

      {/* Row 2 — meta: ticks · duration · speed */}
      <div className={`mt-1.5 flex items-center gap-2 pl-0.5 text-[11px] ${meta}`}>
        <Mic className="h-3 w-3 shrink-0" />
        <span className="shrink-0 tabular-nums">{formatClock(playing || time ? time : total)}</span>
        {statusSlot ? <span className="flex shrink-0 items-center">{statusSlot}</span> : null}
        <span className="min-w-0 flex-1" />
        <button
          type="button"
          onClick={() => setRateIdx((i) => (i + 1) % SPEEDS.length)}
          aria-label={`Playback speed ${speed}x`}
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums transition active:scale-95 ${
            mine
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-foreground/80 hover:bg-muted/70"
          }`}
        >
          {speed}x
        </button>
      </div>
    </div>
  );
}
