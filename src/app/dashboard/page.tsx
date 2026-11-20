"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Wrench,
  DollarSign,
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
  Users,
  BarChart3,
  Search,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { axiosSecure } from "@/lib/axiosSecure";

export default function DashboardOverviewPage() {
  const { data: session } = useSession();
  const [role, setRole] = React.useState<"customer" | "owner" | "admin">("customer");

  React.useEffect(() => {
    let isCancelled = false;

    const fetchRole = async () => {
      if (!session?.user?.email) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const email = encodeURIComponent(session.user.email);
        const res = await axiosSecure.get(`${apiUrl}/api/users/${email}`);

        if (!isCancelled && res.data) {
          const u = res.data.user || res.data;
          if (u.role) setRole(u.role);
          return;
        }
      } catch (err) {
        // Fallback
      }

      if (!isCancelled) {
        setRole(((session?.user as any)?.role as any) || "customer");
      }
    };

    fetchRole();

    return () => {
      isCancelled = true;
    };
  }, [session]);

  const userName = session?.user?.name || "Contractor";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#111827] via-[#091b15] to-[#111827] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-60 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{role} Workspace</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back, {userName}
            </h1>
            <p className="mt-2 text-sm text-gray-300 max-w-xl leading-relaxed">
              {role === "admin"
                ? "Manage platform equipment approvals, verify contractor registrations, and track system revenue."
                : role === "owner"
                ? "Track your machinery fleet utilization, respond to booking requests, and manage payouts."
                : "Manage your active jobsite rentals, browse saved equipment, and track delivery schedules."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {role === "owner" ? (
              <Link
                href="/dashboard/add-equipment"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
              >
                <PlusCircle className="size-4" />
                <span>List New Equipment</span>
              </Link>
            ) : role === "admin" ? (
              <Link
                href="/dashboard/manage-equipment"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
              >
                <ShieldCheck className="size-4" />
                <span>Review Approvals</span>
              </Link>
            ) : (
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
              >
                <Search className="size-4" />
                <span>Browse Equipment</span>
              </Link>
            )}
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/80 px-5 py-3 text-xs sm:text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {role === "admin" ? (
          <>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Total Users</span>
                <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">1,420</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">+18 this week</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Pending Approvals</span>
                <ShieldCheck className="size-4 text-amber-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">14</p>
              <p className="mt-1 text-xs text-amber-600 font-medium">Requires review</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Active Rentals</span>
                <ShoppingBag className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">84</p>
              <p className="mt-1 text-xs text-muted-foreground">Across all regions</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Total Escrow Volume</span>
                <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">$148,200</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">Platform revenue: $14,820</p>
            </div>
          </>
        ) : role === "owner" ? (
          <>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Machines Listed</span>
                <Wrench className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">6</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">All approved &amp; live</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Active On Jobsite</span>
                <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">4</p>
              <p className="mt-1 text-xs text-muted-foreground">67% fleet utilization</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Month Earnings</span>
                <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">$6,840</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">+14% vs last month</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Owner Rating</span>
                <ShieldCheck className="size-4 text-amber-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">4.96 ★</p>
              <p className="mt-1 text-xs text-muted-foreground">38 verified reviews</p>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Active Rentals</span>
                <ShoppingBag className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">1</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">CAT 308 CR Excavator</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Saved Equipment</span>
                <Heart className="size-4 text-red-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">4</p>
              <p className="mt-1 text-xs text-muted-foreground">In your favorites list</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Completed Rentals</span>
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">12</p>
              <p className="mt-1 text-xs text-muted-foreground">100% on-time returns</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Security Deposit</span>
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-foreground">$500</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">Escrow protected</p>
            </div>
          </>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/profile"
          className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Manage Profile
            </span>
            <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Update your contact phone, jobsite address, and profile photo.
          </p>
        </Link>

        <Link
          href="/equipment"
          className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Browse Equipment Fleet
            </span>
            <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Search 140+ certified machines, tools, and heavy vehicles.
          </p>
        </Link>

        <Link
          href="/how-it-works"
          className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Rental Protection &amp; Terms
            </span>
            <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Review your damage waiver, escrow safety, and dispatch hotline.
          </p>
        </Link>
      </div>
    </div>
  );
}
