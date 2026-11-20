"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Wrench, LifeBuoy } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}) {
  React.useEffect(() => {
    // Log the error for observability
    console.error("RentForge Application Error:", error);
  }, [error]);

  const handleRetry = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-xl shadow-emerald-950/5">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 size-40 rounded-full bg-red-500/10 blur-2xl dark:bg-emerald-500/10" />

        {/* Error Icon Badge */}
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-500/30">
          <AlertTriangle className="size-7" />
        </div>

        {/* Header Content */}
        <div className="mt-5 text-center">
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Equipment Fault Detected
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            We encountered an unexpected error while loading this equipment resource.
            Our technical team has been notified.
          </p>
        </div>

        {/* Error Digest or Message details (when available) */}
        {error?.digest && (
          <div className="mt-4 rounded-lg border border-border/80 bg-muted/60 p-3 text-center text-xs text-muted-foreground font-mono">
            Error Reference ID: <span className="font-semibold text-foreground">{error.digest}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={handleRetry}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/30 transition-all hover:bg-emerald-500 active:translate-y-px"
          >
            <RotateCcw className="size-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary"
          >
            <Home className="size-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Quick Links Footer */}
        <div className="mt-6 flex items-center justify-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <Link href="/equipment" className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400">
            <Wrench className="size-3" />
            <span>Browse Equipment</span>
          </Link>
          <span>•</span>
          <a href="mailto:support@rentforge.com" className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400">
            <LifeBuoy className="size-3" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
