import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useT } from "@/lib/i18n";
import { RevealText } from "./RevealText";
import skyline from "@/assets/dubai-skyline.jpg";
import palm from "@/assets/dubai-palm.jpg";
import penthouse from "@/assets/dubai-penthouse.jpg";
import marina from "@/assets/dubai-marina.jpg";
import desert from "@/assets/dubai-desert.jpg";

const IMAGES = [skyline, palm, marina, penthouse, desert, skyline, marina, palm];

type Item = {
  name: string;
  area: string;
  type: string;
  bedrooms: string;
  sqm: string;
  price: string;
  handover: string;
};

export function PropertiesSection() {
  const { t } = useT();
  const data = t<any>("properties");
  const items = data.items as Item[];
  const areas: string[] = data.areas;
  const types: string[] = data.types;

  const [area, setArea] = useState<string>("__all");
  const [type, setType] = useState<string>("__all");

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (area === "__all" || it.area === area) &&
          (type === "__all" || it.type === type),
      ),
    [items, area, type],
  );

  return (
    <section id="properties" className="relative w-full bg-background px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl md:mb-10">
          <RevealText className="mb-3 text-[10px] uppercase tracking-[0.4em] text-gold md:text-xs md:tracking-[0.5em]">
            {data.eyebrow}
          </RevealText>
          <RevealText as="h2" className="font-display text-[clamp(1.9rem,5vw,3.6rem)] leading-[1.05] text-foreground">
            {data.titleA}
          </RevealText>
          <RevealText delay={0.1} as="h2" className="font-display italic text-[clamp(1.9rem,5vw,3.6rem)] leading-[1.05] gradient-gold-text">
            {data.titleB}
          </RevealText>
          <RevealText delay={0.25} as="p" className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 md:text-[15px]">
            {data.body}
          </RevealText>
        </div>

        {/* Filter rail */}
        <div className="sticky top-[68px] z-30 mb-8 -mx-5 flex flex-wrap items-center gap-2.5 border-y border-border/40 bg-background/85 px-5 py-3.5 backdrop-blur-xl md:top-[84px] md:mb-10 md:-mx-16 md:gap-5 md:px-16 md:py-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {data.filters.area}
          </span>
          <FilterChip label={data.filters.all} active={area === "__all"} onClick={() => setArea("__all")} />
          {areas.map((a) => (
            <FilterChip key={a} label={a} active={area === a} onClick={() => setArea(a)} />
          ))}
          <span className="mx-2 hidden h-4 w-px bg-border md:block" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {data.filters.type}
          </span>
          <FilterChip label={data.filters.all} active={type === "__all"} onClick={() => setType("__all")} />
          {types.map((tp) => (
            <FilterChip key={tp} label={tp} active={type === tp} onClick={() => setType(tp)} />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {filtered.map((it, i) => (
            <motion.article
              key={it.name}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-sm border border-border/40 bg-card/40 backdrop-blur"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={IMAGES[i % IMAGES.length]}
                  alt={it.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
                <span className="absolute top-3 inline-flex rounded-sm border border-gold/50 bg-background/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-gold backdrop-blur md:top-4 ltr:left-3 ltr:md:left-4 rtl:right-3 rtl:md:right-4">
                  {it.type}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{it.area}</div>
                <h3 className="mt-2 font-display text-xl text-foreground md:text-2xl">{it.name}</h3>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/50 pt-4 text-xs text-foreground/70">
                  <Meta k={data.bedroomsLabel} v={it.bedrooms} />
                  <Meta k={data.areaLabel} v={it.sqm} />
                  <Meta k={data.handover} v={it.handover} />
                </div>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <span className="font-display text-lg text-gold md:text-xl">{it.price}</span>
                  <a
                    href="#contact"
                    className="rounded-sm border border-gold/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/10"
                  >
                    {data.cta}
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
        active
          ? "border-gold bg-gold/15 text-gold"
          : "border-border/60 text-foreground/70 hover:border-gold/50 hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{k}</div>
      <div className="mt-1 font-display text-base text-foreground md:text-lg">{v}</div>
    </div>
  );
}