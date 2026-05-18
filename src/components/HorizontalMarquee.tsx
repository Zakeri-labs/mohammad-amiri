import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function HorizontalMarquee({ words }: { words: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);

  return (
    <div ref={ref} className="relative overflow-hidden border-y border-border/40 bg-background py-6 md:py-10">
      <motion.div style={{ x }} className="flex gap-6 whitespace-nowrap font-display text-[clamp(1.6rem,4.5vw,4rem)] leading-none md:gap-10">
        {[...words, ...words].map((w, i) => (
          <span key={i} className={i % 2 === 0 ? "text-foreground" : "italic gradient-gold-text"}>
            {w}
          </span>
        ))}
      </motion.div>
    </div>
  );
}