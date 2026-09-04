import { Leaf, ShieldCheck, IndianRupee } from "lucide-react";
import banner from "@/assets/market-banner.jpg.asset.json";

const BENEFITS = [
  { label: "100% Fresh", icon: Leaf },
  { label: "Safe & Trusted", icon: ShieldCheck },
  { label: "Best Prices", icon: IndianRupee },
];

export function MarketBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-accent">
      <img
        src={banner.url}
        alt="Farmer holding a basket of fresh vegetables in a field"
        width={1600}
        height={704}
        className="absolute inset-0 h-full w-full object-cover object-right"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-transparent" />
      <div className="relative max-w-lg px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-forest sm:text-4xl">
          Fresh from Farms,
          <br />
          Straight to Your Home
        </h1>
        <p className="mt-3 text-sm font-medium text-foreground/80 sm:text-base">
          Support farmers. Eat fresh. Stay healthy.
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
          {BENEFITS.map((b) => (
            <li key={b.label} className="flex items-center gap-2 text-sm font-medium">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-background/80 text-primary">
                <b.icon className="h-4 w-4" />
              </span>
              {b.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
