import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { RevealText } from "./RevealText";
import { useT } from "@/lib/i18n";

interface ParallaxSceneProps {
  image: string;
  eyebrow: string;
  title: string;
  titleItalic?: string;
  description: string;
  meta: { label: string; value: string }[];
  align?: "left" | "right";
  index: number;
}

export function ParallaxScene({
  image,
  eyebrow,
  title,
  titleItalic,
  description,
  meta,
  align = "left",
  index,
}: ParallaxSceneProps) {
  const { lang } = useT();
  // In Farsi (RTL) we anchor every scene to the logical start (right edge)
  // so reading flow stays natural. English keeps the cinematic left/right
  // variation passed in via `align`.
  const effectiveAlign: "left" | "right" = lang === "fa" ? "left" : align;
  const ref = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Layered parallax — lighter on mobile so it stays smooth, fuller on desktop
  const bgRange = isMobile ? ["-8%", "8%"] : ["-15%", "15%"];
  const cardRange = isMobile ? ["8%", "-8%"] : ["20%", "-20%"];
  const bgY = useTransform(scrollYProgress, [0, 1], bgRange);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.04, 1.12]);
  const cardY = useTransform(scrollYProgress, [0, 1], cardRange);
  const numberY = useTransform(scrollYProgress, [0, 1], ["60%", "-60%"]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.15, 0.15, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-background md:h-[140vh]">
      {/* Background layer — slow parallax (lighter on mobile) */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute -top-[8%] h-[120%] w-full md:-top-[15%] md:h-[130%]"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          width={1920}
          height={1280}
          className="h-full w-full object-cover object-center"
        />
        {/* Strong vertical + directional gradients keep titles legible over any image */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-background md:from-background/70 md:via-background/15" />
        <div
          className={
            align === "left"
              ? "absolute inset-0 bg-gradient-to-r from-background/95 via-background/65 to-background/25 md:from-background/85 md:via-background/40 md:to-transparent"
              : "absolute inset-0 bg-gradient-to-l from-background/95 via-background/65 to-background/25 md:from-background/85 md:via-background/40 md:to-transparent"
          }
        />
      </motion.div>

      {/* Giant index number — desktop only (too heavy on mobile) */}
      <motion.div
        style={{ y: numberY, opacity: numberOpacity }}
        className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 font-display text-[28vw] leading-none text-gold md:block ${
          effectiveAlign === "left" ? "right-[-4%]" : "left-[-4%]"
        }`}
      >
        {String(index).padStart(2, "0")}
      </motion.div>

      {/* Midground card — opposite parallax */}
      <motion.div
        style={{ y: cardY }}
        className={`sticky top-0 flex h-screen items-center px-5 md:px-20 ${effectiveAlign === "right" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`relative z-10 max-w-xl ${effectiveAlign === "right" ? "md:text-end" : "text-start"}`}
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
        >
          <RevealText className="mb-4 text-[10px] uppercase tracking-[0.35em] text-gold md:mb-5 md:text-xs md:tracking-[0.5em]">
            {eyebrow}
          </RevealText>
          <RevealText delay={0.1} as="h2" className="font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.95] text-foreground">
            {title}
          </RevealText>
          {titleItalic && (
            <RevealText delay={0.2} as="h2" className="font-display italic text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.95] gradient-gold-text">
              {titleItalic}
            </RevealText>
          )}
          <RevealText delay={0.35} as="p" className="mt-6 text-[13px] leading-relaxed text-foreground/75 text-balance md:mt-8 md:text-base">
            {description}
          </RevealText>

          <motion.dl
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-8 grid grid-cols-3 gap-4 border-t border-border/50 pt-5 md:mt-10 md:gap-6 md:pt-6 ${effectiveAlign === "right" ? "md:text-end" : "text-start"}`}
          >
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground md:text-[10px]">
                  {m.label}
                </dt>
                <dd className="mt-1.5 font-display text-xl text-foreground md:mt-2 md:text-2xl">{m.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  );
}