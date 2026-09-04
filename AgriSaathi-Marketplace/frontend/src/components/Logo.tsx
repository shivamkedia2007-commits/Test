import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-primary text-primary">
        <Sprout className="h-5 w-5" />
      </span>
      <span className="text-2xl font-bold tracking-tight">
        Agri<span className="text-primary">Saathi</span>
      </span>
    </Link>
  );
}
