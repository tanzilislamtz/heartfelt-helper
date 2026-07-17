import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Check, RotateCw, X, ZoomIn, ZoomOut, Move } from "lucide-react";

type Props = {
  src: string | null;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
  size?: number; // output size in px
};

/**
 * Advanced circular avatar cropper: zoom, rotate, drag, output as square PNG.
 * Pure canvas — no external crop lib.
 */
export function AvatarCropper({ src, onCancel, onApply, size = 512 }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const BOX = 288; // preview box (px)

  useEffect(() => {
    if (!src) return;
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => {
      imgRef.current = i;
      setImg(i);
      // fit to cover
      const scale = Math.max(BOX / i.width, BOX / i.height);
      setZoom(scale);
      setPos({ x: 0, y: 0 });
      setRotate(0);
    };
    i.src = src;
  }, [src]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - dragging.current.x, y: e.clientY - dragging.current.y });
  };
  const onPointerUp = () => (dragging.current = null);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(5, Math.max(0.2, z * (e.deltaY > 0 ? 0.94 : 1.06))));
  };

  const apply = useCallback(() => {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);

    // Map preview transform -> output transform
    const ratio = size / BOX;
    ctx.translate(size / 2 + pos.x * ratio, size / 2 + pos.y * ratio);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    onApply(canvas.toDataURL("image/png", 0.95));
  }, [img, zoom, rotate, pos, size, onApply]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 p-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
              <div>
                <p className="font-display text-base font-semibold">Adjust your photo</p>
                <p className="text-[11px] text-muted-foreground">Drag, zoom & rotate to frame</p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <div
                ref={boxRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onWheel={onWheel}
                className="relative mx-auto touch-none select-none overflow-hidden rounded-2xl bg-checker"
                style={{
                  width: BOX,
                  height: BOX,
                  backgroundImage:
                    "conic-gradient(from 45deg, var(--muted) 0 25%, transparent 0 50%, var(--muted) 0 75%, transparent 0)",
                  backgroundSize: "20px 20px",
                  cursor: dragging.current ? "grabbing" : "grab",
                }}
              >
                {img && (
                  <img
                    src={img.src}
                    alt=""
                    draggable={false}
                    className="pointer-events-none absolute left-1/2 top-1/2 max-w-none origin-center"
                    style={{
                      transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${rotate}deg) scale(${zoom})`,
                    }}
                  />
                )}
                {/* Circular mask overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    boxShadow: `0 0 0 9999px hsl(var(--background) / 0.75)`,
                    borderRadius: "9999px",
                    clipPath: "circle(50% at 50% 50%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-dashed border-primary/70"
                  style={{ clipPath: "circle(50% at 50% 50%)" }}
                />
                {/* Grid guides */}
                <div className="pointer-events-none absolute inset-0" style={{ clipPath: "circle(50% at 50% 50%)" }}>
                  <div className="absolute left-1/3 top-0 h-full w-px bg-background/40" />
                  <div className="absolute left-2/3 top-0 h-full w-px bg-background/40" />
                  <div className="absolute top-1/3 left-0 h-px w-full bg-background/40" />
                  <div className="absolute top-2/3 left-0 h-px w-full bg-background/40" />
                </div>
                <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-foreground/70 px-2.5 py-1 text-[10px] font-medium text-background">
                  <Move className="h-3 w-3" /> Drag to reposition
                </div>
              </div>

              {/* Zoom */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <ZoomOut className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="range"
                    min={0.2}
                    max={5}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="h-1.5 flex-1 accent-primary"
                    aria-label="Zoom"
                  />
                  <ZoomIn className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <RotateCw className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={rotate}
                    onChange={(e) => setRotate(parseFloat(e.target.value))}
                    className="h-1.5 flex-1 accent-primary"
                    aria-label="Rotate"
                  />
                  <button
                    type="button"
                    onClick={() => setRotate((r) => r + 90)}
                    className="rounded-lg border border-border/70 px-2 py-1 text-[11px] font-semibold text-foreground transition hover:bg-muted"
                  >
                    +90°
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!img) return;
                      const s = Math.max(BOX / img.width, BOX / img.height);
                      setZoom(s);
                      setPos({ x: 0, y: 0 });
                      setRotate(0);
                    }}
                    className="rounded-lg border border-border/70 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    Reset
                  </button>
                  <span className="ml-auto self-center text-[11px] text-muted-foreground">
                    {Math.round(zoom * 100)}% · {rotate}°
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-border/60 bg-muted/30 px-5 py-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-xl border border-border/70 bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={apply}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition hover:brightness-110"
              >
                <Check className="h-4 w-4" strokeWidth={3} /> Apply
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
