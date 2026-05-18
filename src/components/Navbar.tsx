import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LangToggle, useT } from "@/lib/i18n";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  const { t, lang } = useT();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/40 bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-background/55 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 md:h-[84px] md:px-10">
        <Logo />
        <div className="flex items-center gap-2.5 md:gap-4">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/60 lg:inline">
            {t<string>("rera")}
          </span>
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gold py-2.5 ps-4 pe-2.5 text-primary-foreground transition-all hover:shadow-[0_18px_40px_-12px_oklch(0.78_0.13_78/0.85)] md:py-3 md:ps-5 md:pe-3"
          >
            <span className="font-display text-[13px] tracking-tight md:text-[15px]">
              {lang === "fa" ? "رزرو مشاوره" : "Book a consultation"}
            </span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform group-hover:rotate-45 md:h-8 md:w-8">
              <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </span>
          </a>
          <LangToggle />
        </div>
      </div>
    </header>
  );
}