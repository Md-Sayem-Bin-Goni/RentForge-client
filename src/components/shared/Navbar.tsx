"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  Shield,
  Wrench,
  Loader2,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { syncUserAndFetchJwt } from "@/lib/auth-sync";

// Custom SVG Logo for RentForge: Anvil & Forging Spark
export function RentForgeLogo({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RentForge Logo"
    >
      <defs>
        <linearGradient id="rf-emerald-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="rf-spark-gradient" x1="12" y1="6" x2="24" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Hexagonal Industrial Base */}
      <polygon
        points="18,2 32,10 32,26 18,34 4,26 4,10"
        fill="#111827"
        stroke="url(#rf-emerald-gradient)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Anvil Outline */}
      <path
        d="M10 16H26L24 20H20C19.5 22 18.5 24 21 25V26H15V25C17.5 24 16.5 22 16 20H12L10 16Z"
        fill="url(#rf-emerald-gradient)"
      />

      {/* Forging Spark / Energy Diamond */}
      <path
        d="M18 7L20 11L18 15L16 11Z"
        fill="url(#rf-spark-gradient)"
      />
      <circle cx="18" cy="11" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Better-Auth Session
  const { data: session, isPending } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  // Handle theme mounting state to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Sync user with backend whenever session user is detected (covers Google Social Login, email login, and page reloads)
  React.useEffect(() => {
    if (session?.user?.email) {
      syncUserAndFetchJwt({
        name: session.user.name || undefined,
        email: session.user.email,
        image: session.user.image || undefined,
      });
    }
  }, [session?.user?.email]);

  // Close mobile menu on navigation
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Equipment", href: "/equipment" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About Us", href: "/about" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#111827] text-gray-100 shadow-md backdrop-blur-md dark:border-gray-850 dark:bg-[#030712]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          aria-label="RentForge Homepage"
        >
          <div className="relative flex items-center justify-center">
            <RentForgeLogo className="size-9 drop-shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-transform duration-300 group-hover:rotate-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">
              Rent<span className="font-extrabold text-emerald-400">Forge</span>
            </span>
            <span className="hidden text-[10px] font-medium tracking-widest text-emerald-500/80 uppercase sm:inline-block">
              Equipment Rental
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
                  active
                    ? "text-emerald-400 bg-emerald-950/40 font-semibold shadow-inner"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-emerald-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions: Theme Toggle + Auth State */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Dark/Light Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="relative flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800/80 text-gray-300 transition-colors hover:border-emerald-500/50 hover:bg-gray-700/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="size-4 text-emerald-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="size-4 text-emerald-300 transition-transform duration-200 hover:-rotate-12" />
              )
            ) : (
              <div className="size-4" />
            )}
          </button>

          {/* Conditional Auth State */}
          {isPending ? (
            /* Loading Skeleton to prevent flickering */
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 animate-pulse rounded-md bg-gray-800" />
              <div className="h-8 w-20 animate-pulse rounded-md bg-emerald-900/40" />
            </div>
          ) : session?.user ? (
            /* Logged In: Dashboard + User Badge + Logout */
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-sm font-medium text-emerald-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-900/50 hover:text-white"
              >
                <LayoutDashboard className="size-4 text-emerald-400" />
                <span>Dashboard</span>
              </Link>

              {/* User Role Badge / Name */}
              <div className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-850 px-2.5 py-1 text-xs text-gray-300">
                <User className="size-3.5 text-emerald-400" />
                <span className="max-w-[100px] truncate font-medium">
                  {session.user.name || session.user.email?.split("@")[0] || "User"}
                </span>
                {userRole && (
                  <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[10px] font-semibold text-emerald-400 uppercase">
                    {userRole}
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Log out"
                className="flex items-center gap-1.5 rounded-lg border border-gray-750 bg-gray-800/80 px-2.5 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:border-red-500/40 hover:bg-red-950/30 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-4 animate-spin text-gray-400" />
                ) : (
                  <LogOut className="size-4 text-gray-400 group-hover:text-red-300" />
                )}
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>
          ) : (
            /* Logged Out: Login + Register */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-600 hover:bg-gray-700/60 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/50 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-700/40 active:translate-y-px"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu & Theme Button */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 hover:text-white"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="size-4 text-emerald-400" />
              ) : (
                <Moon className="size-4 text-emerald-300" />
              )
            ) : (
              <div className="size-4" />
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-200 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-800 bg-[#111827] px-4 pt-3 pb-6 sm:px-6 md:hidden dark:bg-[#030712]">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                    active
                      ? "bg-emerald-950/50 font-semibold text-emerald-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Divider & Actions */}
          <div className="mt-4 border-t border-gray-800 pt-4">
            {isPending ? (
              <div className="space-y-2">
                <div className="h-9 w-full animate-pulse rounded-lg bg-gray-800" />
                <div className="h-9 w-full animate-pulse rounded-lg bg-emerald-900/30" />
              </div>
            ) : session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-gray-800/80 px-3 py-2 text-sm text-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-emerald-400" />
                    <span>{session.user.name || session.user.email}</span>
                  </div>
                  {userRole && (
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 uppercase">
                      {userRole}
                    </span>
                  )}
                </div>

                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  <LayoutDashboard className="size-4" />
                  <span>Go to Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-900/30 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-center text-sm font-medium text-gray-200 hover:bg-gray-750 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <React.Suspense
      fallback={
        <header className="sticky top-0 z-50 h-16 w-full border-b border-gray-800 bg-[#111827] shadow-md" />
      }
    >
      <NavbarContent />
    </React.Suspense>
  );
}
