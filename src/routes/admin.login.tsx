import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Input, Toaster } from "../components/kit";
import { auth, toast, useStore } from "../lib/erp-store";
import heroImg from "../assets/hero-equipment.jpg";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — MAXVION Industrial ERP Demo" },
      { name: "description", content: "Sign in to the MAXVION Industrial ERP demo dashboard with the provided demo credentials." },
      { property: "og:title", content: "MAXVION ERP Demo — Admin Login" },
      { property: "og:description", content: "Demo access to the MAXVION equipment management dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const authed = useStore((s) => s.authed);
  const [email, setEmail] = useState("admin@maxvioninfra.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authed) navigate({ to: "/admin/dashboard", replace: true });
  }, [authed, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (auth.login(email, password)) {
        toast("Welcome back, Admin");
        navigate({ to: "/admin/dashboard" });
      } else {
        toast("Invalid credentials. Use the demo login provided.", "error");
      }
    }, 650);
  };

  return (
    <div className="grid min-h-screen bg-card lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <img
          src={heroImg}
          alt="Medical and laboratory equipment facility"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-medblue to-teal text-lg font-black text-white">
              M
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-black text-white">MAXVION</span>
              <span className="block text-[9px] font-semibold tracking-[0.18em] text-white/60">
                INFRASTRUCTURE PRIVATE LIMITED
              </span>
            </span>
          </div>
          <div>
            <h2 className="max-w-md text-3xl text-white">Digital Equipment Management Platform</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Serialized asset tracking, AMC management, calibration compliance and B2B GST billing for medical,
              surgical and scientific equipment operations.
            </p>
          </div>
          <p className="text-xs text-white/40">
            Industrial ERP Demo · Mock data only · Not a commercially launched product
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-medblue to-teal text-lg font-black text-white">
              M
            </span>
          </div>
          <h1 className="mt-6 text-2xl lg:mt-0">Admin Sign In</h1>
          <p className="mt-2 text-sm text-slate-500">Access the MAXVION Industrial ERP demo dashboard.</p>

          <form onSubmit={submit} className="mt-8 grid gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@maxvioninfra.com" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Demo Credentials</p>
            <p className="mt-2 font-mono text-sm text-navy">admin@maxvioninfra.com</p>
            <p className="font-mono text-sm text-navy">admin123</p>
          </div>

          <Link to="/" className="mt-6 inline-block text-sm font-semibold text-medblue hover:underline">
            ← Back to Website
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
