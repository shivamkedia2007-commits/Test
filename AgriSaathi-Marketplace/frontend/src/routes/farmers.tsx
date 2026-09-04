import { createFileRoute } from "@tanstack/react-router";
import { MarketLayout } from "@/components/market/MarketLayout";

export const Route = createFileRoute("/farmers")({
  head: () => ({
    meta: [
      { title: "Farmers — AgriSaathi" },
      { name: "description", content: "Meet the verified farmers behind your food." },
      { property: "og:title", content: "Farmers — AgriSaathi" },
      { property: "og:description", content: "Meet the verified farmers behind your food." },
    ],
  }),
  component: () => (
    <MarketLayout>
      <h1 className="text-2xl font-bold tracking-tight">Farmers</h1>
      <p className="mt-3 text-sm text-muted-foreground">Meet the verified farmers behind your food. Coming soon.</p>
    </MarketLayout>
  ),
});
