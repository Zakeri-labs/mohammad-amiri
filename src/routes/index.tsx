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

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen w-full bg-background text-foreground">
      <SmoothScroll />

      <HeroVideo />

      <HorizontalMarquee words={["Downtown", "·", "Palm Jumeirah", "·", "Marina", "·", "Desert Reserve", "·"]} />

      <ParallaxScene
        index={1}
        image={skyline}
        eyebrow="01 — Downtown"
        title="Above the"
        titleItalic="clouds."
        description="A vertical sanctuary in the shadow of the Burj. Triple-height interiors, private sky pools, and a 270° view of a city written in light."
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
        eyebrow="02 — Palm Jumeirah"
        title="An island"
        titleItalic="of one."
        description="Beachfront mansions arranged along the fronds of the Palm. Private moorings, sunken gardens, and the Gulf at the end of every hallway."
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
        eyebrow="03 — Penthouse Collection"
        title="Interiors"
        titleItalic="like cinema."
        description="Bookmatched marble, hand-rubbed bronze, and lighting choreographed for nightfall. Each residence is a private film set, scored by the city outside."
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
        eyebrow="04 — Marina"
        title="At the edge"
        titleItalic="of the water."
        description="Slim, light-catching towers built directly above the Marina promenade. Step from the elevator to the yacht in under a minute."
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
        eyebrow="05 — Desert Reserve"
        title="Quiet, just"
        titleItalic="outside."
        description="A private estate beyond the city, where the dunes meet a glass pavilion and the skyline is a distant silver line on the horizon."
        meta={[
          { label: "From", value: "$18M" },
          { label: "Acres", value: "6.2" },
          { label: "Residences", value: "12" },
        ]}
        align="left"
      />

      <HorizontalMarquee words={["Reserve", "—", "A Private Viewing", "—"]} />

      <footer className="relative border-t border-border/40 bg-background px-8 py-24 md:px-16 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
          <div>
            <RevealText className="mb-6 text-xs uppercase tracking-[0.5em] text-gold">
              Maison · Dubai
            </RevealText>
            <RevealText as="h2" className="font-display text-5xl leading-tight text-foreground md:text-7xl">
              Begin a
            </RevealText>
            <RevealText delay={0.15} as="h2" className="font-display italic text-5xl leading-tight gradient-gold-text md:text-7xl">
              quiet conversation.
            </RevealText>
          </div>
          <div className="flex flex-col justify-end gap-8 text-sm text-foreground/70">
            <RevealText delay={0.2}>
              By appointment only. Our private brokers respond within 24 hours, in any language you prefer.
            </RevealText>
            <div className="grid grid-cols-2 gap-6 border-t border-border/50 pt-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Office</div>
                <div className="mt-2 font-display text-xl text-foreground">DIFC, Dubai</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Concierge</div>
                <div className="mt-2 font-display text-xl text-foreground">+971 4 000 0000</div>
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              © MMXXVI Maison Dubai · A cinematic real-estate house
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
