import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  src: string;
  onReady: (blobUrl: string) => void;
}

export function VideoPreloader({ src, onReady }: Props) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(src, { signal: controller.signal });
        if (!res.ok || !res.body) throw new Error("fetch failed");
        const total = Number(res.headers.get("content-length")) || 0;
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        while (true) {
          const { done: rdone, value } = await reader.read();
          if (rdone) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            if (total) setProgress(Math.min(0.99, received / total));
            else setProgress((p) => Math.min(0.95, p + 0.01));
          }
        }
        if (cancelled) return;
        const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        setProgress(1);
        setTimeout(() => {
          if (!cancelled) {
            setDone(true);
            onReady(url);
          }
        }, 400);
      } catch (e) {
        if (!cancelled) {
          setProgress(1);
          setDone(true);
          onReady(src);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [src, onReady]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <div className="mb-10 text-center">
            <div className="mb-3 text-xs uppercase tracking-[0.5em] text-gold">
              Maison · Dubai
            </div>
            <div className="font-display text-3xl italic text-foreground/90 md:text-4xl">
              Preparing your cinematic journey
            </div>
          </div>

          <div className="relative h-px w-[min(380px,70vw)] overflow-hidden bg-foreground/15">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gold"
              animate={{ width: `${progress * 100}%` }}
              transition={{ ease: "linear", duration: 0.2 }}
            />
          </div>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/60">
            {Math.round(progress * 100).toString().padStart(3, "0")}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
