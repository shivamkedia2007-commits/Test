import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type CartLine = { id: string; qty: number; unit: string };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  addToCart: (id: string, qty: number, unit: string) => void;
  removeFromCart: (id: string, unit: string) => void;
  setQty: (id: string, qty: number, unit: string) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => { try { return JSON.parse(localStorage.getItem("agrisaathi_cart") || "[]"); } catch { return []; } });
  const [wishlist, setWishlist] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("agrisaathi_wishlist") || "[]"); } catch { return []; } });

  useEffect(() => { localStorage.setItem("agrisaathi_cart", JSON.stringify(lines)); }, [lines]);
  useEffect(() => { localStorage.setItem("agrisaathi_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = useCallback((id: string, qty: number, unit: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id && l.unit === unit);
      if (existing)
        return prev.map((l) => (l.id === id && l.unit === unit ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, qty, unit }];
    });
  }, []);

  const removeFromCart = useCallback((id: string, unit: string) => {
    setLines((prev) => prev.filter((l) => !(l.id === id && l.unit === unit)));
  }, []);

  const setQty = useCallback((id: string, qty: number, unit: string) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.id === id && l.unit === unit))
        : prev.map((l) => (l.id === id && l.unit === unit ? { ...l, qty } : l)),
    );
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  }, []);

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      addToCart,
      removeFromCart,
      setQty,
      wishlist,
      toggleWishlist,
    }),
    [lines, wishlist, addToCart, removeFromCart, setQty, toggleWishlist],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
