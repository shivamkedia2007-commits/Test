import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketLayout } from "@/components/market/MarketLayout";
import { ProductCard } from "@/components/market/ProductCard";
import { useCart } from "@/lib/cart";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — AgriSaathi" },
      { name: "description", content: "Products you saved from AgriSaathi farmers." },
      { property: "og:title", content: "Wishlist — AgriSaathi" },
      { property: "og:description", content: "Products you saved from AgriSaathi farmers." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useCart();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <MarketLayout>
      <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">You haven't saved any products yet.</p>
          <Link
            to="/marketplace"
            className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </MarketLayout>
  );
}
