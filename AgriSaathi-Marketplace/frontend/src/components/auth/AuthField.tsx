import type { InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export function AuthField({ label, id, className, ...props }: AuthFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
        {...props}
      />
    </div>
  );
}
