"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { RentForgeLogo } from "@/components/shared/Navbar";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * PrivateRoute component:
 * 1. Checks BetterAuth session.
 * 2. STRICT: Waits until `isPending` is false before redirecting unauthenticated users.
 * 3. Prevents reload on private routes from kicking logged-in users to /login.
 */
export default function PrivateRoute({
  children,
  allowedRoles,
}: PrivateRouteProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  React.useEffect(() => {
    // Only perform redirect check once auth evaluation is complete
    if (!isPending) {
      if (!session?.user) {
        // Save current location for return after login
        const currentPath =
          typeof window !== "undefined" ? window.location.pathname : "/";
        router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else if (allowedRoles && allowedRoles.length > 0) {
        const userRole = (session.user as { role?: string })?.role;
        if (userRole && !allowedRoles.includes(userRole)) {
          router.replace("/");
        }
      }
    }
  }, [session, isPending, router, allowedRoles]);

  // While BetterAuth session is actively loading, render seamless authentication screen
  if (isPending) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="relative flex flex-col items-center">
          {/* Ambient Glow */}
          <div className="absolute -top-10 size-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          {/* Animated Spinner with RentForge Logo */}
          <div className="relative flex size-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-emerald-500 border-r-emerald-400 [animation-duration:1.2s]" />
            <RentForgeLogo className="size-8 animate-pulse drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm font-semibold text-foreground">
              Verifying Session Credentials...
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Securing access to RentForge private resources
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated and auth checking finished, return null while router.replace executes
  if (!session?.user) {
    return null;
  }

  // If role is restricted
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (session.user as { role?: string })?.role;
    if (userRole && !allowedRoles.includes(userRole)) {
      return null;
    }
  }

  // Authenticated user verified
  return <>{children}</>;
}
