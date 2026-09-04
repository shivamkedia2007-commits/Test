import { BookOpen, CloudSun, Leaf, LineChart, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  { icon: Leaf, title: "Expert Guidance", description: "Get advice from agriculture experts" },
  { icon: LineChart, title: "Market Prices", description: "Real-time updates on crop prices" },
  { icon: CloudSun, title: "Weather Updates", description: "Live weather forecast for better planning" },
  {
    icon: ShoppingCart,
    title: "Agri Marketplace",
    description: "Buy quality inputs & sell your produce",
  },
  { icon: BookOpen, title: "Smart Learning", description: "Learn modern farming techniques" },
];

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="flex min-w-0 items-start gap-3 px-2 py-3 xl:px-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold leading-snug text-forest-foreground">{title}</h3>
        <p className="mt-1 text-[13px] leading-snug text-forest-foreground/75">{description}</p>
      </div>
    </div>
  );
}

export function FeatureCards() {
  return (
    <div
      id="features"
      className="scroll-mt-24 rounded-3xl bg-forest px-4 py-4 shadow-xl sm:px-6 sm:py-6"
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:divide-x xl:divide-forest-foreground/15">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}
