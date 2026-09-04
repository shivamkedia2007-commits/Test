import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { AuthField } from "@/components/auth/AuthField";
import { AccountTypeSelect, type AccountType } from "@/components/auth/AccountTypeSelect";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — AgriSaathi" },
      { name: "description", content: "Log in to your AgriSaathi farmer account." },
      { property: "og:title", content: "Login — AgriSaathi" },
      { property: "og:description", content: "Log in to your AgriSaathi farmer account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [accountType, setAccountType] = useState<AccountType>("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); setLoading(true);
    try {
      const result = await apiFetch<{ role: AccountType; user: any }>("/auth/login", { method: "POST", body: JSON.stringify({ role: accountType, email: form.email, password: form.password }) });
      localStorage.setItem("agrisaathi_user", JSON.stringify(result.user));
      localStorage.setItem("agrisaathi_role", result.role);
      navigate({ to: result.role === "seller" ? "/seller-marketplace" : "/marketplace" });
    } catch (e: any) { setError(e.message || "Login failed"); } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto w-full max-w-md px-5 pb-20 pt-32 sm:pt-40">
        <BackButton />
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back. Sign in to continue to AgriSaathi.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <AuthField
              id="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <AuthField
              id="password"
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <AccountTypeSelect value={accountType} onChange={setAccountType} />

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
