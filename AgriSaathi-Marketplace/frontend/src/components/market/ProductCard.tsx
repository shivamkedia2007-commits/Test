import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Minus, Plus } from "lucide-react";
import { unitPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const weightBased = product.unit === "kg";
  const [unit, setUnit] = useState(product.unit);
  const [qty, setQty] = useState(1);
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const wished = wishlist.includes(product.id);
  const step = weightBased ? 0.5 : 1;

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={400}
          height={400}
          className="mx-auto h-32 w-full rounded-xl object-contain sm:h-36"
        />
        <button
          type="button"
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:text-primary"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
        </button>
      </div>

      <Link to="/offers" search={{ productId: product.id }} className="mt-3 text-base font-semibold hover:text-primary hover:underline">{product.name}</Link>
      <p className="text-xs text-muted-foreground">{product.farmer}</p>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {product.location}
      </p>

      <p className="mt-2 text-lg font-bold">
        ₹{unitPrice(product, unit)}
        <span className="ml-1 text-xs font-medium text-muted-foreground">/ {unit}</span>
      </p>

      {weightBased && (
        <div className="mt-2 flex gap-1" role="group" aria-label={`Unit for ${product.name}`}>
          {["kg", "ql"].map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => {
                setUnit(u);
                setQty(1);
              }}
              className={cn(
                "flex-1 rounded-md border border-border px-2 py-1 text-xs font-semibold transition-colors",
                unit === u
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent",
              )}
            >
              {u}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between rounded-lg border border-border px-2 py-1">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(step, +(q - step).toFixed(1)))}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">
          {qty} {unit}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => +(q + step).toFixed(1))}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => addToCart(product.id, qty, unit)}
        className="mt-2 w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Add to Cart
      </button>
    </article>
  );
}
