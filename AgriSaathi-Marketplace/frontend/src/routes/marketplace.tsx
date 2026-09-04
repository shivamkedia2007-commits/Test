import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MarketLayout } from "@/components/market/MarketLayout";
import { MarketBanner } from "@/components/market/MarketBanner";
import { ProductCard } from "@/components/market/ProductCard";
import { apiFetch } from "@/lib/api";
import { productFromApi, type Product } from "@/lib/products";

const INITIAL_COUNT = 10;

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Buyer Marketplace — AgriSaathi" }] }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<any[]>("/products")
      .then((rows) => setProducts(rows.map(productFromApi)))
      .catch((e) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => [p.name, p.farmer, p.location].some((f) => f.toLowerCase().includes(q)));
  }, [products, query]);

  const visible = showAll || query ? filtered : filtered.slice(0, INITIAL_COUNT);

  return (
    <MarketLayout query={query} onQueryChange={setQuery}>
      <MarketBanner />
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Fresh From Farmers</h2>
        <button type="button" onClick={() => setShowAll(true)} className="text-sm font-semibold text-primary hover:underline">View All</button>
      </div>
      {error && <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {!error && products.length === 0 ? <p className="mt-8 text-sm text-muted-foreground">Loading products from the marketplace database…</p> : null}
      {visible.length === 0 && products.length > 0 ? <p className="mt-8 text-sm text-muted-foreground">No products match “{query}”.</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visible.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </MarketLayout>
  );
}
