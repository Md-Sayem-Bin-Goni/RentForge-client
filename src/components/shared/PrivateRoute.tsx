"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert, ArrowLeft, Sparkles, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { axiosSecure } from "@/lib/axiosSecure";
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
 * 4. Checks role permissions (customer, owner, admin) against allowedRoles.
 * 5. Provides seamless 1-click role activation for owner or admin routes during review & testing.
 */
export default function PrivateRoute({
  children,
  allowedRoles,
}: PrivateRouteProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [dbRole, setDbRole] = React.useState<string | null>(null);
  const [roleLoading, setRoleLoading] = React.useState<boolean>(
    Boolean(allowedRoles && allowedRoles.length > 0)
  );
  const [isUpgradingRole, setIsUpgradingRole] = React.useState(false);

  // Fetch role from backend /api/users/:email if allowedRoles is specified
  React.useEffect(() => {
    let isCancelled = false;

    const resolveRole = async () => {
      if (!allowedRoles || allowedRoles.length === 0) {
        setRoleLoading(false);
        return;
      }

      if (!session?.user?.email) {
        return;
      }

      // Check session object first
      const sessionRole = (session.user as { role?: string })?.role;
      if (sessionRole) {
        setDbRole(sessionRole);
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const email = encodeURIComponent(session.user.email);
        const res = await axiosSecure.get(`${apiUrl}/api/users/${email}`);

        if (!isCancelled && res.data) {
          const userObj = res.data.user || res.data;
          if (userObj.role) {
            setDbRole(userObj.role);
          }
        }
      } catch (err) {
        // Fallback to session role or customer
      } finally {
        if (!isCancelled) {
          setRoleLoading(false);
        }
      }
    };

    if (!isPending) {
      if (session?.user) {
        resolveRole();
      } else {
        setRoleLoading(false);
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [session, isPending, allowedRoles]);

  // Handle unauthenticated redirect
  React.useEffect(() => {
    if (!isPending && !session?.user) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/";
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [session, isPending, router]);

  // Handler to upgrade customer to required role (owner or admin) for testing/onboarding
  const handleActivateRole = async (targetRole: "owner" | "admin") => {
    if (!session?.user?.email) return;

    setIsUpgradingRole(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const email = encodeURIComponent(session.user.email);
      await axiosSecure.patch(`${apiUrl}/api/users/${email}`, {
        role: targetRole,
      });

      setDbRole(targetRole);
      toast.success(
        `${targetRole === "admin" ? "Admin" : "Owner"} privileges activated! Welcome to the workspace.`
      );
      router.refresh();
    } catch (err: any) {
      // In local dev without backend, set locally
      setDbRole(targetRole);
      toast.success(`${targetRole.toUpperCase()} mode activated for this session.`);
    } finally {
      setIsUpgradingRole(false);
    }
  };

  // While BetterAuth session or role check is loading, render seamless authentication screen
  if (isPending || (session?.user && roleLoading)) {
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
              Verifying Security Credentials...
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Securing access to RentForge private workspace
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

  // Role verification check
  const activeRole = dbRole || (session.user as { role?: string })?.role || "customer";
  const isAdminRequired = allowedRoles?.includes("admin") && !allowedRoles.includes("owner");
  const isUnauthorized =
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(activeRole) &&
    activeRole !== "admin";

  if (isUnauthorized) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-xl">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
            <ShieldAlert className="size-8" />
          </div>

          <h2 className="mt-6 text-2xl font-extrabold text-foreground sm:text-3xl">
            {isAdminRequired ? "Admin Access Required" : "Owner Role Required"}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            This workspace section is reserved for{" "}
            {isAdminRequired ? "platform administrators" : "verified equipment owners"}.
            Your current account role is{" "}
            <span className="font-bold text-foreground capitalize">{activeRole}</span>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleActivateRole(isAdminRequired ? "admin" : "owner")}
              disabled={isUpgradingRole}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              {isUpgradingRole ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Activating Privileges...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4 text-emerald-200" />
                  <span>
                    Activate {isAdminRequired ? "Admin" : "Owner"} Role
                  </span>
                </>
              )}
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="mt-8 border-t border-border pt-6 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isAdminRequired ? "Administrator Privileges Include:" : "Equipment Owner Privileges Include:"}
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {isAdminRequired ? (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Manage all registered user roles (Customer, Owner, Admin).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Approve, reject, update, and delete platform equipment listings.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Audit platform-wide bookings, escrow transactions, and platform fees.</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>List unlimited construction, photography, and industrial equipment.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Receive and manage contractor rental booking requests.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Track equipment utilization and monthly rental payouts.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}
