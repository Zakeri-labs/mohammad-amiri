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
    label: "Skyline",
    eyebrow: "01 — Burj Khalifa",
    title: "A tower of",
    italic: "light.",
    body: "828 metres above the desert. Begin the journey — from the skyline of Downtown into a residence written in marble and glass.",
    align: "left",
    time: 0.1,
  },
  {
    id: "approach",
    label: "Approach",
    eyebrow: "02 — Approaching",
    title: "Through the glass,",
    italic: "into the silence.",
    body: "A private elevator opens at the 112th floor. The city falls quiet.",
    align: "center",
    time: 2.6,
  },
  {
    id: "arrival",
    label: "Arrival",
    eyebrow: "03 — Arrival",
    title: "The doors part —",
    italic: "the sky opens.",
    body: "Soft light spills across honed stone as the residence reveals itself, one frame at a time.",
    align: "center",
    time: 3.8,
  },
  {
    id: "living",
    label: "Living",
    eyebrow: "04 — Living Room",
    title: "Welcome home,",
    italic: "the sky room — yours.",
    body: "Bookmatched marble, hand-rubbed bronze, and a 270° view of a city written in light.",
    bullets: ["Ceilings · 4.2 m", "View · 270°", "Marble · Calacatta"],
    align: "left",
    time: 5,
  },
  {
    id: "dining",
    label: "Dining",
    eyebrow: "05 — Dining",
    title: "A table for",
    italic: "twelve, in the sky.",
    body: "A four-metre Calacatta table beneath hand-blown brass pendants — dinners staged against the Dubai skyline.",
    bullets: ["Seats · 12", "Pendants · hand-blown brass", "Table · 4 m Calacatta"],
    align: "right",
    time: 7.4,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    eyebrow: "06 — The Kitchen",
    title: "A chef's stage,",
    italic: "cast in marble & brass.",
    body: "A five-metre island in honed Calacatta, integrated Gaggenau appliances, and warm under-cabinet light that softens at dusk.",
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

  // Tween video.currentTime smoothly to the target chapter timestamp.
  // Duration scales with distance so big jumps feel just as smooth as small ones.
  const tweenVideoTo = useCallback((target: number) => {
    const v = videoRef.current;
    if (!v) return;
    if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
    const start = v.currentTime;
    const distance = Math.abs(target - start);
    // ~700ms per second of video, clamped between 900ms and 2200ms
    const durationMs = Math.min(2200, Math.max(900, distance * 700));
    const startedAt = performance.now();
    // easeInOutCubic — smoother on both ends, avoids the snap at the start of long jumps
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = (now: number) => {
      const p = Math.min(1, (now - startedAt) / durationMs);
      const t = start + (target - start) * ease(p);
      try {
        v.currentTime = t;
      } catch {}
      if (p < 1) tweenRef.current = requestAnimationFrame(step);
      else tweenRef.current = null;
    };
    tweenRef.current = requestAnimationFrame(step);
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

  // Track which chapter "slot" is in view (each chapter == 100vh)
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
        const total = CHAPTERS.length;
        // progress 0..1 within the section
        const scrolled = Math.min(
          Math.max(-rect.top, 0),
          section.offsetHeight - vh
        );
        const idx = Math.min(
          total - 1,
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

  // Whenever active chapter changes, animate the video to its timestamp
  useEffect(() => {
    if (!videoSrc || !videoReady) return;
    tweenVideoTo(CHAPTERS[active].time);
  }, [active, videoSrc, videoReady, tweenVideoTo]);

  const jumpTo = (idx: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.offsetTop + idx * window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
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
