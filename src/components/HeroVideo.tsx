import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import heroVideo from "@/assets/dubai-hero.mp4.asset.json";
import { RevealText } from "./RevealText";

export function HeroVideo() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.95]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[120vh] w-full overflow-hidden">
      <motion.div
        style={{ scale: videoScale }}
        className="absolute inset-0 h-full w-full"
      >
        <video
          src={heroVideo.url}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* gradient overlays for depth */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/30" />

      {/* foreground content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-screen flex-col justify-between px-8 py-10 md:px-16 md:py-14"
      >
        <div className="flex items-center justify-between">
          <RevealText className="text-xs font-medium uppercase tracking-[0.4em] text-foreground/80">
            Maison · Dubai
          </RevealText>
          <RevealText delay={0.1} className="hidden text-xs uppercase tracking-[0.4em] text-foreground/70 md:block">
            Est. MMXXIV
          </RevealText>
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

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <RevealText delay={0.5} className="max-w-md text-sm leading-relaxed text-foreground/75">
            A curated portfolio of Dubai's most singular residences — from the cloud-piercing
            towers of Downtown to private islands carved into the Arabian Gulf.
          </RevealText>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-foreground/60"
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 w-px bg-gold"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}