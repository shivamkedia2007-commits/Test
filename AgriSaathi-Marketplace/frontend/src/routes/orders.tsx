import { createFileRoute } from "@tanstack/react-router";
import { MarketLayout } from "@/components/market/MarketLayout";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — AgriSaathi" },
      { name: "description", content: "Track your AgriSaathi orders." },
      { property: "og:title", content: "Orders — AgriSaathi" },
      { property: "og:description", content: "Track your AgriSaathi orders." },
    ],
  }),
  component: () => (
    <MarketLayout>
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <p className="mt-3 text-sm text-muted-foreground">Track your AgriSaathi orders. Coming soon.</p>
    </MarketLayout>
  ),
});
