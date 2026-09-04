import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { useCart } from "@/lib/cart";

type Props = {
  query?: string | undefined;
  onQueryChange?: ((value: string) => void) | undefined;
  onMenuClick?: (() => void) | undefined;
};

export function MarketHeader({ query = "", onQueryChange, onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form
          onSubmit={(e) => e.preventDefault()}
          role="search"
          className="mx-auto flex w-full max-w-xl items-center overflow-hidden rounded-full border border-border bg-card shadow-sm focus-within:border-primary"
        >
          <label htmlFor="market-search" className="sr-only">
            Search products
          </label>
          <input
            id="market-search"
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search for vegetables, fruits, grams and more..."
            className="w-full bg-transparent px-5 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Search"
            className="grid h-11 w-12 shrink-0 place-items-center bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <CartButton />
          <Link
            to="/login"
            aria-label="Account"
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function CartButton() {
  const { count } = useCart();
  return (
    <Link
      to="/cart"
      aria-label={`Cart, ${count} items`}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
