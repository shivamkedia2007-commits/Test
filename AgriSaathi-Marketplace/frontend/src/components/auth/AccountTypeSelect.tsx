import { ShoppingBasket, Sprout } from "lucide-react";

export type AccountType = "buyer" | "seller";

const OPTIONS: { value: AccountType; label: string; hint: string; Icon: typeof Sprout }[] = [
  { value: "buyer", label: "Buyer", hint: "Purchase fresh produce", Icon: ShoppingBasket },
  { value: "seller", label: "Seller", hint: "Sell your harvest", Icon: Sprout },
];

export function AccountTypeSelect({
  value,
  onChange,
}: {
  value: AccountType;
  onChange: (value: AccountType) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-foreground/80">I am a</legend>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map(({ value: v, label, hint, Icon }) => {
          const selected = value === v;
          return (
            <label
              key={v}
              className={`flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-3.5 transition-colors ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <input
                type="radio"
                name="accountType"
                value={v}
                checked={selected}
                onChange={() => onChange(v)}
                className="sr-only"
              />
              <span
                className={`flex items-center gap-2 text-sm font-semibold ${
                  selected ? "text-primary" : "text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </span>
              <span className="text-xs text-muted-foreground">{hint}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
