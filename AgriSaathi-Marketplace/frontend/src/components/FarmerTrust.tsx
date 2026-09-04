const FARMERS = ["RK", "SP", "AM", "VJ"];

export function FarmerTrust() {
  return (
    <div>
      <p className="text-sm text-foreground/80">Trusted by farmers across India</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center -space-x-3">
          {FARMERS.map((initials) => (
            <span
              key={initials}
              className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-accent text-xs font-semibold text-accent-foreground"
            >
              {initials}
            </span>
          ))}
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-primary text-[11px] font-semibold text-primary-foreground">
            10K+
          </span>
        </div>
        <span className="text-sm font-medium text-foreground/80">Happy Farmers</span>
      </div>
    </div>
  );
}
