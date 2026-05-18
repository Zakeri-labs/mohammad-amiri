import { useT } from "@/lib/i18n";
import { RevealText } from "./RevealText";
import office from "@/assets/mohammad-office.jpg";

export function AgencySection() {
  const { t } = useT();
  const a = t<any>("agency");

  return (
    <section id="agency" className="relative w-full bg-background px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative">
          <img
            src={office}
            alt="Mohammad Amiri Agency"
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full rounded-sm object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-gold/20" />
          <dl className="absolute bottom-5 ltr:left-5 rtl:right-5 grid grid-cols-3 gap-4 rounded-sm border border-border/40 bg-background/70 p-4 backdrop-blur-md md:bottom-7 ltr:md:left-7 rtl:md:right-7 md:gap-6 md:p-5">
            {a.stats.map((s: { k: string; v: string }) => (
              <div key={s.k}>
                <dt className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground md:text-[10px]">{s.k}</dt>
                <dd className="mt-1 font-display text-base text-foreground md:text-lg">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <RevealText className="mb-5 text-[10px] uppercase tracking-[0.4em] text-gold md:text-xs md:tracking-[0.5em]">
            {a.eyebrow}
          </RevealText>
          <RevealText as="h2" className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] text-foreground">
            {a.titleA}
          </RevealText>
          <RevealText delay={0.1} as="h2" className="font-display italic text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] gradient-gold-text">
            {a.titleB}
          </RevealText>
          <RevealText delay={0.25} as="p" className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/70 md:text-base">
            {a.body}
          </RevealText>

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-12 md:gap-6">
            {a.pillars.map((p: { k: string; v: string }) => (
              <li key={p.k} className="border-t border-border/50 pt-4">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.k}</div>
                <div className="mt-2 font-display text-lg text-foreground md:text-xl">{p.v}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}