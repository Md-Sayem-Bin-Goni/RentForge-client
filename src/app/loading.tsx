import * as React from "react";
import { RentForgeLogo } from "@/components/shared/Navbar";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="relative flex flex-col items-center">
        {/* Ambient glow effect */}
        <div className="absolute -top-10 size-48 rounded-full bg-emerald-500/15 blur-3xl" />

        {/* Spinning Outer Ring with Logo in Center */}
        <div className="relative flex size-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-emerald-500 border-r-emerald-400 [animation-duration:1.2s]" />
          <RentForgeLogo className="size-10 animate-pulse drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Brand and Loading Status */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Rent<span className="font-extrabold text-emerald-600 dark:text-emerald-400">Forge</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground animate-pulse">
            Forging equipment and workshop resources...
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-emerald-600 to-emerald-400" />
        </div>
      </div>
    </div>
  );
}
