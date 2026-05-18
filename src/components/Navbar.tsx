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
            className="group inline-flex items-center gap-2 rounded-sm border border-gold bg-gold px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.78_0.13_78/0.7)] transition-all hover:bg-gold/90 hover:shadow-[0_12px_30px_-8px_oklch(0.78_0.13_78/0.9)] md:px-6 md:py-3.5 md:text-[12px]"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>{lang === "fa" ? "رزرو مشاوره" : "Book Consultant"}</span>
          </a>
          <LangToggle />
        </div>
      </div>
    </header>
  );
}