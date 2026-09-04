import { createFileRoute } from "@tanstack/react-router";
import { MarketLayout } from "@/components/market/MarketLayout";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — AgriSaathi" },
      { name: "description", content: "Get help with your AgriSaathi orders." },
      { property: "og:title", content: "Support — AgriSaathi" },
      { property: "og:description", content: "Get help with your AgriSaathi orders." },
    ],
  }),
  component: () => (
    <MarketLayout>
      <h1 className="text-2xl font-bold tracking-tight">Support</h1>
      <p className="mt-3 text-sm text-muted-foreground">Get help with your AgriSaathi orders. Coming soon.</p>
    </MarketLayout>
  ),
});
