import { useT } from "@/lib/i18n";
import maLogo from "@/assets/ma-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  const { lang } = useT();
  return (
    <a href="/" className={`group flex items-center gap-3 ${className}`} aria-label="Mohammad Amiri">
      <span className="relative inline-flex h-11 w-11 items-center justify-center md:h-12 md:w-12">
        <img
          src={maLogo}
          alt="MA"
          width={48}
          height={48}
          className="h-full w-full object-contain drop-shadow-[0_2px_8px_oklch(0.78_0.13_78/0.35)] transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[15px] text-foreground md:text-[17px]">
          {lang === "fa" ? "محمد امیری" : "Mohammad Amiri"}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-gold/80">
          {lang === "fa" ? "املاک لوکس دبی" : "Dubai Real Estate"}
        </span>
      </span>
    </a>
  );
}