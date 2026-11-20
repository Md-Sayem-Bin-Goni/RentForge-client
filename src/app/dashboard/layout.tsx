"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  Receipt,
  Wrench,
  PlusCircle,
  FileCheck2,
  DollarSign,
  Users,
  ShieldCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  ChevronRight,
  ExternalLink,
  HardHat,
  Truck,
  Sparkles,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { useSession, signOut } from "@/lib/auth-client";
import { axiosSecure } from "@/lib/axiosSecure";
import { RentForgeLogo } from "@/components/shared/Navbar";

type UserRole = "customer" | "owner" | "admin";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [userRole, setUserRole] = React.useState<UserRole>("customer");
  const [profileData, setProfileData] = React.useState<{
    name?: string;
    image?: string;
    email?: string;
    role?: UserRole;
  } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Fetch logged in user role from backend GET /api/users/:email
  React.useEffect(() => {
    let isCancelled = false;

    const fetchUserRole = async () => {
      if (!session?.user?.email) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const email = encodeURIComponent(session.user.email);
        const res = await axiosSecure.get(`${apiUrl}/api/users/${email}`);

        if (!isCancelled && res.data) {
          const fetchedUser = res.data.user || res.data;
          const role = (fetchedUser.role as UserRole) || "customer";
          setUserRole(role);
          setProfileData(fetchedUser);
          return;
        }
      } catch (err) {
        // Fallback to session user data
      }

      if (!isCancelled) {
        const fallbackRole = ((session?.user as any)?.role as UserRole) || "customer";
        setUserRole(fallbackRole);
        setProfileData({
          name: session.user.name,
          image: session.user.image || undefined,
          email: session.user.email,
          role: fallbackRole,
        });
      }
    };

    fetchUserRole();

    return () => {
      isCancelled = true;
    };
  }, [session]);

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully.");
            window.location.href = "/";
          },
        },
      });
    } catch (err) {
      console.error("Signout error:", err);
      window.location.href = "/";
    }
  };

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Role-specific Navigation Links
  const getNavLinks = (): NavItem[] => {
    const commonLinks: NavItem[] = [
      { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "My Profile", href: "/dashboard/profile", icon: User },
    ];

    if (userRole === "admin") {
      return [
        ...commonLinks,
        { name: "Manage Users", href: "/dashboard/manage-users", icon: Users },
        { name: "Equipment Approvals", href: "/dashboard/manage-equipment", icon: ShieldCheck, badge: "Fleet" },
        { name: "All Bookings", href: "/dashboard/all-bookings", icon: ShoppingBag },
        { name: "Platform Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      ];
    }

    if (userRole === "owner") {
      return [
        ...commonLinks,
        { name: "My Equipment Listings", href: "/dashboard/my-equipment", icon: Wrench },
        { name: "Add New Equipment", href: "/dashboard/add-equipment", icon: PlusCircle },
        { name: "Rental Orders Received", href: "/dashboard/orders", icon: FileCheck2 },
        { name: "Earnings & Payouts", href: "/dashboard/earnings", icon: DollarSign },
      ];
    }

    // Default: customer
    return [
      ...commonLinks,
      { name: "My Rentals & Bookings", href: "/dashboard/bookings", icon: ShoppingBag },
      { name: "My Saved Equipment", href: "/dashboard/favorites", icon: Heart },
      { name: "Payment Receipts", href: "/dashboard/invoices", icon: Receipt },
    ];
  };

  const navLinks = getNavLinks();

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "admin":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
      case "owner":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
    }
  };

  const userName = profileData?.name || session?.user?.name || "Contractor";
  const userEmail = profileData?.email || session?.user?.email || "";
  const userAvatar = profileData?.image || session?.user?.image;

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background flex flex-col lg:flex-row text-foreground">
        {/* DESKTOP SIDEBAR (Full Height Charcoal Theme) */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col justify-between border-r border-gray-800 bg-[#111827] text-gray-200 dark:border-gray-900 dark:bg-[#030712]">
          <div className="flex flex-col flex-1">
            {/* Sidebar Brand Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800 dark:border-gray-850">
              <Link href="/" className="flex items-center gap-2.5">
                <RentForgeLogo className="size-8" />
                <span className="text-xl font-bold tracking-tight text-white">
                  Rent<span className="font-extrabold text-emerald-400">Forge</span>
                </span>
              </Link>
            </div>

            {/* User Profile Summary Card */}
            <div className="p-4 mx-4 my-4 rounded-xl border border-gray-800 bg-gray-850/80 dark:border-gray-800 dark:bg-[#090D16]">
              <div className="flex items-center gap-3">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="size-11 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                  />
                ) : (
                  <div className="flex size-11 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-sm">
                    {userName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{userName}</p>
                  <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                  <span
                    className={`mt-1.5 inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor()}`}
                  >
                    {userRole} Account
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="px-4 py-2">
              <span className="px-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                {userRole === "admin"
                  ? "Admin Controls"
                  : userRole === "owner"
                  ? "Equipment Owner Center"
                  : "Customer Workspace"}
              </span>

              <nav className="mt-2 space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`size-4.5 ${isActive ? "text-white" : "text-emerald-400"}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-md bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Public Links */}
            <div className="px-4 pt-4 mt-auto border-t border-gray-800/80">
              <span className="px-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Platform Shortcuts
              </span>
              <div className="mt-2 space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <Home className="size-4" />
                  <span>Public Homepage</span>
                </Link>
                <Link
                  href="/equipment"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <Wrench className="size-4" />
                  <span>All Equipment Catalog</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Bottom Bar: Theme Toggle & Logout */}
          <div className="p-4 border-t border-gray-800 dark:border-gray-850 flex items-center justify-between">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="flex items-center gap-2 rounded-lg border border-gray-750 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              {mounted && theme === "dark" ? (
                <>
                  <Sun className="size-3.5 text-emerald-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-emerald-300" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="size-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MOBILE TOP BAR (Fixed on Mobile) */}
        <div className="lg:hidden sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-800 bg-[#111827] px-4 text-white shadow-md">
          <Link href="/" className="flex items-center gap-2">
            <RentForgeLogo className="size-7" />
            <span className="text-lg font-bold">
              Rent<span className="text-emerald-400">Forge</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300"
            >
              {mounted && theme === "dark" ? (
                <Sun className="size-4 text-emerald-400" />
              ) : (
                <Moon className="size-4 text-emerald-300" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Dashboard Menu"
              className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-200 hover:bg-gray-700"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* MOBILE SIDEBAR DRAWER (Slide-over with Backdrop) */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Drawer */}
            <div className="relative flex w-80 max-w-full flex-1 flex-col justify-between bg-[#111827] text-gray-200 border-r border-gray-800 p-5 shadow-2xl">
              <div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-2">
                    <RentForgeLogo className="size-7" />
                    <span className="text-lg font-bold text-white">
                      Rent<span className="text-emerald-400">Forge</span> Dashboard
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="rounded-lg p-1 text-gray-400 hover:text-white"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="mt-4 rounded-xl border border-gray-800 bg-gray-850 p-3.5">
                  <div className="flex items-center gap-3">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="size-10 rounded-full object-cover border border-emerald-500"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                        {userName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-white truncate">{userName}</p>
                      <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                      <span
                        className={`mt-1 inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor()}`}
                      >
                        {userRole} Account
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="mt-5 space-y-1">
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`size-4.5 ${isActive ? "text-white" : "text-emerald-400"}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded-md bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Drawer Bottom */}
              <div className="pt-4 border-t border-gray-800 space-y-2">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-xs font-semibold text-gray-200"
                >
                  <Home className="size-4" />
                  <span>Return to Homepage</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-2.5 text-xs font-semibold text-red-300"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD CONTENT VIEWPORT (Full Width) */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Content Bar: Breadcrumbs & Role Indicator */}
          <div className="hidden lg:flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/60 px-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                Dashboard
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold capitalize">
                {pathname === "/dashboard"
                  ? "Overview"
                  : pathname.replace("/dashboard/", "").replace("-", " ")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor()}`}
              >
                Role: {userRole}
              </span>
              <span className="text-xs text-muted-foreground">
                Signed in as <strong className="text-foreground">{userEmail}</strong>
              </span>
            </div>
          </div>

          {/* Child Page Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </React.Suspense>
  );
}
