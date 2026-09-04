import { createFileRoute } from "@tanstack/react-router";
import { MarketLayout } from "@/components/market/MarketLayout";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — AgriSaathi" },
      { name: "description", content: "Chat with farmers on AgriSaathi." },
      { property: "og:title", content: "Messages — AgriSaathi" },
      { property: "og:description", content: "Chat with farmers on AgriSaathi." },
    ],
  }),
  component: () => (
    <MarketLayout>
      <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      <p className="mt-3 text-sm text-muted-foreground">Chat with farmers on AgriSaathi. Coming soon.</p>
    </MarketLayout>
  ),
});
