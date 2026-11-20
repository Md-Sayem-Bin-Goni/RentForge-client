"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { syncUserAndFetchJwt } from "@/lib/auth-sync";
import { RentForgeLogo } from "@/components/shared/Navbar";

// Official Google "G" Icon
function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      // 1. Better-Auth Email/Password Sign-In
      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      // 2. Sync user to backend POST /api/users & fetch JWT from POST /api/jwt
      await syncUserAndFetchJwt({
        email: email.trim().toLowerCase(),
        name: result.data?.user?.name || email.trim().split("@")[0],
        image: result.data?.user?.image || "",
        role: "customer",
      });

      // 3. Show success toast & redirect
      toast.success("Logged in successfully! Welcome back.");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An unexpected error occurred during login.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast.error(error.message || "Failed to initiate Google sign-in.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <RentForgeLogo className="size-10 drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]" />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Rent<span className="font-extrabold text-emerald-600 dark:text-emerald-400">Forge</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your rentals, machinery listings, and dashboard.
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-emerald-950/5 sm:p-8">
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background py-2.5 px-4 text-sm font-medium text-foreground transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:pointer-events-none disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <GoogleIcon className="size-4" />
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs tracking-wider uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Address */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full rounded-lg border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="size-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-input bg-background py-2.5 pr-10 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-950/20 transition-all hover:bg-emerald-500 active:translate-y-px disabled:pointer-events-none disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
