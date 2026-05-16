import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import heroVideo from "@/assets/dubai-scroll.mp4.asset.json";
import { RevealText } from "./RevealText";

export function HeroVideo() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Scrub video by scroll progress
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const t = Math.max(0, Math.min(duration - 0.05, p * duration));
    // Only seek when delta is meaningful to avoid jitter
    if (Math.abs(v.currentTime - t) > 0.03) {
      v.currentTime = t;
    }
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => setDuration(v.duration || 0);
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) onMeta();
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, []);

  // Foreground UI animates within the first portion of scroll
  const introOpacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.25], ["0%", "-15%"]);

  const midOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.7], [0, 1, 1, 0]);
  const midY = useTransform(scrollYProgress, [0.35, 0.7], ["20%", "-20%"]);

  const endOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.8, 1], ["20%", "0%"]);

  const vignette = useTransform(scrollYProgress, [0, 0.5, 1], [0.45, 0.25, 0.7]);

  return (
    // Long scroll track that pins the video for the duration of the section
    <section ref={ref} className="relative h-[500vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <video
          ref={videoRef}
          src={heroVideo.url}
          muted
          playsInline
          preload="auto"
          // @ts-expect-error iOS attribute
          webkit-playsinline="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* dynamic vignette overlay */}
        <motion.div
          style={{ opacity: vignette }}
          className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/20" />

        {/* INTRO: skyline */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-0 z-10 flex flex-col justify-between px-8 py-10 md:px-16 md:py-14"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-foreground/80">
              Maison · Dubai
            </span>
            <span className="hidden text-xs uppercase tracking-[0.4em] text-foreground/70 md:block">
              Est. MMXXIV
            </span>
          </div>

          <div className="max-w-5xl">
            <RevealText className="mb-6 text-xs uppercase tracking-[0.5em] text-gold">
              Cinematic Real Estate
            </RevealText>
            <RevealText delay={0.15} as="h1" className="font-display text-[clamp(3.5rem,11vw,11rem)] leading-[0.9] text-foreground text-balance">
              Live above
            </RevealText>
            <RevealText delay={0.3} as="h1" className="font-display italic text-[clamp(3.5rem,11vw,11rem)] leading-[0.9] gradient-gold-text text-balance">
              the city.
            </RevealText>
          </div>

          <div className="flex items-end justify-between gap-6">
            <RevealText delay={0.5} className="max-w-md text-sm leading-relaxed text-foreground/75">
              Scroll to fly through Dubai — from the skyline of Downtown into the
              interior of your next residence.
            </RevealText>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-foreground/60">
              <span>Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="h-8 w-px bg-gold"
              />
            </div>
          </div>
        </motion.div>

        {/* MID: approaching the tower */}
        <motion.div
          style={{ opacity: midOpacity, y: midY }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-8 text-center"
        >
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.5em] text-gold">Approaching</p>
            <p className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[1] text-foreground">
              Through the glass,
              <br />
              <span className="italic gradient-gold-text">into the silence.</span>
            </p>
          </div>
        </motion.div>

        {/* END: inside the apartment */}
        <motion.div
          style={{ opacity: endOpacity, y: endY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-8 pb-16 md:px-16 md:pb-24"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.5em] text-gold">
                Welcome home
              </p>
              <p className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1] text-foreground">
                The sky room,
                <span className="italic gradient-gold-text"> yours.</span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 border-t border-border/50 pt-6 md:min-w-[420px]">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
