"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

type Step = 1 | 2 | 3;

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(decodeURIComponent(err));
  }, [searchParams]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleSelect(role: "creator" | "brand") {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set role");
      router.push(role === "creator" ? "/creator" : "/brand");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set role");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div
        className="absolute inset-0 bg-gradient-to-b from-surface-950 via-surface-950 to-surface-900 -z-10"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,212,255,0.08),transparent)] -z-10"
        aria-hidden
      />

      <Link
        href="/"
        className="absolute top-6 left-6 text-surface-400 hover:text-electric transition-colors text-sm font-medium"
      >
        ← Back to home
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="gradient-text text-2xl font-bold">IslandLoaf</span>
          </Link>
        </div>

        <Card className="p-8 glow">
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <h1 className="text-xl font-semibold text-white text-center">
                Sign in with email
              </h1>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error ?? undefined}
                required
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
                disabled={!email}
              >
                Send OTP
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify} className="space-y-6">
              <h1 className="text-xl font-semibold text-white text-center">
                Check your email
              </h1>
              <p className="text-surface-400 text-sm text-center">
                We sent a 6-digit code to <span className="text-white">{email}</span>
              </p>
              <Input
                label="Verification code"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                error={error ?? undefined}
                required
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
                disabled={token.length !== 6}
              >
                Verify
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setToken("");
                  setError(null);
                }}
                className="w-full text-sm text-surface-400 hover:text-electric transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h1 className="text-xl font-semibold text-white text-center">
                Choose your role
              </h1>
              <p className="text-surface-400 text-sm text-center">
                How do you want to use IslandLoaf?
              </p>
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("creator")}
                  disabled={loading}
                  className="flex items-center gap-4 p-4 rounded-xl border border-surface-600 bg-surface-800/50 hover:border-electric/50 hover:bg-electric/5 transition-all duration-200 text-left group disabled:opacity-50"
                >
                  <div className="rounded-xl bg-electric/10 p-3 group-hover:bg-electric/20 transition-colors">
                    <User className="h-8 w-8 text-electric" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-white">I&apos;m a Creator</p>
                    <p className="text-sm text-surface-400">
                      Compete in campaigns and earn prizes
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("brand")}
                  disabled={loading}
                  className="flex items-center gap-4 p-4 rounded-xl border border-surface-600 bg-surface-800/50 hover:border-electric/50 hover:bg-electric/5 transition-all duration-200 text-left group disabled:opacity-50"
                >
                  <div className="rounded-xl bg-electric/10 p-3 group-hover:bg-electric/20 transition-colors">
                    <Building2 className="h-8 w-8 text-electric" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-white">I&apos;m a Brand</p>
                    <p className="text-sm text-surface-400">
                      Launch campaigns and reach creators
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
