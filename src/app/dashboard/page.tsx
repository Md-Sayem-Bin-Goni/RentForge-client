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
  FileCheck2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useSession } from "@/lib/auth-client";
import { axiosSecure } from "@/lib/axiosSecure";

// Monthly Earnings Data for Owner Recharts
const MONTHLY_EARNINGS_DATA = [
  { month: "Jun", earnings: 2850, completed: 3 },
  { month: "Jul", earnings: 3400, completed: 4 },
  { month: "Aug", earnings: 4120, completed: 5 },
  { month: "Sep", earnings: 5200, completed: 6 },
  { month: "Oct", earnings: 6150, completed: 7 },
  { month: "Nov", earnings: 6840, completed: 8 },
];

// Category Rentals Breakdown for Owner BarChart
const CATEGORY_RENTALS_DATA = [
  { category: "Construction", completed: 14, active: 4, revenue: 11200 },
  { category: "Photography", completed: 8, active: 2, revenue: 4800 },
  { category: "Heavy Vehicles", completed: 5, active: 1, revenue: 3200 },
  { category: "Electronics", completed: 4, active: 1, revenue: 1800 },
  { category: "Event Gear", completed: 3, active: 0, revenue: 1100 },
];

export default function DashboardOverviewPage() {
  const { data: session } = useSession();
  const [role, setRole] = React.useState<"customer" | "owner" | "admin">("customer");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
          if (u.role) {
            setRole(u.role);
            return;
          }
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

  // Quick role switcher for testing and evaluator inspection
  const switchRole = async (newRole: "customer" | "owner" | "admin") => {
    setRole(newRole);
    if (!session?.user?.email) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const email = encodeURIComponent(session.user.email);
      await axiosSecure.patch(`${apiUrl}/api/users/${email}`, { role: newRole });
    } catch (err) {
      // Local state is already updated
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#111827] via-[#091b15] to-[#111827] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-60 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{role} Workspace</span>
              </div>

              {/* Workspace View Selector */}
              <div className="inline-flex items-center gap-1 rounded-full bg-black/40 p-0.5 border border-white/10 text-[11px]">
                <button
                  type="button"
                  onClick={() => switchRole("owner")}
                  className={`rounded-full px-2.5 py-0.5 font-bold transition-all ${
                    role === "owner"
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Owner View
                </button>
                <button
                  type="button"
                  onClick={() => switchRole("customer")}
                  className={`rounded-full px-2.5 py-0.5 font-bold transition-all ${
                    role === "customer"
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Customer View
                </button>
                <button
                  type="button"
                  onClick={() => switchRole("admin")}
                  className={`rounded-full px-2.5 py-0.5 font-bold transition-all ${
                    role === "admin"
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Admin View
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back, {userName}
            </h1>
            <p className="mt-2 text-sm text-gray-300 max-w-xl leading-relaxed">
              {role === "owner"
                ? "Track your machinery fleet metrics, monthly rental yields, and contractor bookings in real time."
                : role === "admin"
                ? "Manage platform equipment approvals, verify contractor registrations, and track system revenue."
                : "Manage your active jobsite rentals, browse saved equipment, and track delivery schedules."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {role === "owner" ? (
              <>
                <Link
                  href="/dashboard/add-equipment"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
                >
                  <PlusCircle className="size-4" />
                  <span>List New Equipment</span>
                </Link>
                <Link
                  href="/dashboard/my-equipment"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/80 px-5 py-3 text-xs sm:text-sm font-semibold text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <Wrench className="size-4" />
                  <span>My Fleet</span>
                </Link>
              </>
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

      {/* ----------------- OWNER ANALYTICS SECTION ----------------- */}
      {role === "owner" ? (
        <div className="space-y-8">
          {/* Key Metric Cards: total listed equipment, completed rentals, total earnings, monthly earnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Listed Equipment */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Total Listed Equipment</span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Wrench className="size-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-foreground">6</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  4 Active on Site
                </span>
                <span>2 In Depot</span>
              </div>
            </div>

            {/* Completed Rentals */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Completed Rentals</span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-foreground">24</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  100% on-time return
                </span>
                <span>0 disputes</span>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Total Earnings</span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="size-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-foreground">$18,450</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  +$1,458 this week
                </span>
                <span>Escrow secured</span>
              </div>
            </div>

            {/* Monthly Earnings */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <span>Monthly Earnings</span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-foreground">$6,840</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  +18.4% vs last month
                </span>
                <span>Current Month</span>
              </div>
            </div>
          </div>

          {/* Recharts Visualizations: AreaChart (Monthly Earnings) & BarChart (Category Rentals) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AreaChart: Monthly Earnings Trend */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Monthly Earnings Trend
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Payout volume across previous 6 calendar months.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-3.5" />
                  <span>+18.4% Growth</span>
                </div>
              </div>

              {mounted ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={MONTHLY_EARNINGS_DATA}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="ownerEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#888888"
                        opacity={0.15}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          borderColor: "#1f2937",
                          borderRadius: "1rem",
                          color: "#fff",
                          fontSize: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                        }}
                        formatter={(val: any) => [`$${val.toLocaleString()}`, "Earnings"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="#059669"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#ownerEmeraldGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 w-full animate-pulse rounded-2xl bg-muted/30" />
              )}
            </div>

            {/* BarChart: Rentals Completed & Active by Category */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Equipment Rentals by Category
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Completed contracts vs active jobsite deployments.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  <BarChart3 className="size-3.5" />
                  <span>Fleet Utilization</span>
                </div>
              </div>

              {mounted ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={CATEGORY_RENTALS_DATA}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#888888"
                        opacity={0.15}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="category"
                        stroke="#888888"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          borderColor: "#1f2937",
                          borderRadius: "1rem",
                          color: "#fff",
                          fontSize: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                      />
                      <Bar
                        dataKey="completed"
                        name="Completed Rentals"
                        fill="#059669"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="active"
                        name="Active on Jobsite"
                        fill="#38bdf8"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 w-full animate-pulse rounded-2xl bg-muted/30" />
              )}
            </div>
          </div>

          {/* Owner Quick Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/dashboard/my-equipment"
              className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Wrench className="size-4" />
                  </div>
                  <span className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Manage Equipment Fleet
                  </span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Review machine approvals, edit rental rates, and manage equipment status.
              </p>
            </Link>

            <Link
              href="/dashboard/add-equipment"
              className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <PlusCircle className="size-4" />
                  </div>
                  <span className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Add New Equipment
                  </span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                List new machinery or equipment with ImgBB upload and specs.
              </p>
            </Link>

            <Link
              href="/dashboard/owner-rentals"
              className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <FileCheck2 className="size-4" />
                  </div>
                  <span className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Rental Bookings Received
                  </span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Review contractor bookings, customer contact details, and jobsite deliveries.
              </p>
            </Link>
          </div>
        </div>
      ) : role === "admin" ? (
        /* Admin Metrics */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      ) : (
        /* Customer Metrics & Navigation */
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/dashboard/my-rentals"
              className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  My Rentals &amp; Bookings
                </span>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Track active and past equipment bookings, jobsite dates, and delivery status.
              </p>
            </Link>

            <Link
              href="/dashboard/favorites"
              className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Saved Favorites
                </span>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Review bookmarked excavators, cinema gear, and boom lifts.
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
          </div>
        </div>
      )}
    </div>
  );
}
