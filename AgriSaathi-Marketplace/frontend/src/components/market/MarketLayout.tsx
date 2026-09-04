import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { MarketSidebar } from "./MarketSidebar";
import { MarketHeader } from "./MarketHeader";
import { Logo } from "@/components/Logo";

type Props = {
  children: ReactNode;
  query?: string | undefined;
  onQueryChange?: ((value: string) => void) | undefined;
};

export function MarketLayout({ children, query, onQueryChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
          <div className="px-4 pt-5">
            <Logo />
          </div>
          <MarketSidebar />
        </aside>

        <div className="min-w-0 flex-1">
          <MarketHeader
            query={query}
            onQueryChange={onQueryChange}
            onMenuClick={() => setMenuOpen(true)}
          />
          <main className="px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-foreground/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between px-4 pt-5">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <MarketSidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
