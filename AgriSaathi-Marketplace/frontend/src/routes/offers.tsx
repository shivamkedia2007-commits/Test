import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Truck } from "lucide-react";
import { MarketLayout } from "@/components/market/MarketLayout";
import { apiFetch } from "@/lib/api";
import { productFromApi, unitPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/offers")({
  validateSearch: (search: Record<string, unknown>) => ({ productId: String(search.productId ?? "") }),
  head: () => ({ meta: [{ title: "Product Details — AgriSaathi" }] }),
  component: ProductDetails,
});

function ProductDetails() {
  const { productId } = Route.useSearch();
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  useEffect(() => { if (productId) apiFetch<any>(`/products/${productId}`).then(setProduct).catch((e) => setError(e.message)); }, [productId]);

  if (!productId) return <MarketLayout><h1 className="text-2xl font-bold">Offers</h1><p className="mt-3 text-muted-foreground">Select a product from the marketplace to view its details.</p></MarketLayout>;
  if (error) return <MarketLayout><p className="text-destructive">{error}</p></MarketLayout>;
  if (!product) return <MarketLayout><p className="text-muted-foreground">Loading product…</p></MarketLayout>;
  const p = productFromApi(product);
  return <MarketLayout><Link to="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" /> Back to marketplace</Link><div className="mt-6 grid gap-8 rounded-3xl border border-border bg-card p-5 shadow-sm md:grid-cols-2 md:p-8"><div className="grid place-items-center rounded-2xl bg-secondary/40 p-8"><img src={p.image} alt={p.name} className="max-h-96 w-full object-contain" /></div><div><p className="text-sm font-semibold text-primary">Direct from farmer</p><h1 className="mt-2 text-4xl font-extrabold">{p.name}</h1><p className="mt-2 text-muted-foreground">Harvested on {p.harvestDate}</p><p className="mt-6 text-3xl font-extrabold">₹{unitPrice(p, "kg")} <span className="text-sm font-medium text-muted-foreground">/ kg</span></p><div className="mt-6 space-y-3 text-sm"><p><strong>Available:</strong> {p.quantityAvailable} kg</p><p><strong>Farmer:</strong> {product.seller_name}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {product.city}, {product.state_province}</p><p className="flex items-center gap-2"><Truck className="h-4 w-4" /> Logistics support available</p></div><button type="button" onClick={() => addToCart(p.id, 1, "kg")} className="mt-8 w-full rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">Add 1 kg to Cart</button></div></div></MarketLayout>;
}
