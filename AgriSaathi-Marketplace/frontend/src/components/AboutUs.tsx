import { Building2, ShoppingBasket, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Highlight = {
  icon: LucideIcon;
  emoji: string;
  title: string;
  description: string;
};

const HIGHLIGHTS: Highlight[] = [
  {
    icon: Sprout,
    emoji: "👨‍🌾",
    title: "For Farmers",
    description: "Sell directly to consumers and bulk buyers.",
  },
  {
    icon: ShoppingBasket,
    emoji: "🛒",
    title: "For Consumers",
    description: "Buy fresh produce directly from farms.",
  },
  {
    icon: Building2,
    emoji: "🏢",
    title: "For Bulk Buyers",
    description: "Source quality produce directly from farmers and FPOs.",
  },
];

export function AboutUs() {
  return (
    <section id="about" className="scroll-mt-24 bg-cream/60 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            About Us
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            About AgriSaathi <span aria-hidden="true">🌱</span>
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
            <p>
              AgriSaathi is a digital platform that connects farmers and FPOs directly with
              consumers and bulk buyers, helping create a fairer and more efficient agricultural
              supply chain.
            </p>
            <p>
              Whether you&apos;re buying fresh produce for your household, running a restaurant, or
              purchasing in bulk, AgriSaathi makes it easier to source fresh produce directly from
              farmers.
            </p>
            <p>
              For farmers and FPOs, AgriSaathi provides a platform to sell their produce directly to
              buyers, helping reduce dependence on intermediaries and improve their share of the
              final selling price.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, emoji, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                <span aria-hidden="true">{emoji}</span> {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </section>
  );
}
