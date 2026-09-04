import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MarketLayout } from "@/components/market/MarketLayout";
import { useCart } from "@/lib/cart";
import { apiFetch } from "@/lib/api";
import { productFromApi, unitPrice, type Product } from "@/lib/products";

export const Route = createFileRoute("/cart")({ head: () => ({ meta: [{ title: "Your Cart — AgriSaathi" }] }), component: CartPage });

function CartPage() {
  const { lines, setQty, removeFromCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { apiFetch<any[]>("/products").then((rows) => setProducts(rows.map(productFromApi))).catch(() => {}); }, []);
  const items = lines.map((line) => ({ line, product: products.find((p) => p.id === line.id) })).filter((i): i is { line: typeof lines[number]; product: Product } => !!i.product);
  const total = items.reduce((sum, i) => sum + unitPrice(i.product, i.line.unit) * i.line.qty, 0);
  return <MarketLayout><h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>{items.length === 0 ? <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center"><p className="text-sm text-muted-foreground">Your cart is empty.</p><Link to="/marketplace" className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Browse products</Link></div> : <div className="mt-6 space-y-3">{items.map(({ line, product }) => <div key={`${product.id}-${line.unit}`} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"><img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-contain" /><div className="min-w-0 flex-1"><p className="font-semibold">{product.name}</p><p className="text-xs text-muted-foreground">{product.farmer} · {product.location}</p><p className="text-sm font-semibold">₹{unitPrice(product, line.unit)} / {line.unit}</p><p className="text-xs text-muted-foreground">Available: {product.quantityAvailable} kg</p></div><div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1"><button type="button" onClick={() => setQty(product.id, Math.max(0, +(line.qty - 0.5).toFixed(1)), line.unit)}><Minus className="h-4 w-4" /></button><span className="w-16 text-center text-sm font-semibold">{line.qty} {line.unit}</span><button type="button" onClick={() => setQty(product.id, +(line.qty + 0.5).toFixed(1), line.unit)}><Plus className="h-4 w-4" /></button></div><p className="w-20 text-right font-bold">₹{unitPrice(product, line.unit) * line.qty}</p><button type="button" onClick={() => removeFromCart(product.id, line.unit)}><Trash2 className="h-4 w-4" /></button></div>)}<div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"><span>Total</span><span className="text-xl font-bold">₹{total.toFixed(2)}</span></div><button type="button" className="w-full rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground">Proceed to checkout</button></div>}</MarketLayout>;
}
