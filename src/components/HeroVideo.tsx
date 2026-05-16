import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import heroVideo from "@/assets/dubai-journey.mp4.asset.json";
import advisorImg from "@/assets/advisor-amira.jpg";
import { RevealText } from "./RevealText";
import { VideoPreloader } from "./VideoPreloader";

export function HeroVideo() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleReady = useCallback((url: string) => setVideoSrc(url), []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const t = Math.max(0, Math.min(duration - 0.05, p * duration));
    if (Math.abs(v.currentTime - t) > 0.03) v.currentTime = t;
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => setDuration(v.duration || 0);
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) onMeta();
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [videoSrc]);

  // Phase 1 — Exterior, Burj Khalifa wide
  const p1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.22], [1, 1, 1, 0]);
  const p1Y = useTransform(scrollYProgress, [0, 0.22], ["0%", "-10%"]);

  // Phase 2 — Approach / glass
  const p2Opacity = useTransform(scrollYProgress, [0.24, 0.32, 0.4, 0.46], [0, 1, 1, 0]);
  const p2Y = useTransform(scrollYProgress, [0.24, 0.46], ["12%", "-12%"]);

  // Phase 3a — Living room (welcome + main title)
  const p3Opacity = useTransform(scrollYProgress, [0.48, 0.56, 0.66, 0.72], [0, 1, 1, 0]);
  const p3Y = useTransform(scrollYProgress, [0.48, 0.72], ["14%", "-6%"]);

  // Phase 3b — Dining
  const p4Opacity = useTransform(scrollYProgress, [0.72, 0.78, 0.84, 0.88], [0, 1, 1, 0]);
  const p4Y = useTransform(scrollYProgress, [0.72, 0.88], ["10%", "-6%"]);

  // Phase 3c — Kitchen
  const p5Opacity = useTransform(scrollYProgress, [0.88, 0.93, 1], [0, 1, 1]);
  const p5Y = useTransform(scrollYProgress, [0.88, 1], ["10%", "0%"]);

  // Persistent stats + advisor (visible throughout the interior)
  const sideOpacity = useTransform(scrollYProgress, [0.5, 0.58, 1], [0, 1, 1]);

  const vignette = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.28, 0.55]);

  return (
    <>
      <VideoPreloader src={heroVideo.url} onReady={handleReady} />

      <section ref={ref} className="relative h-[750vh] w-full">
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

          <motion.div
            style={{ opacity: vignette }}
            className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/20" />

          {/* Persistent top bar */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-8 md:px-16 md:py-10">
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-foreground/85">
              Maison · Dubai
            </span>
            <span className="hidden text-xs uppercase tracking-[0.4em] text-foreground/65 md:block">
              A cinematic journey · Scroll
            </span>
          </div>

          {/* PHASE 1 — Exterior */}
          <motion.div
            style={{ opacity: p1Opacity, y: p1Y }}
            className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-8 pb-14 pt-28 md:px-16 md:pb-20 md:pt-32"
          >
            <div className="max-w-5xl">
              <RevealText className="mb-6 text-xs uppercase tracking-[0.5em] text-gold">
                01 — Burj Khalifa
              </RevealText>
              <RevealText delay={0.1} as="h1" className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.9] text-foreground text-balance">
                A tower of
              </RevealText>
              <RevealText delay={0.25} as="h1" className="font-display italic text-[clamp(3rem,10vw,10rem)] leading-[0.9] gradient-gold-text text-balance">
                light.
              </RevealText>
            </div>

            <div className="flex items-end justify-between gap-8">
              <RevealText delay={0.45} className="max-w-md text-sm leading-relaxed text-foreground/75">
                828 metres above the desert. Scroll to ascend with us — from the
                skyline of Downtown into a residence written in marble and glass.
              </RevealText>

              {/* Advisor card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="hidden items-center gap-4 rounded-sm border border-border/40 bg-background/40 p-4 backdrop-blur-md md:flex"
              >
                <img
                  src={advisorImg}
                  alt="Amira Hassan, senior advisor"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Your advisor
                  </div>
                  <div className="font-display text-lg text-foreground">Amira Hassan</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                    Private Residences · DIFC
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* PHASE 2 — Approach */}
          <motion.div
            style={{ opacity: p2Opacity, y: p2Y }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-8 text-center"
          >
            <div className="max-w-3xl">
              <p className="mb-4 text-xs uppercase tracking-[0.5em] text-gold">
                02 — Approaching
              </p>
              <p className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[1] text-foreground">
                Through the glass,
                <br />
                <span className="italic gradient-gold-text">into the silence.</span>
              </p>
              <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-foreground/70">
                A private elevator opens at the 112th floor. The city falls quiet.
              </p>
            </div>
          </motion.div>

          {/* PHASE 3a — Living room: welcome + main title (left side) */}
          <motion.div
            style={{ opacity: p3Opacity, y: p3Y }}
            className="pointer-events-none absolute inset-y-0 left-0 z-10 flex max-w-2xl flex-col justify-center px-8 md:px-16"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.5em] text-gold">
              03 — Living Room
            </p>
            <p className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1] text-foreground">
              Welcome home,
              <br />
              <span className="italic gradient-gold-text">the sky room — yours.</span>
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/75">
              Bookmatched marble, hand-rubbed bronze, ceilings of 4.2 metres,
              and a 270° view of a city written in light.
            </p>
          </motion.div>

          {/* PHASE 3b — Dining */}
          <motion.div
            style={{ opacity: p4Opacity, y: p4Y }}
            className="pointer-events-none absolute inset-y-0 right-0 z-10 flex max-w-xl flex-col justify-center px-8 text-right md:px-16"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.5em] text-gold">
              04 — Dining
            </p>
            <p className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1] text-foreground">
              A table for
              <br />
              <span className="italic gradient-gold-text">twelve, in the sky.</span>
            </p>
            <p className="ml-auto mt-6 max-w-sm text-sm leading-relaxed text-foreground/75">
              A four-metre Calacatta table beneath hand-blown brass pendants —
              dinners staged against the Dubai skyline.
            </p>
          </motion.div>

          {/* PHASE 3c — Kitchen */}
          <motion.div
            style={{ opacity: p5Opacity, y: p5Y }}
            className="pointer-events-none absolute inset-y-0 left-0 z-10 flex max-w-2xl flex-col justify-center px-8 md:px-16"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.5em] text-gold">
              05 — The Kitchen
            </p>
            <p className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1] text-foreground">
              A chef's stage,
              <br />
              <span className="italic gradient-gold-text">cast in marble & brass.</span>
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/75">
              A five-metre island in honed Calacatta, integrated Gaggenau
              appliances, and warm under-cabinet light that softens at dusk.
            </p>
          </motion.div>

          {/* Persistent stats + advisor card (interior) */}
          <motion.div
            style={{ opacity: sideOpacity }}
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
        </div>
      </section>
    </>
  );
}
