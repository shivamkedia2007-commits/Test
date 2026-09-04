import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { AuthField } from "@/components/auth/AuthField";
import { AccountTypeSelect, type AccountType } from "@/components/auth/AccountTypeSelect";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — AgriSaathi" }] }),
  component: SignupPage,
});

const INITIAL = { fullName: "", email: "", password: "", confirmPassword: "", phone: "", accountNumber: "", gstNumber: "", kisaanId: "", state: "", city: "", district: "", pincode: "", line1: "", line2: "" };

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [accountType, setAccountType] = useState<AccountType>("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (key: keyof typeof INITIAL) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setError(""); setLoading(true);
    try {
      const payload = {
        name: form.fullName, email: form.email, password: form.password, phone: form.phone,
        account_number: form.accountNumber, gst_number: form.gstNumber || null, kisaan_id: form.kisaanId,
        address: { line1: form.line1, line2: form.line2, state: form.state, city: form.city, district: form.district, pincode: form.pincode },
      };
      await apiFetch(accountType === "buyer" ? "/auth/signup/buyer" : "/auth/signup/seller", { method: "POST", body: JSON.stringify(payload) });
      navigate({ to: "/login" });
    } catch (e: any) { setError(e.message || "Signup failed"); } finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-background"><Navbar /><div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-32 sm:pt-40"><BackButton /><div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Create your AgriSaathi account</h1><p className="mt-2 text-sm text-muted-foreground">Connect directly with farmers, consumers and bulk buyers.</p>
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <AccountTypeSelect value={accountType} onChange={setAccountType} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField id="fullName" label="Full Name" required value={form.fullName} onChange={set("fullName")} placeholder="Ramesh Kumar" />
        <AuthField id="email" label="Gmail / Email" type="email" required value={form.email} onChange={set("email")} placeholder="you@gmail.com" />
        <AuthField id="phone" label="Phone Number" type="tel" required value={form.phone} onChange={set("phone")} placeholder="9876543210" />
        <AuthField id="accountNumber" label="Account Number" required value={form.accountNumber} onChange={set("accountNumber")} placeholder="Bank account number" />
        <AuthField id="password" label="Password" type="password" required value={form.password} onChange={set("password")} placeholder="Minimum 8 characters" />
        <AuthField id="confirmPassword" label="Confirm Password" type="password" required value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" />
        {accountType === "seller" && <AuthField id="kisaanId" label="Kisaan ID" required value={form.kisaanId} onChange={set("kisaanId")} placeholder="Your farmer ID" />}
        <AuthField id="gstNumber" label="GST Number (Optional)" value={form.gstNumber} onChange={set("gstNumber")} placeholder="Optional" />
      </div>
      <div className="border-t border-border pt-5"><h2 className="font-bold">Address</h2><p className="mt-1 text-sm text-muted-foreground">Your address is stored separately and linked using an address ID.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">
        <AuthField id="line1" label="Address Line 1" required value={form.line1} onChange={set("line1")} placeholder="Village / street" />
        <AuthField id="line2" label="Address Line 2" value={form.line2} onChange={set("line2")} placeholder="Landmark (optional)" />
        <AuthField id="state" label="State" required value={form.state} onChange={set("state")} placeholder="Rajasthan" />
        <AuthField id="district" label="District" required value={form.district} onChange={set("district")} placeholder="Jaipur" />
        <AuthField id="city" label="City / Village" required value={form.city} onChange={set("city")} placeholder="Jaipur" />
        <AuthField id="pincode" label="Pincode" required value={form.pincode} onChange={set("pincode")} placeholder="302001" />
      </div></div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <button disabled={loading} type="submit" className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">{loading ? "Creating account…" : "Create Account"}</button>
    </form><p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link></p>
  </div></div></main>;
}
