import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fa" | "en";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <T = string>(key: string) => T;
  dir: "rtl" | "ltr";
};

const LangCtx = createContext<Ctx | null>(null);

export const dict = {
  fa: {
    brand: "املاک دبی · محمد امیری",
    hostedBy: "میزبان: محمد امیری",
    rera: "RERA: ۸۰۹۷۸",
    langToggle: "EN",
    meetMe: "مشاوره با من",
    scrollHint: "اسکرول کن — خانه را نشانت می‌دهم",
    yourAdvisor: "مشاور خصوصی شما",
    advisorName: "محمد امیری",
    advisorRoleShort: "کارشناس رسمی املاک دبی · RERA ۸۰۹۷۸",
    chapters: [
      {
        eyebrow: "میزبان: محمد امیری",
        title: "سلام —",
        italic: "من محمد امیری‌ام.",
        body: "مرجع شماره ۱ شما برای سرمایه‌گذاری در املاک دبی. کارشناس رسمی اداره املاک و اراضی دبی (RERA: ۸۰۹۷۸)، نماینده‌ی رسمی شرکت‌های سازنده و تحلیل‌گر بازار. اجازه بدهید یکی از پروژه‌هایم را همان‌طور که برای دوستانم تعریف می‌کنم، به شما نشان دهم.",
      },
      {
        eyebrow: "۰۲ — تا طبقه‌ی ۱۱۲",
        title: "با من قدم بگذار،",
        italic: "آسمان باز می‌شود.",
        body: "یک آسانسور خصوصی، یک مکث کوتاه، و درها کنار می‌روند. لحظه‌ی موردعلاقه‌ی من؛ جایی که شهر سکوت می‌کند و نور حرف می‌زند.",
      },
      {
        eyebrow: "۰۳ — اتاق آسمان",
        title: "بنشین لحظه‌ای —",
        italic: "این اتاق مال توست.",
        body: "این واحد را به یک دلیل انتخاب کردم: چرخش ۲۷۰ درجه از طلوع تا خط افق شهر. مرمر کالاکاتا، برنز دستی، و نمایی که هیچ‌گاه تکرار نمی‌شود.",
        bullets: ["سقف · ۴.۲ متر", "دید · ۲۷۰°", "مرمر · کالاکاتا"],
      },
      {
        eyebrow: "۰۴ — سر میز من",
        title: "برای شام بمان،",
        italic: "شهر همان نماست.",
        body: "میز چهار متری کالاکاتا زیر آویز برنزی دست‌ساز — جایی که شب تحویل کلید، میزبان مالکانم می‌شوم. شما هم دعوتید.",
        bullets: ["ظرفیت · ۱۲ نفر", "آویز · برنز دست‌ساز", "میز · ۴ متر کالاکاتا"],
      },
      {
        eyebrow: "۰۵ — یک اتاق دیگر",
        title: "قبل از رفتن —",
        italic: "صحنه‌ی آشپز.",
        body: "جزیره‌ی پنج متری، تجهیزات یکپارچه‌ی Gaggenau، و نور گرمی که هنگام غروب نرم می‌شود. هر زمان آماده بودی، دم در منتظرم.",
        bullets: ["جزیره · ۵ متر", "تجهیزات · Gaggenau", "شیرآلات · برنج خالص"],
      },
    ],
    stats: [
      { label: "از", value: "$۸.۴M" },
      { label: "متراژ", value: "۶۴۰" },
      { label: "طبقه", value: "۸۴" },
    ],
    advisor: {
      eyebrow: "مشاور شما",
      hi: "من محمد امیری‌ام.",
      tag: "خانه نمی‌فروشم — می‌سپارم.",
      bio: "مرجع شماره ۱ شما برای سرمایه‌گذاری در املاک دبی. کارشناس رسمی اداره‌ی املاک و اراضی دبی با شماره RERA ۸۰۹۷۸، نماینده‌ی رسمی شرکت‌های سازنده‌ی دبی و تحلیل‌گر مستقل بازار. هر معامله را مثل خانه‌ی خودم انتخاب می‌کنم.",
      stats: [
        { label: "RERA", value: "۸۰۹۷۸" },
        { label: "تحلیل بازار", value: "روزانه" },
        { label: "زبان‌ها", value: "FA · EN · AR" },
      ],
      cta: "شروع یک گفت‌وگوی آرام",
    },
    marquee1: ["انتخاب محمد", "·", "داون‌تاون", "·", "پالم جمیرا", "·", "مارینا", "·", "ذخیره‌گاه کویر", "·"],
    marquee2: ["رزرو", "—", "بازدید خصوصی با محمد", "—"],
    scenes: [
      {
        eyebrow: "اول · داون‌تاون",
        title: "بالاتر از",
        italic: "ابرها.",
        description: "نخستین تماس من برای کسانی که خط افق دبی را در ارتفاع چشم می‌خواهند. برج بلندمرتبه‌ی خصوصی در سایه‌ی برج خلیفه — سقف‌های سه‌گانه، استخر آسمانی و همسایگانی که هرگز در نمی‌زنند.",
        meta: [
          { label: "از", value: "$۸.۴M" },
          { label: "متراژ", value: "۶۴۰" },
          { label: "طبقه", value: "۸۴" },
        ],
      },
      {
        eyebrow: "دوم · پالم جمیرا",
        title: "یک جزیره",
        italic: "برای یک نفر.",
        description: "برای خانواده‌هایی که می‌خواهند دریا انتهای راهرو خانه باشد. ویلای ساحلی روی شاخه‌های پالم، لنگرگاه خصوصی، باغ‌های فرورفته و دروازه‌ای که راننده‌ات را می‌شناسد.",
        meta: [
          { label: "از", value: "$۲۲M" },
          { label: "زمین م²", value: "۱۸۲۰" },
          { label: "نمای ساحل", value: "۳۸m" },
        ],
      },
      {
        eyebrow: "سوم · پنت‌هاوس",
        title: "داخلی‌هایی",
        italic: "چون سینما.",
        description: "ذخیره‌ی من برای مالکانی که نما را پیش‌تر مالک شده‌اند. مرمر هم‌جنس، برنز دست‌سای و نوری که برای شب طراحی شده — یک پلاتوی سینمایی خصوصی با موسیقی متن شهر.",
        meta: [
          { label: "از", value: "$۱۲M" },
          { label: "سقف", value: "۴.۲m" },
          { label: "سوئیت", value: "۵" },
        ],
      },
      {
        eyebrow: "چهارم · مارینا",
        title: "در لبه‌ی",
        italic: "آب.",
        description: "برای مالکانی که بیشتر با کشتی سفر می‌کنند تا اتومبیل. برج‌های باریک رو به مارینا — از آسانسور تا یاوت در کمتر از یک دقیقه؛ مذاکره‌ی موردعلاقه‌ی من.",
        meta: [
          { label: "از", value: "$۴.۶M" },
          { label: "لنگرگاه m", value: "۳۰" },
          { label: "طبقات", value: "۷۲" },
        ],
      },
      {
        eyebrow: "پنجم · ذخیره‌گاه کویر",
        title: "آرام،",
        italic: "بیرون از شهر.",
        description: "برای خریداری که سکوت می‌خواهد. ملکی خصوصی جایی که تپه‌های شنی به پاویون شیشه‌ای می‌رسند، خط افق شهر یک نوار نقره‌ای دور است و تنها صدا، باد همان‌جایی‌ست که من بزرگ شدم.",
        meta: [
          { label: "از", value: "$۱۸M" },
          { label: "ایکر", value: "۶.۲" },
          { label: "واحد", value: "۱۲" },
        ],
      },
    ],
    footer: {
      eyebrow: "مستقیم به محمد بنویس",
      titleA: "یک گفت‌وگوی",
      titleB: "آرام را آغاز کن.",
      body: "بدون فرم، بدون زنجیره‌ی دستیار. پیام تو مستقیم به موبایل من می‌رسد — همان روز پاسخ می‌دهم؛ به زبانی که ترجیح می‌دهی.",
      role: "نماینده‌ی رسمی · RERA ۸۰۹۷۸",
      directLabel: "تماس",
      direct: "+۹۷۱ ۵۰ ۰۰۰ ۰۰۰۰",
      emailLabel: "ایمیل",
      email: "mohammad@amiri.ae",
      copyright: "© ۲۰۲۶ محمد امیری · با وقت قبلی، به هر زبانی",
    },
  },
  en: {
    brand: "Dubai Properties · Mohammad Amiri",
    hostedBy: "Hosted by Mohammad Amiri",
    rera: "RERA: 80978",
    langToggle: "فا",
    meetMe: "Meet me",
    scrollHint: "Scroll — I'll show you the residence",
    yourAdvisor: "Your private advisor",
    advisorName: "Mohammad Amiri",
    advisorRoleShort: "Certified Dubai broker · RERA 80978",
    chapters: [
      {
        eyebrow: "Hosted by Mohammad Amiri",
        title: "Hello —",
        italic: "I'm Mohammad.",
        body: "Your #1 reference for property investment in Dubai. Officially certified by the Dubai Land Department (RERA: 80978), official representative of Dubai's leading developers, and an independent market analyst. Let me walk you through one of mine.",
      },
      {
        eyebrow: "02 — Up to the 112th",
        title: "Step in with me,",
        italic: "the sky opens.",
        body: "A private elevator, a quiet pause, and the doors part. The moment I love most — when the city falls silent and the light does the talking.",
      },
      {
        eyebrow: "03 — The Sky Room",
        title: "Sit a moment —",
        italic: "the room is yours.",
        body: "I chose this residence for one reason: the 270° turn from sunrise to skyline. Bookmatched Calacatta, hand-rubbed bronze, a horizon that never repeats.",
        bullets: ["Ceilings · 4.2 m", "View · 270°", "Marble · Calacatta"],
      },
      {
        eyebrow: "04 — At My Table",
        title: "Stay for dinner,",
        italic: "the city is the view.",
        body: "A four-metre Calacatta table under hand-blown brass — where I host my owners on the night they collect their keys. You're invited too.",
        bullets: ["Seats · 12", "Pendants · hand-blown brass", "Table · 4 m Calacatta"],
      },
      {
        eyebrow: "05 — One More Room",
        title: "Before we go —",
        italic: "the chef's stage.",
        body: "A five-metre honed island, integrated Gaggenau, and warm under-cabinet light that softens at dusk. When you're ready, I'll meet you at the door.",
        bullets: ["Island · 5 m", "Appliances · Gaggenau", "Fixtures · solid brass"],
      },
    ],
    stats: [
      { label: "From", value: "$8.4M" },
      { label: "Sky m²", value: "640" },
      { label: "Level", value: "84F" },
    ],
    advisor: {
      eyebrow: "Your advisor",
      hi: "I'm Mohammad.",
      tag: "I don't sell homes — I place them.",
      bio: "Your #1 reference for property investment in Dubai. Officially certified by the Dubai Land Department (RERA 80978), official representative of Dubai's developers, and an independent market analyst. Every deal I close, I would buy myself.",
      stats: [
        { label: "RERA", value: "80978" },
        { label: "Market analysis", value: "Daily" },
        { label: "Languages", value: "FA · EN · AR" },
      ],
      cta: "Start a quiet conversation",
    },
    marquee1: ["Mohammad's Selection", "·", "Downtown", "·", "Palm Jumeirah", "·", "Marina", "·", "Desert Reserve", "·"],
    marquee2: ["Reserve", "—", "A Private Viewing with Mohammad", "—"],
    scenes: [
      {
        eyebrow: "First · Downtown",
        title: "Above the",
        italic: "clouds.",
        description: "My first call when a buyer wants the skyline at eye level. A vertical sanctuary in the shadow of the Burj — triple-height interiors, private sky pools, neighbours who never knock.",
        meta: [
          { label: "From", value: "$8.4M" },
          { label: "Sky m²", value: "640" },
          { label: "Level", value: "84F" },
        ],
      },
      {
        eyebrow: "Second · Palm Jumeirah",
        title: "An island",
        italic: "of one.",
        description: "For families who want the sea at the end of the hallway. Beachfront on the fronds of the Palm, private moorings, sunken gardens — and a gate that knows your driver.",
        meta: [
          { label: "From", value: "$22M" },
          { label: "Plot m²", value: "1,820" },
          { label: "Frontage", value: "38m" },
        ],
      },
      {
        eyebrow: "Third · Penthouse",
        title: "Interiors",
        italic: "like cinema.",
        description: "The one I keep for clients who already own the view. Bookmatched marble, hand-rubbed bronze, lighting choreographed for nightfall — a private film set, scored by the city outside.",
        meta: [
          { label: "From", value: "$12M" },
          { label: "Ceiling", value: "4.2m" },
          { label: "Suites", value: "5" },
        ],
      },
      {
        eyebrow: "Fourth · Marina",
        title: "At the edge",
        italic: "of the water.",
        description: "For owners who travel by hull more than by car. Slim light-catching towers above the Marina promenade — elevator to yacht in under a minute, my favourite negotiation.",
        meta: [
          { label: "From", value: "$4.6M" },
          { label: "Berth m", value: "30" },
          { label: "Floors", value: "72" },
        ],
      },
      {
        eyebrow: "Fifth · Desert Reserve",
        title: "Quiet, just",
        italic: "outside.",
        description: "The one I save for the buyer who asks for silence. A private estate where the dunes meet a glass pavilion, the skyline a distant silver line — and the only sound is the wind I grew up with.",
        meta: [
          { label: "From", value: "$18M" },
          { label: "Acres", value: "6.2" },
          { label: "Residences", value: "12" },
        ],
      },
    ],
    footer: {
      eyebrow: "Write to Mohammad directly",
      titleA: "Begin a",
      titleB: "quiet conversation.",
      body: "No forms, no chains of assistants. Your note reaches my phone — I reply within the day, in the language you prefer.",
      role: "Official Broker · RERA 80978",
      directLabel: "Direct",
      direct: "+971 50 000 0000",
      emailLabel: "Email",
      email: "mohammad@amiri.ae",
      copyright: "© 2026 Mohammad Amiri · By appointment, in any language",
    },
  },
} as const;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fa");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || "fa";
    setLangState(stored === "en" ? "en" : "fa");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    document.documentElement.classList.toggle("lang-fa", lang === "fa");
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  };

  const t = <T,>(key: string): T => {
    const parts = key.split(".");
    let cur: any = dict[lang];
    for (const p of parts) cur = cur?.[p];
    return cur as T;
  };

  return (
    <LangCtx.Provider value={{ lang, setLang, t, dir: lang === "fa" ? "rtl" : "ltr" }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useT() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useT must be used within LanguageProvider");
  return ctx;
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useT();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "fa" ? "en" : "fa")}
      className={`rounded-sm border border-gold/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold/10 ${className}`}
      aria-label="Toggle language"
    >
      {lang === "fa" ? "EN" : "فا"}
    </button>
  );
}
