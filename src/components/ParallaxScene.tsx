import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { RevealText } from "./RevealText";

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
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Layered parallax — background image moves slowly, midground card moves opposite, foreground number flies fast
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const numberY = useTransform(scrollYProgress, [0, 1], ["60%", "-60%"]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.15, 0.15, 0]);

  return (
    <section ref={ref} className="relative h-[140vh] w-full overflow-hidden bg-background">
      {/* Background layer — slow parallax */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 -top-[15%] h-[130%] w-full">
        <img
          src={image}
          alt={title}
          loading="lazy"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/10 to-background" />
        <div
          className={
            align === "left"
              ? "absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent"
              : "absolute inset-0 bg-gradient-to-l from-background/85 via-background/30 to-transparent"
          }
        />
      </motion.div>

      {/* Giant index number — foreground, fast parallax */}
      <motion.div
        style={{ y: numberY, opacity: numberOpacity }}
        className={`pointer-events-none absolute top-1/2 ${align === "left" ? "right-[-4%]" : "left-[-4%]"} -translate-y-1/2 font-display text-[28vw] leading-none text-gold`}
      >
        {String(index).padStart(2, "0")}
      </motion.div>

      {/* Midground card — opposite parallax */}
      <motion.div
        style={{ y: cardY }}
        className={`sticky top-0 flex h-screen items-center px-8 md:px-20 ${align === "right" ? "justify-end" : "justify-start"}`}
      >
        <div className={`relative z-10 max-w-xl ${align === "right" ? "text-right" : "text-left"}`}>
          <RevealText className="mb-5 text-xs uppercase tracking-[0.5em] text-gold">
            {eyebrow}
          </RevealText>
          <RevealText delay={0.1} as="h2" className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-foreground">
            {title}
          </RevealText>
          {titleItalic && (
            <RevealText delay={0.2} as="h2" className="font-display italic text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] gradient-gold-text">
              {titleItalic}
            </RevealText>
          )}
          <RevealText delay={0.35} as="p" className="mt-8 text-base leading-relaxed text-foreground/75 text-balance">
            {description}
          </RevealText>

          <motion.dl
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-10 grid grid-cols-3 gap-6 border-t border-border/50 pt-6 ${align === "right" ? "text-right" : "text-left"}`}
          >
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="mt-2 font-display text-2xl text-foreground">{m.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  );
}