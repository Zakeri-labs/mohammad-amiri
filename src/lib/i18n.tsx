import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";

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
        title: "سلام،",
        italic: "من، محمد امیری.",
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
        title: "بنشین لحظه‌ای،",
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
        title: "قبل از رفتن،",
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
      hi: "من، محمد امیری.",
      tag: "خانه را به شما می‌سپارم.",
      bio: "مرجع شماره ۱ شما برای سرمایه‌گذاری در املاک دبی. کارشناس رسمی اداره‌ی املاک و اراضی دبی با شماره RERA ۸۰۹۷۸، نماینده‌ی رسمی شرکت‌های سازنده‌ی دبی و تحلیل‌گر مستقل بازار. هر معامله را مثل خانه‌ی خودم انتخاب می‌کنم.",
      stats: [
        { label: "RERA", value: "۸۰۹۷۸" },
        { label: "تحلیل بازار", value: "روزانه" },
        { label: "زبان‌ها", value: "FA · EN · AR" },
      ],
      cta: "شروع یک گفت‌وگوی آرام",
    },
    marquee1: ["انتخاب محمد", "·", "داون‌تاون", "·", "پالم جمیرا", "·", "مارینا", "·", "ذخیره‌گاه کویر", "·"],
    marquee2: ["رزرو", "·", "بازدید خصوصی با محمد", "·"],
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
      directLabel: "تماس / واتساپ",
      direct: "+۹۷۱ ۵۲ ۱۰۴ ۲۲۲۲",
      emailLabel: "ایمیل",
      email: "mohammad@amiri.ae",
      copyright: "© ۲۰۲۶ محمد امیری · با وقت قبلی، به هر زبانی",
    },
    properties: {
      eyebrow: "پورتفولیوی محمد",
      titleA: "املاک",
      titleB: "منتخب من.",
      body: "پروژه‌هایی که شخصاً بازدید کرده‌ام، با سازنده‌ها مذاکره کرده‌ام و برای سرمایه‌گذاران و خانواده‌ها مناسب می‌دانم. فیلتر کن — همه به‌روز و رسمی.",
      filters: { all: "همه", area: "منطقه", type: "نوع", any: "همه", price: "بازه‌ی قیمت", reset: "بازنشانی", from: "از", to: "تا" },
      areas: ["داون‌تاون", "پالم جمیرا", "مارینا", "بیزنس‌بِی", "جمیرا"],
      types: ["آپارتمان", "پنت‌هاوس", "ویلا", "تاون‌هاوس"],
      cta: "درخواست بازدید خصوصی",
      bedroomsLabel: "خواب",
      areaLabel: "متراژ m²",
      handover: "تحویل",
      items: [
        { name: "Burj Royale Sky", area: "داون‌تاون", type: "پنت‌هاوس", bedrooms: "۴", sqm: "۶۴۰", price: "از $۸.۴M", priceUsd: 8400000, handover: "۲۰۲۶" },
        { name: "Palm Jewel Villa", area: "پالم جمیرا", type: "ویلا", bedrooms: "۶", sqm: "۱٬۸۲۰", price: "از $۲۲M", priceUsd: 22000000, handover: "آماده" },
        { name: "Marina Light Tower", area: "مارینا", type: "آپارتمان", bedrooms: "۲", sqm: "۱۵۸", price: "از $۱.۹M", priceUsd: 1900000, handover: "۲۰۲۷" },
        { name: "Bay Residence 12", area: "بیزنس‌بِی", type: "آپارتمان", bedrooms: "۳", sqm: "۲۲۰", price: "از $۲.۸M", priceUsd: 2800000, handover: "۲۰۲۶" },
        { name: "Jumeirah Garden Townhouse", area: "جمیرا", type: "تاون‌هاوس", bedrooms: "۴", sqm: "۴۸۰", price: "از $۳.۶M", priceUsd: 3600000, handover: "آماده" },
        { name: "Downtown Opera Penthouse", area: "داون‌تاون", type: "پنت‌هاوس", bedrooms: "۵", sqm: "۸۲۰", price: "از $۱۲M", priceUsd: 12000000, handover: "۲۰۲۶" },
        { name: "Marina Yacht Loft", area: "مارینا", type: "آپارتمان", bedrooms: "۱", sqm: "۹۸", price: "از $۹۲۰K", priceUsd: 920000, handover: "آماده" },
        { name: "Palm Beachfront Mansion", area: "پالم جمیرا", type: "ویلا", bedrooms: "۷", sqm: "۲٬۴۰۰", price: "از $۳۸M", priceUsd: 38000000, handover: "۲۰۲۷" },
      ],
    },
    agency: {
      eyebrow: "آژانس محمد امیری",
      titleA: "یک تیم کوچک،",
      titleB: "خدمت بزرگ.",
      body: "ما در دل دبی، در یک دفتر معماری‌شده روبه‌روی برج خلیفه فعالیت می‌کنیم. تحلیل بازار، مذاکره با سازنده، خدمات حقوقی، طراحی داخلی و مدیریت اجاره — همگی زیر یک سقف.",
      pillars: [
        { k: "تحلیل بازار", v: "گزارش هفتگی به مالکان" },
        { k: "مذاکره", v: "تخفیف رسمی سازنده" },
        { k: "خدمات حقوقی", v: "ثبت و انتقال در DLD" },
        { k: "مدیریت اجاره", v: "بازدهی ۸–۱۲٪" },
      ],
      stats: [
        { k: "ارزش معاملات", v: "$۴۲۰M+" },
        { k: "مالکان فعال", v: "۲۱۰+" },
        { k: "سال تجربه", v: "۹" },
      ],
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
      directLabel: "Direct / WhatsApp",
      direct: "+971 52 104 2222",
      emailLabel: "Email",
      email: "mohammad@amiri.ae",
      copyright: "© 2026 Mohammad Amiri · By appointment, in any language",
    },
    properties: {
      eyebrow: "Mohammad's portfolio",
      titleA: "Selected",
      titleB: "residences.",
      body: "Projects I've toured personally, negotiated directly with developers, and would recommend to my own family. Filter freely — every listing is official and up to date.",
      filters: { all: "All", area: "Area", type: "Type", any: "Any", price: "Price range", reset: "Reset", from: "From", to: "To" },
      areas: ["Downtown", "Palm Jumeirah", "Marina", "Business Bay", "Jumeirah"],
      types: ["Apartment", "Penthouse", "Villa", "Townhouse"],
      cta: "Request a private viewing",
      bedroomsLabel: "Beds",
      areaLabel: "Area m²",
      handover: "Handover",
      items: [
        { name: "Burj Royale Sky", area: "Downtown", type: "Penthouse", bedrooms: "4", sqm: "640", price: "From $8.4M", priceUsd: 8400000, handover: "2026" },
        { name: "Palm Jewel Villa", area: "Palm Jumeirah", type: "Villa", bedrooms: "6", sqm: "1,820", price: "From $22M", priceUsd: 22000000, handover: "Ready" },
        { name: "Marina Light Tower", area: "Marina", type: "Apartment", bedrooms: "2", sqm: "158", price: "From $1.9M", priceUsd: 1900000, handover: "2027" },
        { name: "Bay Residence 12", area: "Business Bay", type: "Apartment", bedrooms: "3", sqm: "220", price: "From $2.8M", priceUsd: 2800000, handover: "2026" },
        { name: "Jumeirah Garden Townhouse", area: "Jumeirah", type: "Townhouse", bedrooms: "4", sqm: "480", price: "From $3.6M", priceUsd: 3600000, handover: "Ready" },
        { name: "Downtown Opera Penthouse", area: "Downtown", type: "Penthouse", bedrooms: "5", sqm: "820", price: "From $12M", priceUsd: 12000000, handover: "2026" },
        { name: "Marina Yacht Loft", area: "Marina", type: "Apartment", bedrooms: "1", sqm: "98", price: "From $920K", priceUsd: 920000, handover: "Ready" },
        { name: "Palm Beachfront Mansion", area: "Palm Jumeirah", type: "Villa", bedrooms: "7", sqm: "2,400", price: "From $38M", priceUsd: 38000000, handover: "2027" },
      ],
    },
    agency: {
      eyebrow: "Mohammad Amiri Agency",
      titleA: "A small team,",
      titleB: "an outsized service.",
      body: "We operate from an architected office in the heart of Dubai, facing the Burj Khalifa. Market analysis, developer negotiation, legal services, interior design and rental management — all under one roof.",
      pillars: [
        { k: "Market analysis", v: "Weekly owner reports" },
        { k: "Negotiation", v: "Official developer discounts" },
        { k: "Legal services", v: "DLD registration & transfer" },
        { k: "Rental management", v: "8–12% yield" },
      ],
      stats: [
        { k: "Volume closed", v: "$420M+" },
        { k: "Active owners", v: "210+" },
        { k: "Years experience", v: "9" },
      ],
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
      className={`inline-flex items-center gap-2 rounded-full border border-gold/60 px-4 py-2.5 font-display text-[13px] text-gold transition-all hover:bg-gold/10 md:px-5 md:py-3 md:text-[14px] ${className}`}
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" strokeWidth={2} />
      <span>{lang === "fa" ? "English" : "فارسی"}</span>
    </button>
  );
}
