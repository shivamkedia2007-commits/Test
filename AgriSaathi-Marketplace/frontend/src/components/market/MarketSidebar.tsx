import { Link } from "@tanstack/react-router";
import {
  Home,
  ClipboardList,
  Heart,
  Tag,
  MessageSquare,
  Users,
  HelpCircle,
  Truck,
  Sprout,
} from "lucide-react";

const NAV = [
  { label: "Home", to: "/marketplace", icon: Home },
  { label: "Orders", to: "/orders", icon: ClipboardList },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Offers", to: "/offers", icon: Tag },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "Farmers", to: "/farmers", icon: Users },
  { label: "Support", to: "/support", icon: HelpCircle },
] as const;

export function MarketSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-accent text-primary font-semibold" }}
            inactiveProps={{ className: "text-foreground/70" }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:bg-accent/70 hover:text-primary"
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl bg-accent/70 p-4">
          <Truck className="h-6 w-6 text-primary" />
          <p className="mt-2 text-sm font-semibold">Free Delivery</p>
          <p className="text-xs text-muted-foreground">
            On orders above <span className="font-semibold text-foreground">₹499</span>
          </p>
        </div>
        <div className="rounded-2xl bg-accent/70 p-4">
          <Sprout className="h-6 w-6 text-primary" />
          <p className="mt-2 text-sm font-semibold">Support Farmers</p>
          <p className="text-xs text-muted-foreground">Buy directly from verified farmers</p>
        </div>
      </div>
    </div>
  );
}
