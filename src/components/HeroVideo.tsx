import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import heroVideo from "@/assets/dubai-journey.mp4.asset.json";
import advisorImg from "@/assets/advisor-amira.jpg";
import { VideoPreloader } from "./VideoPreloader";

type Chapter = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  bullets?: string[];
  align: "left" | "right" | "center";
  time: number; // video timestamp at chapter end
};

const CHAPTERS: Chapter[] = [
  {
    id: "burj",
    label: "Meet Amira",
    eyebrow: "Hosted by Amira Hassan",
    title: "Hello —",
    italic: "I'm Amira.",
    body: "For twelve years I've placed families into the quiet corners of Dubai. Let me walk you through one of mine — a sky residence above the Burj, told the way I'd show it to a friend.",
    align: "left",
    time: 0.1,
  },
  {
    id: "approach",
    label: "Arrival",
    eyebrow: "02 — Up to the 112th",
    title: "Step in with me,",
    italic: "the sky opens.",
    body: "A private elevator, a quiet pause, and the doors part. This is the moment I love most — when the city falls silent and the light does the talking.",
    align: "center",
    time: 3.8,
  },
  {
    id: "living",
    label: "Living",
    eyebrow: "03 — The Sky Room",
    title: "Sit a moment —",
    italic: "the room is yours.",
    body: "I chose this residence for one reason: the 270° turn from sunrise to skyline. Bookmatched Calacatta, hand-rubbed bronze, and a horizon that never repeats.",
    bullets: ["Ceilings · 4.2 m", "View · 270°", "Marble · Calacatta"],
    align: "left",
    time: 5,
  },
  {
    id: "dining",
    label: "Dining",
    eyebrow: "04 — At My Table",
    title: "Stay for dinner,",
    italic: "the city is the view.",
    body: "A four-metre Calacatta table under hand-blown brass — this is where I host my owners on the night they collect their keys. You're invited too.",
    bullets: ["Seats · 12", "Pendants · hand-blown brass", "Table · 4 m Calacatta"],
    align: "right",
    time: 7.4,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    eyebrow: "05 — One More Room",
    title: "Before we go —",
    italic: "the chef's stage.",
    body: "A five-metre honed island, integrated Gaggenau, and warm under-cabinet light that softens at dusk. When you're ready, I'll meet you at the door.",
    bullets: ["Island · 5 m", "Appliances · Gaggenau", "Fixtures · solid brass"],
    align: "left",
    time: 9.9,
  },
];

export function HeroVideo() {
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
    const COOLDOWN = 950;
    let touchStartY = 0;

    const isInside = () => {
      const rect = section.getBoundingClientRect();
      // sticky stage is active: top <=0 and we still have room below
      return rect.top <= 0 && rect.bottom > window.innerHeight;
    };

    const snapTo = (idx: number) => {
      const target = section.offsetTop + idx * window.innerHeight;
      window.scrollTo({ top: target, behavior: "smooth" });
    };

    const tryAdvance = (dir: 1 | -1, e: Event) => {
      if (!isInside()) return;
      const cur = activeRef.current;
      const next = cur + dir;
      // At the boundary in the scroll direction → release so the page
      // can scroll naturally into the section before/after.
      if (next < 0 || next > CHAPTERS.length - 1) return;
      e.preventDefault();
      e.stopPropagation();
      const now = performance.now();
      if (now - lastAt < COOLDOWN) return;
      lastAt = now;
      snapTo(next);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 2) return;
      tryAdvance(e.deltaY > 0 ? 1 : -1, e);
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

  const jumpTo = (idx: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const target = section.offsetTop + idx * window.innerHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const chapter = CHAPTERS[active];

  const alignClass =
    chapter.align === "right"
      ? "items-end text-right"
      : chapter.align === "center"
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

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-transparent to-background/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/45 via-transparent to-background/20" />

          {/* Top bar */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-8 md:px-16 md:py-10">
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-foreground/85">
              Maison · Dubai
            </span>
            <span className="hidden text-xs uppercase tracking-[0.4em] text-foreground/65 md:block">
              A cinematic journey
            </span>
          </div>

          {/* Chapter copy — fades between steps */}
          <div className="pointer-events-none absolute inset-0 z-10 flex px-8 pb-32 pt-28 md:px-16 md:pb-36">
            <div className={`flex w-full flex-col justify-center ${alignClass}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-2xl"
                >
                  <div className="mb-4 text-xs uppercase tracking-[0.5em] text-gold">
                    {chapter.eyebrow}
                  </div>
                  <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] text-foreground">
                    {chapter.title}
                    <br />
                    <span className="italic gradient-gold-text">{chapter.italic}</span>
                  </h2>
                  <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/80">
                    {chapter.body}
                  </p>

                  {chapter.bullets && (
                    <ul
                      className={`mt-8 flex flex-col gap-2 text-sm text-foreground/85 ${
                        chapter.align === "right" ? "ml-auto items-end" : ""
                      }`}
                    >
                      {chapter.bullets.map((b, i) => (
                        <motion.li
                          key={b}
                          initial={{ opacity: 0, x: chapter.align === "right" ? 16 : -16 }}
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

          {/* Bottom stats + advisor (only inside the residence) */}
          <AnimatePresence>
            {active >= 2 && (
              <motion.div
                key="bottombar"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-8 pb-10 md:px-16 md:pb-14"
              >
                <div className="flex flex-col items-end gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="grid grid-cols-3 gap-6 border-t border-border/50 pt-5 md:min-w-[420px]">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">From</div>
                      <div className="mt-2 font-display text-2xl text-foreground">$8.4M</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sky m²</div>
                      <div className="mt-2 font-display text-2xl text-foreground">640</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Level</div>
                      <div className="mt-2 font-display text-2xl text-foreground">84F</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-sm border border-border/40 bg-background/50 p-4 backdrop-blur-md">
                    <img
                      src={advisorImg}
                      alt="Amira Hassan"
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Private viewing with
                      </div>
                      <div className="font-display text-base text-foreground">Amira Hassan</div>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
                      By appointment
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter progress indicator — clickable */}
          <nav
            aria-label="Chapter navigation"
            className="absolute right-6 top-1/2 z-30 -translate-y-1/2 md:right-10"
          >
            <ul className="flex flex-col gap-5">
              {CHAPTERS.map((c, i) => {
                const isActive = i === active;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => jumpTo(i)}
                      className="group flex items-center gap-3"
                      aria-label={`Jump to ${c.label}`}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.3em] transition-colors ${
                          isActive ? "text-gold" : "text-foreground/40 group-hover:text-foreground/80"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")} · {c.label}
                      </span>
                      <span className="relative block h-px w-8 overflow-hidden bg-foreground/20">
                        <motion.span
                          className="absolute inset-y-0 left-0 bg-gold"
                          animate={{ width: isActive ? "100%" : "0%" }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
