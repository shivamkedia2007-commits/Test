import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutUs } from "@/components/AboutUs";
import { ContactUs } from "@/components/ContactUs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriSaathi — Smart Farming Platform for Indian Farmers" },
      {
        name: "description",
        content:
          "AgriSaathi gives Indian farmers expert advice, live market prices, weather updates, a farm marketplace, and modern farming lessons.",
      },
      { property: "og:title", content: "AgriSaathi — Smart Farming Platform for Indian Farmers" },
      {
        property: "og:description",
        content:
          "Expert guidance, market prices, weather updates, and an agri marketplace in one platform.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AboutUs />
      <ContactUs />
    </main>
  );
}
