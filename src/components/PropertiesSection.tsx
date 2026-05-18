import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Home as HomeIcon, RotateCcw } from "lucide-react";
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
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-2xl">
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
          <div className="flex shrink-0 items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="font-display text-3xl text-gold md:text-4xl">{filtered.length}</span>
            <span>/ {items.length}</span>
          </div>
        </div>

        {/* Filter card */}
        <div className="sticky top-[72px] z-30 mb-8 rounded-md border border-border/60 bg-card/80 p-4 backdrop-blur-xl md:top-[88px] md:mb-12 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
            <FilterGroup
              icon={<MapPin className="h-3.5 w-3.5" />}
              label={data.filters.area}
              options={["__all", ...areas]}
              allLabel={data.filters.all}
              active={area}
              onChange={setArea}
            />
            <div className="hidden w-px shrink-0 bg-border/60 md:block" />
            <FilterGroup
              icon={<HomeIcon className="h-3.5 w-3.5" />}
              label={data.filters.type}
              options={["__all", ...types]}
              allLabel={data.filters.all}
              active={type}
              onChange={setType}
            />
            {(area !== "__all" || type !== "__all") && (
              <button
                type="button"
                onClick={() => { setArea("__all"); setType("__all"); }}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-sm border border-border/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold md:self-center"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
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
      className={`rounded-sm border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] transition-colors ${
        active
          ? "border-gold bg-gold text-primary-foreground"
          : "border-border/60 text-foreground/70 hover:border-gold/50 hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}

function FilterGroup({
  icon,
  label,
  options,
  allLabel,
  active,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  options: string[];
  allLabel: string;
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2.5">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
        <span className="text-gold">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {options.map((opt) => (
          <FilterChip
            key={opt}
            label={opt === "__all" ? allLabel : opt}
            active={active === opt}
            onClick={() => onChange(opt)}
          />
        ))}
      </div>
    </div>
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