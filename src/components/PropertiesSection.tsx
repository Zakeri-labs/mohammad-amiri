import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Home as HomeIcon, RotateCcw, DollarSign, SlidersHorizontal, ChevronUp } from "lucide-react";
import { useT } from "@/lib/i18n";
import { RevealText } from "./RevealText";
import { Slider } from "@/components/ui/slider";
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
  priceUsd: number;
  handover: string;
};

export function PropertiesSection() {
  const { t, lang } = useT();
  const data = t<any>("properties");
  const items = data.items as Item[];
  const areas: string[] = data.areas;
  const types: string[] = data.types;

  const priceBounds = useMemo(() => {
    const prices = items.map((it) => it.priceUsd);
    const min = Math.floor(Math.min(...prices) / 100_000) * 100_000;
    const max = Math.ceil(Math.max(...prices) / 100_000) * 100_000;
    return [min, max] as [number, number];
  }, [items]);

  const [area, setArea] = useState<string>("__all");
  const [type, setType] = useState<string>("__all");
  const [priceRange, setPriceRange] = useState<[number, number]>(priceBounds);

  // Sticky-collapse behavior. We watch a sentinel placed just above the
  // filter card; when it scrolls out of view, the filter is "stuck" and we
  // auto-collapse to a slim pill to give the property grid more room.
  // The user can expand on tap; any subsequent scroll re-collapses it.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-collapse on scroll while expanded + stuck.
  useEffect(() => {
    if (!expanded || !isStuck) return;
    let last = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - last) > 80) setExpanded(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [expanded, isStuck]);

  // When un-sticking (filter card back in its natural place), force expanded.
  useEffect(() => {
    if (!isStuck) setExpanded(false);
  }, [isStuck]);

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (area === "__all" || it.area === area) &&
          (type === "__all" || it.type === type) &&
          it.priceUsd >= priceRange[0] &&
          it.priceUsd <= priceRange[1],
      ),
    [items, area, type, priceRange],
  );

  const priceActive = priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1];
  const anyActive = area !== "__all" || type !== "__all" || priceActive;
  const resetAll = () => {
    setArea("__all");
    setType("__all");
    setPriceRange(priceBounds);
  };
  const activeCount = (area !== "__all" ? 1 : 0) + (type !== "__all" ? 1 : 0) + (priceActive ? 1 : 0);
  const collapsed = isStuck && !expanded;
  const formatPrice = (n: number) => {
    const inMillions = n / 1_000_000;
    const num = inMillions >= 1 ? `${inMillions.toFixed(inMillions >= 10 ? 0 : 1)}M` : `${Math.round(n / 1000)}K`;
    const localized = lang === "fa" ? num.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]) : num;
    return `$${localized}`;
  };

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

        {/* Sentinel — drives isStuck detection */}
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />

        {/* Filter card */}
        <motion.div
          layout
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`sticky top-[64px] z-30 mb-10 overflow-hidden border border-border/60 bg-card/90 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl md:top-[80px] md:mb-14 ${
            collapsed ? "rounded-full p-2" : "rounded-2xl p-5 md:p-7"
          }`}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex w-full items-center justify-between gap-3 rounded-full px-3 py-1.5 text-foreground/85 transition-colors hover:text-gold"
              aria-label="Expand filters"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>{data.filters.area} · {data.filters.type} · {data.filters.price}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                {activeCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 font-mono text-[10px] font-bold text-black">
                    {activeCount}
                  </span>
                )}
                <span className="font-display text-sm text-gold">{filtered.length}</span>
                <span className="font-mono text-[10px] text-muted-foreground">/ {items.length}</span>
              </span>
            </button>
          ) : (
            <>
          <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-[1fr_1fr_1.2fr]">
            <FilterGroup
              icon={<MapPin className="h-3.5 w-3.5" />}
              label={data.filters.area}
              options={["__all", ...areas]}
              allLabel={data.filters.all}
              active={area}
              onChange={setArea}
            />
            <FilterGroup
              icon={<HomeIcon className="h-3.5 w-3.5" />}
              label={data.filters.type}
              options={["__all", ...types]}
              allLabel={data.filters.all}
              active={type}
              onChange={setType}
            />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
                  <DollarSign className="h-3.5 w-3.5 text-gold" />
                  <span>{data.filters.price}</span>
                </div>
                <div className="font-display text-[13px] text-foreground/80">
                  {formatPrice(priceRange[0])} <span className="text-muted-foreground">—</span> {formatPrice(priceRange[1])}
                </div>
              </div>
              <Slider
                dir="ltr"
                min={priceBounds[0]}
                max={priceBounds[1]}
                step={100_000}
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                className="mt-1"
              />
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                <span>{formatPrice(priceBounds[0])}</span>
                <span>{formatPrice(priceBounds[1])}</span>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/50 pt-4">
            {anyActive ? (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
              >
                <RotateCcw className="h-3 w-3" />
                {data.filters.reset}
              </button>
            ) : <span />}
            {isStuck && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/10"
                aria-label="Collapse filters"
              >
                <ChevronUp className="h-3 w-3" />
                {data.filters.reset === "بازنشانی" ? "بستن" : "Collapse"}
              </button>
            )}
          </div>
            </>
          )}
        </motion.div>

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
      className={`rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] transition-colors ${
        active
          ? "border-gold bg-gold text-black"
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
