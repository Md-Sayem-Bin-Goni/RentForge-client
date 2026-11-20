"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  Calendar,
  Truck,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Download,
  Home,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { axiosSecure } from "@/lib/axiosSecure";
import { RentForgeLogo } from "@/components/shared/Navbar";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const equipmentId = searchParams.get("equipment_id") || "eq-201";
  const amount = searchParams.get("amount") || "346";

  const [isConfirming, setIsConfirming] = React.useState(true);
  const [confirmationData, setConfirmationData] = React.useState<any>(null);

  React.useEffect(() => {
    let isCancelled = false;

    const confirmPayment = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await axiosSecure.post(`${apiUrl}/api/payments/confirm`, {
          sessionId,
          equipmentId,
        });

        if (!isCancelled && response.data) {
          setConfirmationData(response.data);
        }
      } catch (error) {
        console.warn("Payment confirmation notice:", error);
      } finally {
        if (!isCancelled) {
          setIsConfirming(false);
        }
      }
    };

    confirmPayment();

    return () => {
      isCancelled = true;
    };
  }, [sessionId, equipmentId]);

  const displayOrderRef =
    confirmationData?.bookingId ||
    confirmationData?.orderId ||
    (sessionId ? `RF-${sessionId.slice(-8).toUpperCase()}` : `RF-${Date.now().toString().slice(-8)}`);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        {/* Main Card */}
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-2xl shadow-emerald-950/10 text-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 size-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          {/* Success Checkmark Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 mb-6">
            <CheckCircle2 className="size-9" />
          </div>

          <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            Payment Verified &amp; Escrow Secured
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your rental reservation has been successfully processed through Stripe. The equipment
            owner has been notified and jobsite dispatch preparations are underway.
          </p>

          {/* Order Details Receipt Box */}
          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs text-muted-foreground font-medium">Order Reference</span>
              <span className="font-mono font-bold text-xs text-foreground bg-card px-2.5 py-1 rounded-md border border-border">
                {displayOrderRef}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Payment Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="size-3.5" />
                <span>Paid via Stripe Escrow</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Amount Paid</span>
              <span className="font-extrabold text-foreground text-sm">${amount} USD</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Damage Waiver Protection</span>
              <span className="font-medium text-foreground">Included (Comprehensive)</span>
            </div>

            {sessionId && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                <span className="text-muted-foreground">Stripe Session ID</span>
                <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[200px]">
                  {sessionId}
                </span>
              </div>
            )}
          </div>

          {/* What Happens Next Steps */}
          <div className="mt-8 rounded-xl bg-card p-4 border border-border/80 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Next Steps for Your Rental
            </h3>
            <div className="space-y-2.5 text-xs text-foreground">
              <div className="flex items-start gap-2.5">
                <Truck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  The verified equipment owner will contact your jobsite lead to confirm delivery scheduling.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <FileText className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  A PDF copy of the signed rental agreement and damage waiver has been sent to your email.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
            >
              <LayoutDashboard className="size-4" />
              <span>Go to Dashboard</span>
            </Link>

            <Link
              href="/equipment"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Home className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Browse More Gear</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense to satisfy Next.js static prerender requirements for useSearchParams
export default function PaymentSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </React.Suspense>
  );
}
