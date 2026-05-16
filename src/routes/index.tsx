import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/SmoothScroll";
import { HeroVideo } from "@/components/HeroVideo";
import { ParallaxScene } from "@/components/ParallaxScene";
import { HorizontalMarquee } from "@/components/HorizontalMarquee";
import { RevealText } from "@/components/RevealText";
import skyline from "@/assets/dubai-skyline.jpg";
import palm from "@/assets/dubai-palm.jpg";
import penthouse from "@/assets/dubai-penthouse.jpg";
import marina from "@/assets/dubai-marina.jpg";
import desert from "@/assets/dubai-desert.jpg";
import advisor from "@/assets/advisor-amira.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen w-full bg-background text-foreground">
      <SmoothScroll />

      <HeroVideo />

      {/* Advisor intro — the human between the cinema and the residences */}
      <section className="relative w-full bg-background px-5 py-20 md:px-16 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-16">
          <div className="relative">
            <img
              src={advisor}
              alt="Amira Hassan — private advisor, Maison Dubai"
              loading="lazy"
              decoding="async"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full rounded-sm object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-gold/20" />
          </div>
          <div>
            <RevealText className="mb-5 text-[10px] uppercase tracking-[0.4em] text-gold md:text-xs md:tracking-[0.5em]">
              Your advisor
            </RevealText>
            <RevealText as="h2" className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] text-foreground">
              I'm Amira.
            </RevealText>
            <RevealText delay={0.12} as="h2" className="font-display italic text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] gradient-gold-text">
              I don't sell homes — I place them.
            </RevealText>
            <RevealText delay={0.28} as="p" className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/75 md:mt-8 md:text-base">
              Twelve years in Dubai's quietest market. Three of every four homes I close never reach a listing — I match families to the residence before it becomes a brochure. The next three pages are mine: addresses I'd hand to a friend.
            </RevealText>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border/50 pt-5 md:mt-10 md:gap-8 md:pt-6">
              <div>
                <dt className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground md:text-[10px]">Placed</dt>
                <dd className="mt-1.5 font-display text-xl text-foreground md:text-2xl">$1.2B</dd>
              </div>
              <div>
                <dt className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground md:text-[10px]">Off-market</dt>
                <dd className="mt-1.5 font-display text-xl text-foreground md:text-2xl">74%</dd>
              </div>
              <div>
                <dt className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground md:text-[10px]">Languages</dt>
                <dd className="mt-1.5 font-display text-xl text-foreground md:text-2xl">AR · EN · FR</dd>
              </div>
            </dl>

            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-3 rounded-sm border border-gold/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold/10"
            >
              Start a quiet conversation
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      <HorizontalMarquee words={["Amira's Selection", "·", "Downtown", "·", "Palm Jumeirah", "·", "Marina", "·", "Desert Reserve", "·"]} />

      <ParallaxScene
        index={1}
        image={skyline}
        eyebrow="Amira's first · Downtown"
        title="Above the"
        titleItalic="clouds."
        description="My first call when a buyer wants the skyline at eye level. A vertical sanctuary in the shadow of the Burj — triple-height interiors, private sky pools, neighbours who never knock."
        meta={[
          { label: "From", value: "$8.4M" },
          { label: "Sky m²", value: "640" },
          { label: "Level", value: "84F" },
        ]}
        align="left"
      />

      <ParallaxScene
        index={2}
        image={palm}
        eyebrow="Amira's second · Palm Jumeirah"
        title="An island"
        titleItalic="of one."
        description="For the families who want the sea at the end of the hallway. Beachfront on the fronds of the Palm, private moorings, sunken gardens — and a gate that knows your driver."
        meta={[
          { label: "From", value: "$22M" },
          { label: "Plot m²", value: "1,820" },
          { label: "Frontage", value: "38m" },
        ]}
        align="right"
      />

      <ParallaxScene
        index={3}
        image={penthouse}
        eyebrow="Amira's third · Penthouse"
        title="Interiors"
        titleItalic="like cinema."
        description="The one I keep for clients who already own the view. Bookmatched marble, hand-rubbed bronze, lighting choreographed for nightfall — a private film set, scored by the city outside."
        meta={[
          { label: "From", value: "$12M" },
          { label: "Ceiling", value: "4.2m" },
          { label: "Suites", value: "5" },
        ]}
        align="left"
      />

      <ParallaxScene
        index={4}
        image={marina}
        eyebrow="Amira's fourth · Marina"
        title="At the edge"
        titleItalic="of the water."
        description="For owners who travel by hull more than by car. Slim light-catching towers above the Marina promenade — elevator to yacht in under a minute, my favourite negotiation."
        meta={[
          { label: "From", value: "$4.6M" },
          { label: "Berth m", value: "30" },
          { label: "Floors", value: "72" },
        ]}
        align="right"
      />

      <ParallaxScene
        index={5}
        image={desert}
        eyebrow="Amira's fifth · Desert Reserve"
        title="Quiet, just"
        titleItalic="outside."
        description="The one I save for the buyer who asks for silence. A private estate where the dunes meet a glass pavilion, the skyline a distant silver line — and the only sound is the wind I grew up with."
        meta={[
          { label: "From", value: "$18M" },
          { label: "Acres", value: "6.2" },
          { label: "Residences", value: "12" },
        ]}
        align="left"
      />

      <HorizontalMarquee words={["Reserve", "—", "A Private Viewing with Amira", "—"]} />

      <footer id="contact" className="relative border-t border-border/40 bg-background px-5 py-20 md:px-16 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <RevealText className="mb-5 text-[10px] uppercase tracking-[0.4em] text-gold md:text-xs md:tracking-[0.5em]">
              Write to Amira directly
            </RevealText>
            <RevealText as="h2" className="font-display text-4xl leading-tight text-foreground md:text-7xl">
              Begin a
            </RevealText>
            <RevealText delay={0.15} as="h2" className="font-display italic text-4xl leading-tight gradient-gold-text md:text-7xl">
              quiet conversation.
            </RevealText>
            <RevealText delay={0.3} as="p" className="mt-6 max-w-md text-sm leading-relaxed text-foreground/70 md:mt-8">
              No forms, no chains of assistants. Your note reaches my phone — I reply within the day, in the language you prefer.
            </RevealText>
          </div>
          <div className="flex flex-col justify-end gap-8 text-sm text-foreground/70">
            <div className="flex items-center gap-4 rounded-sm border border-border/40 bg-background/40 p-4 backdrop-blur md:p-5">
              <img
                src={advisor}
                alt="Amira Hassan"
                width={56}
                height={56}
                className="h-14 w-14 flex-none rounded-full object-cover"
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Amira Hassan</div>
                <div className="mt-1 font-display text-lg text-foreground">Private Advisor · DIFC</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 border-t border-border/50 pt-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Direct</div>
                <div className="mt-2 font-display text-lg text-foreground md:text-xl">+971 4 000 0000</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Email</div>
                <div className="mt-2 font-display text-lg text-foreground md:text-xl">amira@maison.ae</div>
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              © MMXXVI Maison Dubai · By appointment, in any language
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
