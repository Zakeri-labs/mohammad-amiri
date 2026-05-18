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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-10">
        <Logo />
        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 md:inline">
            {t<string>("rera")}
          </span>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-sm border border-gold/60 bg-gold/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold transition-all hover:bg-gold hover:text-primary-foreground md:px-4 md:py-2.5 md:text-[11px]"
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            <span>{lang === "fa" ? "رزرو مشاوره" : "Book Consultant"}</span>
          </a>
          <LangToggle />
        </div>
      </div>
    </header>
  );
}