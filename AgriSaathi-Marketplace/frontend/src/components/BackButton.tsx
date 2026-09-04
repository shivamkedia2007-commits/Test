import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <Link
      to="/"
      aria-label="Back to home"
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span>Back</span>
    </Link>
  );
}
