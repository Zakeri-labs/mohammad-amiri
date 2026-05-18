import { useT } from "@/lib/i18n";

export function Logo({ className = "" }: { className?: string }) {
  const { lang } = useT();
  return (
    <a href="/" className={`group flex items-center gap-3 ${className}`} aria-label="Mohammad Amiri">
      <span className="relative inline-flex h-9 w-9 items-center justify-center md:h-10 md:w-10">
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="ma-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="oklch(0.78 0.13 78)" />
              <stop offset="100%" stopColor="oklch(0.92 0.14 90)" />
            </linearGradient>
          </defs>
          <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="3" fill="none" stroke="url(#ma-g)" strokeWidth="1.2" />
          <path
            d="M9 28 V13 L16 24 L23 13 V28 M27 28 L31.5 13 L36 28 M28.6 23 H34.4"
            fill="none"
            stroke="url(#ma-g)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[15px] text-foreground md:text-base">
          {lang === "fa" ? "محمد امیری" : "Mohammad Amiri"}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold/80">
          {lang === "fa" ? "املاک دبی" : "Dubai Properties"}
        </span>
      </span>
    </a>
  );
}