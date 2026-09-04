import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Home", to: "/" as const },
  { label: "About Us", to: "/" as const, scrollTo: "about" },
  { label: "Contact", to: "/" as const, scrollTo: "contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  const handleScrollTo = (id?: string) => (event: React.MouseEvent) => {
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 lg:flex lg:justify-between">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={handleScrollTo(link.scrollTo)}
              activeOptions={{ exact: true }}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-lg border border-primary px-6 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-background/70 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-5 rounded-2xl border border-border bg-background/95 p-5 shadow-lg backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={(e) => {
                  setOpen(false);
                  handleScrollTo(link.scrollTo)(e);
                }}
                className="text-base font-medium text-foreground/80 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex gap-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-primary px-4 py-2 text-center text-sm font-medium text-primary"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
