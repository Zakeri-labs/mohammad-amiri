import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/SmoothScroll";
import { HeroVideo } from "@/components/HeroVideo";
import { ParallaxScene } from "@/components/ParallaxScene";
import { HorizontalMarquee } from "@/components/HorizontalMarquee";
import { RevealText } from "@/components/RevealText";
import { PropertiesSection } from "@/components/PropertiesSection";
import { AgencySection } from "@/components/AgencySection";
import { motion } from "motion/react";
import skyline from "@/assets/dubai-skyline.jpg";
import palm from "@/assets/dubai-palm.jpg";
import penthouse from "@/assets/dubai-penthouse.jpg";
import marina from "@/assets/dubai-marina.jpg";
import desert from "@/assets/dubai-desert.jpg";
import advisor from "@/assets/mohammad-skyline.jpg";
import advisorAvatar from "@/assets/advisor-mohammad.jpg";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

const IMAGES = [skyline, palm, penthouse, marina, desert];
const ALIGNS: ("left" | "right")[] = ["left", "right", "left", "right", "left"];

function Index() {
  const { t } = useT();
  const advisorData = t<any>("advisor");
  const scenes = t<any[]>("scenes");
  const footer = t<any>("footer");
  const marquee1 = t<string[]>("marquee1");
  const marquee2 = t<string[]>("marquee2");

  return (
    <main className="relative min-h-screen w-full bg-background text-foreground">
      <SmoothScroll />

      <HeroVideo />

      {/* Advisor intro */}
      <section className="relative w-full overflow-hidden bg-background px-5 py-24 md:px-16 md:py-36">
        {/* Animated blurred backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 0.35, scale: 1 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${advisor})`, filter: "blur(38px) saturate(1.1)" }}
          />
          <motion.div
            aria-hidden
            animate={{
              background: [
                "radial-gradient(60% 50% at 20% 30%, oklch(0.78 0.13 78 / 0.18), transparent 60%)",
                "radial-gradient(60% 50% at 80% 70%, oklch(0.78 0.13 78 / 0.22), transparent 60%)",
                "radial-gradient(60% 50% at 20% 30%, oklch(0.78 0.13 78 / 0.18), transparent 60%)",
              ],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-16">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <img
                src={advisor}
                alt={t<string>("advisorName")}
                loading="lazy"
                decoding="async"
                width={800}
                height={1000}
                className="aspect-[4/5] w-full rounded-sm object-cover shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-gold/30" />
              <div className="pointer-events-none absolute -inset-3 -z-10 rounded-sm bg-gold/15 blur-2xl" />
            </motion.div>
          </div>
          <div>
            <RevealText className="mb-5 text-[10px] uppercase tracking-[0.4em] text-gold md:text-xs md:tracking-[0.5em]">
              {advisorData.eyebrow}
            </RevealText>
            <RevealText as="h2" className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] text-foreground">
              {advisorData.hi}
            </RevealText>
            <RevealText delay={0.12} as="h2" className="font-display italic text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] gradient-gold-text">
              {advisorData.tag}
            </RevealText>
            <RevealText delay={0.28} as="p" className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/85 md:mt-8 md:text-base">
              {advisorData.bio}
            </RevealText>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border/50 pt-5 md:mt-10 md:gap-8 md:pt-6">
              {advisorData.stats.map((s: { label: string; value: string }) => (
                <div key={s.label}>
                  <dt className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground md:text-[10px]">{s.label}</dt>
                  <dd className="mt-1.5 font-display text-xl text-foreground md:text-2xl">{s.value}</dd>
                </div>
              ))}
            </dl>

            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-3 rounded-sm border border-gold/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold/10"
            >
              {advisorData.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      <HorizontalMarquee words={marquee1} />

      <PropertiesSection />

      {scenes.map((scene, i) => (
        <ParallaxScene
          key={i}
          index={i + 1}
          image={IMAGES[i]}
          eyebrow={scene.eyebrow}
          title={scene.title}
          titleItalic={scene.italic}
          description={scene.description}
          meta={scene.meta}
          align={ALIGNS[i]}
        />
      ))}

      <AgencySection />

      <HorizontalMarquee words={marquee2} />

      <footer id="contact" className="relative border-t border-border/40 bg-background px-5 py-20 md:px-16 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <RevealText className="mb-5 text-[10px] uppercase tracking-[0.4em] text-gold md:text-xs md:tracking-[0.5em]">
              {footer.eyebrow}
            </RevealText>
            <RevealText as="h2" className="font-display text-4xl leading-tight text-foreground md:text-7xl">
              {footer.titleA}
            </RevealText>
            <RevealText delay={0.15} as="h2" className="font-display italic text-4xl leading-tight gradient-gold-text md:text-7xl">
              {footer.titleB}
            </RevealText>
            <RevealText delay={0.3} as="p" className="mt-6 max-w-md text-sm leading-relaxed text-foreground/70 md:mt-8">
              {footer.body}
            </RevealText>
          </div>
          <div className="flex flex-col justify-end gap-8 text-sm text-foreground/70">
            <div className="flex items-center gap-4 rounded-sm border border-border/40 bg-background/40 p-4 backdrop-blur md:p-5">
              <img
                src={advisorAvatar}
                alt={t<string>("advisorName")}
                width={56}
                height={56}
                className="h-14 w-14 flex-none rounded-full object-cover"
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{t<string>("advisorName")}</div>
                <div className="mt-1 font-display text-lg text-foreground">{footer.role}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 border-t border-border/50 pt-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{footer.directLabel}</div>
                <div className="mt-2 font-display text-lg text-foreground md:text-xl">{footer.direct}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{footer.emailLabel}</div>
                <div className="mt-2 font-display text-lg text-foreground md:text-xl">{footer.email}</div>
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {footer.copyright}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
