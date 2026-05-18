import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import heroVideo from "@/assets/dubai-journey.mp4.asset.json";
import advisorImg from "@/assets/advisor-mohammad.jpg";
import { VideoPreloader } from "./VideoPreloader";
import { useT } from "@/lib/i18n";

type Chapter = {
  id: string;
  align: "left" | "right" | "center";
  time: number; // video timestamp at chapter end
};

const CHAPTERS: Chapter[] = [
  { id: "intro", align: "left", time: 0.1 },
  { id: "approach", align: "center", time: 3.8 },
  { id: "living", align: "left", time: 5 },
  { id: "dining", align: "right", time: 7.4 },
  { id: "kitchen", align: "left", time: 9.9 },
];

export function HeroVideo() {
  const { t, lang } = useT();
  const chapters = t<any[]>("chapters");
  const stats = t<{ label: string; value: string }[]>("stats");
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tweenRef = useRef<number | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [active, setActive] = useState(0);

  const handleReady = useCallback((url: string) => setVideoSrc(url), []);

  // Move the video to `target` by actually PLAYING it forward (so every frame
  // decodes smoothly). Scrubbing via currentTime snaps between keyframes and
  // looks like the scene is "jumping" — we avoid that here.
  //   • forward  → play() at a speed that lands on target in ~1.4s, then pause
  //   • backward → quick seek (no smooth reverse playback in HTML5 video)
  const tweenVideoTo = useCallback((target: number) => {
    const v = videoRef.current;
    if (!v) return;
    if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
    const start = v.currentTime;
    const distance = target - start;

    // Essentially in place: just snap.
    if (Math.abs(distance) <= 0.05) {
      try {
        v.pause();
        v.currentTime = Math.max(0, target);
      } catch {}
      return;
    }

    // Going backward: HTML5 video can't play in reverse, so we step
    // currentTime backward in small chunks via rAF. Small steps land close
    // to keyframes and look like a smooth rewind.
    if (distance < 0) {
      try {
        v.pause();
      } catch {}
      const rewindMs = 1400; // total time to rewind
      const startedAt = performance.now();
      const from = start;
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const stepBack = (now: number) => {
        const p = Math.min(1, (now - startedAt) / rewindMs);
        const t = from + (target - from) * ease(p);
        try {
          v.currentTime = Math.max(0, t);
        } catch {}
        if (p < 1) tweenRef.current = requestAnimationFrame(stepBack);
        else {
          try {
            v.currentTime = Math.max(0, target);
          } catch {}
          tweenRef.current = null;
        }
      };
      tweenRef.current = requestAnimationFrame(stepBack);
      return;
    }

    // Going forward: play at a rate that covers `distance` in ~1.4s,
    // clamped to a natural-looking range, then pause at target.
    const desiredMs = 1400;
    const rate = Math.min(4, Math.max(1, (distance * 1000) / desiredMs));
    try {
      v.playbackRate = rate;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {}

    const watch = () => {
      const cur = v.currentTime;
      if (cur >= target - 0.03 || v.ended) {
        try {
          v.pause();
          v.currentTime = target;
          v.playbackRate = 1;
        } catch {}
        tweenRef.current = null;
        return;
      }
      tweenRef.current = requestAnimationFrame(watch);
    };
    tweenRef.current = requestAnimationFrame(watch);
  }, []);

  // Wait until the video has buffered enough to seek smoothly
  useEffect(() => {
    if (!videoSrc) return;
    const v = videoRef.current;
    if (!v) return;
    const check = () => {
      // readyState 4 = HAVE_ENOUGH_DATA
      if (v.readyState >= 4) setVideoReady(true);
    };
    check();
    v.addEventListener("canplaythrough", check);
    v.addEventListener("loadeddata", check);
    return () => {
      v.removeEventListener("canplaythrough", check);
      v.removeEventListener("loadeddata", check);
    };
  }, [videoSrc]);

  // Tall scroll-snap section: each chapter occupies one viewport slot.
  // A wheel/swipe/key event SNAPS scroll position to the next slot —
  // exactly one chapter per gesture, regardless of scroll amount.
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Track active chapter from scroll position (so jumpTo / natural scroll work).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const scrolled = Math.min(
          Math.max(-rect.top, 0),
          section.offsetHeight - vh
        );
        const idx = Math.min(
          CHAPTERS.length - 1,
          Math.max(0, Math.round(scrolled / vh))
        );
        setActive((prev) => (prev === idx ? prev : idx));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Snap one chapter per gesture by intercepting wheel/key/touch.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastAt = 0;
    const COOLDOWN = 1100;
    let touchStartY = 0;
    // Trackpad inertia produces a long tail of wheel events after the
    // user's flick. We only want ONE advance per gesture — so we lock
    // out new advances until the wheel goes quiet for ~120ms.
    let lastWheelAt = 0;
    let wheelDirLocked: 0 | 1 | -1 = 0;
    let isAnimating = false;

    const isInside = () => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > window.innerHeight;
    };

    const snapTo = (idx: number) => {
      const target = section.offsetTop + idx * window.innerHeight;
      isAnimating = true;
      window.scrollTo({ top: target, behavior: "smooth" });
      window.setTimeout(() => { isAnimating = false; }, COOLDOWN);
    };

    const tryAdvance = (dir: 1 | -1, e: Event) => {
      if (!isInside()) return;
      const cur = activeRef.current;
      const next = cur + dir;
      if (next < 0 || next > CHAPTERS.length - 1) return;
      e.preventDefault();
      e.stopPropagation();
      const now = performance.now();
      if (now - lastAt < COOLDOWN || isAnimating) return;
      lastAt = now;
      snapTo(next);
    };

    const onWheel = (e: WheelEvent) => {
      if (!isInside()) return;
      const now = performance.now();
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      // Treat events <120ms apart as the same gesture.
      if (now - lastWheelAt < 120 && wheelDirLocked === dir) {
        e.preventDefault();
        lastWheelAt = now;
        return;
      }
      wheelDirLocked = dir;
      lastWheelAt = now;
      if (Math.abs(e.deltaY) < 2) return;
      tryAdvance(dir, e);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!isInside()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        tryAdvance(1, e);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        tryAdvance(-1, e);
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      const dy = touchStartY - y;
      if (Math.abs(dy) < 24) return;
      tryAdvance(dy > 0 ? 1 : -1, e);
      touchStartY = y;
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as never);
      window.removeEventListener("keydown", onKey, { capture: true } as never);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Whenever active chapter changes, animate the video to its timestamp
  useEffect(() => {
    if (!videoSrc || !videoReady) return;
    tweenVideoTo(CHAPTERS[active].time);
  }, [active, videoSrc, videoReady, tweenVideoTo]);

  const meta = CHAPTERS[active];
  const chapter = chapters[active];

  const alignClass =
    meta.align === "right"
      ? "items-end text-right"
      : meta.align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <>
      <VideoPreloader src={heroVideo.url} onReady={handleReady} />

      <section
        ref={sectionRef}
        className="relative w-full"
        style={{ height: `${CHAPTERS.length * 100}vh` }}
      >
        {/* Sticky stage — one fixed viewport for the whole journey */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Vignette — stronger to keep titles & body legible over moving video */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/10 to-background/40" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />

          {/* Top bar is provided globally by the fixed <Navbar />. */}

          {/* Chapter copy — fades between steps */}
          <div className="pointer-events-none absolute inset-0 z-10 flex px-5 pb-48 pt-20 md:px-16 md:pb-36 md:pt-28">
            <div className={`flex w-full flex-col justify-center ${alignClass}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${meta.id}-${lang}`}
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-2xl"
                  style={{ textShadow: "0 2px 28px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5)" }}
                >
                  <div className="mb-3 text-[10px] uppercase tracking-[0.35em] text-gold md:mb-4 md:text-xs md:tracking-[0.5em]">
                    {chapter.eyebrow}
                  </div>
                  <h2 className="font-display text-[clamp(2rem,9vw,6.5rem)] leading-[0.95] text-foreground">
                    {chapter.title}
                    <br />
                    <span className="italic gradient-gold-text">{chapter.italic}</span>
                  </h2>
                  <p className="mt-5 max-w-md text-[13px] leading-relaxed text-foreground/80 md:mt-6 md:text-sm">
                    {chapter.body}
                  </p>

                  {chapter.bullets && (
                    <ul
                      className={`mt-8 flex flex-col gap-2 text-sm text-foreground/85 ${
                        meta.align === "right" ? "ml-auto items-end" : ""
                      }`}
                    >
                      {chapter.bullets.map((b: string, i: number) => (
                        <motion.li
                          key={b}
                          initial={{ opacity: 0, x: meta.align === "right" ? 16 : -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/70"
                        >
                          <span className="h-px w-6 bg-gold" />
                          {b}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom — advisor card on chapter 0 (intro), stats inside residence */}
          <AnimatePresence mode="wait">
            {active === 0 ? (
              <motion.div
                key="advisor-intro"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 md:px-16 md:pb-14"
              >
                <div className="mx-auto flex max-w-md items-center gap-4 rounded-sm border border-border/40 bg-background/60 p-4 backdrop-blur-md md:mx-0 md:max-w-lg md:gap-5 md:p-5">
                  <img
                    src={advisorImg}
                    alt={t<string>("advisorName")}
                    width={64}
                    height={64}
                    className="h-14 w-14 flex-none rounded-full object-cover md:h-16 md:w-16"
                  />
                  <div className="flex-1">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-gold md:text-[10px]">
                      {t<string>("yourAdvisor")}
                    </div>
                    <div className="mt-1 font-display text-lg text-foreground md:text-xl">
                      {t<string>("advisorName")}
                    </div>
                    <div className="mt-0.5 text-[11px] text-foreground/70 md:text-xs">
                      {t<string>("advisorRoleShort")}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="hidden whitespace-nowrap rounded-sm border border-gold/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/10 sm:block"
                  >
                    {t<string>("meetMe")}
                  </a>
                </div>
                <p className="mx-auto mt-3 max-w-md text-center text-[11px] uppercase tracking-[0.3em] text-foreground/50 md:mx-0 md:text-left">
                  {t<string>("scrollHint")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="bottombar"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-8 md:px-16 md:pb-14"
              >
                <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-4 md:max-w-[480px] md:gap-6 md:pt-5">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground md:text-[10px]">{s.label}</div>
                      <div className="mt-1 font-display text-xl text-foreground md:mt-2 md:text-2xl">{s.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
