import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LangToggle, useT } from "@/lib/i18n";
import { CalendarCheck } from "lucide-react";

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
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-display text-[13px] text-black shadow-[0_10px_30px_-10px_oklch(0.78_0.13_78/0.8)] transition-all hover:bg-gold/90 hover:shadow-[0_16px_40px_-10px_oklch(0.78_0.13_78/0.95)] md:px-6 md:py-3 md:text-[15px]"
          >
            <CalendarCheck className="h-4 w-4" strokeWidth={2.25} />
            <span>{lang === "fa" ? "رزرو مشاوره" : "Book a consultation"}</span>
          </a>
          <LangToggle />
        </div>
      </div>
    </header>
  );
}