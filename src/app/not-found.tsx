import * as React from "react";
import Link from "next/link";
import { HardHat, Home, Wrench, ArrowRight, HelpCircle } from "lucide-react";
import { RentForgeLogo } from "@/components/shared/Navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Ambient Emerald Glow */}
      <div className="relative flex flex-col items-center max-w-xl">
        <div className="absolute -top-14 size-56 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />

        {/* 404 Badge with Brand Logo */}
        <div className="relative mb-6 flex items-center justify-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/20 shadow-inner">
            <RentForgeLogo className="size-10" />
          </div>
          <span className="text-6xl font-black tracking-tight text-foreground sm:text-7xl">
            4<span className="text-emerald-600 dark:text-emerald-400">0</span>4
          </span>
        </div>

        {/* Tagline */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <HardHat className="size-3.5" />
          <span>EQUIPMENT NOT LOCATED</span>
        </div>

        {/* Main Heading & Description */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Lost in the Equipment Yard?
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-md">
          The machine, tool, or page you were looking for has been moved, rented out,
          or does not exist in our registry.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 w-full sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/30 transition-all hover:bg-emerald-500 active:translate-y-px"
          >
            <Home className="size-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/equipment"
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Wrench className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Browse All Equipment</span>
          </Link>
        </div>

        {/* Useful Navigation Helper Links */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md text-left">
          <Link
            href="/how-it-works"
            className="group flex items-center justify-between rounded-lg border border-border bg-card/60 p-3 text-xs transition-colors hover:border-emerald-500/50 hover:bg-accent/40"
          >
            <div className="flex items-center gap-2 text-foreground">
              <HelpCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>How Rental Works</span>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/about"
            className="group flex items-center justify-between rounded-lg border border-border bg-card/60 p-3 text-xs transition-colors hover:border-emerald-500/50 hover:bg-accent/40"
          >
            <div className="flex items-center gap-2 text-foreground">
              <HardHat className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>About RentForge</span>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
