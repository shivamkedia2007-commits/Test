import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-farmer.jpg";
import { FarmerTrust } from "./FarmerTrust";
import { FeatureCards } from "./FeatureCards";

export function Hero() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="relative overflow-hidden pb-24">
      <img
        src={heroImage}
        alt="Indian farmer holding freshly harvested greens in a green field"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover object-right"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pt-32 sm:pt-36 lg:pt-44">
        <div className="max-w-xl">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Empowering
            <span className="block text-primary">Indian Farmers</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-foreground/75 sm:text-lg">
            Your all-in-one platform for smart farming, expert advice, market prices and
            sustainable growth.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={scrollToFeatures}
              className="rounded-lg border border-primary/60 bg-background/60 px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary/10"
            >
              Learn More
            </button>
          </div>

          <div className="mt-8">
            <FarmerTrust />
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <FeatureCards />
        </div>
      </div>
    </section>
  );
}
