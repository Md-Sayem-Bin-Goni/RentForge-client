"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle2,
  FileText,
  Lock,
  Scale,
  Sparkles,
  ArrowRight,
  Search,
  Hammer,
  Truck,
} from "lucide-react";
import { RentForgeLogo } from "@/components/shared/Navbar";

export default function AboutPage() {
  const stats = [
    { value: "2,850+", label: "Certified Heavy Machines & Gear Kits" },
    { value: "$3.4M+", label: "Direct Owner Rental Earnings" },
    { value: "99.8%", label: "Verified Safety & Inspection Score" },
    { value: "62,000+", label: "Jobsite Rental Days Completed" },
  ];

  const values = [
    {
      title: "Zero Equipment Downtime",
      desc: "Construction and production delays cost thousands per hour. Our fleet swap guarantee ensures your crew never waits on broken machines.",
      icon: Hammer,
    },
    {
      title: "Verified Commercial Owners",
      desc: "Every equipment owner on RentForge passes identity, commercial registration, and mechanical inspection vetting before their machinery goes live.",
      icon: ShieldCheck,
    },
    {
      title: "Transparent Peer-to-Peer Pricing",
      desc: "No hidden dealership surcharges. Contractors rent directly at fair market rates with transparent damage waivers and escrowed deposits.",
      icon: Award,
    },
    {
      title: "Seamless Nationwide Logistics",
      desc: "Whether you need a 30-ton excavator hauled to a rural highway project or an 8K camera package delivered downtown, we coordinate fast dispatch.",
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-[#111827] py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/90 via-[#111827]/80 to-[#090D16] z-10" />
        <div className="absolute top-1/4 -left-20 size-96 rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none z-10" />
        <div className="absolute bottom-1/4 -right-20 size-96 rounded-full bg-emerald-600/15 blur-[140px] pointer-events-none z-10" />

        <div className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold text-emerald-300">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span className="uppercase tracking-wider">Our Story &amp; Mission</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
            Forging the Future of On-Demand Equipment Infrastructure
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            RentForge was founded to solve a multi-billion dollar problem: idle heavy equipment sitting
            in contractor yards while neighboring job sites suffer from weeks of rental lead times.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition-colors"
            >
              <Search className="size-4" />
              <span>Explore Equipment Fleet</span>
            </Link>
            <Link
              href="/register?role=owner"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/80 px-6 py-3.5 text-sm font-semibold text-gray-200 hover:border-emerald-500/50 hover:bg-gray-800 transition-colors"
            >
              <span>List Your Machinery</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUES & PURPOSE */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              Our Standard
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Built by Industrial Operators, for Contractors
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              We combine bank-grade digital security with real-world heavy machinery expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-emerald-500/50 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ANCHOR SECTION: LEGAL POLICIES & TERMS */}
      <section className="py-20 lg:py-28 bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              Compliance &amp; Governance
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Platform Terms &amp; Policies
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Clear rules protecting renters, equipment owners, and project stakeholders.
            </p>
          </div>

          {/* 1. TERMS OF SERVICE (#terms) */}
          <div
            id="terms"
            className="scroll-mt-24 rounded-2xl border border-border bg-card p-8 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileText className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Terms of Service</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                By accessing or using RentForge, users agree to abide by all platform rules and
                applicable state and federal commercial equipment leasing laws. Renters must possess
                all valid operator licenses and credentials required for operating specialized machinery.
              </p>
              <p>
                Equipment owners warrant that all listed machines are legally owned, free of undisclosed
                liens, and regularly maintained according to manufacturer specifications and OSHA safety codes.
              </p>
            </div>
          </div>

          {/* 2. PRIVACY POLICY (#privacy) */}
          <div
            id="privacy"
            className="scroll-mt-24 rounded-2xl border border-border bg-card p-8 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Lock className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Privacy &amp; Data Security</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                RentForge enforces strict data privacy standards. All payment details, credit cards,
                and bank accounts are tokenized and processed securely by Stripe without ever touching
                our core application databases.
              </p>
              <p>
                Personal contact information and jobsite coordinates are encrypted and shared strictly
                between verified counterparties during an active rental booking for logistical dispatch.
              </p>
            </div>
          </div>

          {/* 3. MASTER RENTAL AGREEMENT (#agreement) */}
          <div
            id="agreement"
            className="scroll-mt-24 rounded-2xl border border-border bg-card p-8 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Building2 className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Master Rental Agreement</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                Every booking finalized through RentForge constitutes a legally binding commercial lease
                between the Equipment Owner and Renter. Operating allowances, daily engine hour limits,
                and fuel return terms are explicitly stated in each equipment listing.
              </p>
              <p>
                Pre-rental and post-rental photo inspections completed during equipment handover govern
                the return condition and deposit release process.
              </p>
            </div>
          </div>

          {/* 4. DISPUTE RESOLUTION (#disputes) */}
          <div
            id="disputes"
            className="scroll-mt-24 rounded-2xl border border-border bg-card p-8 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Scale className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Dispute Resolution &amp; Arbitration</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                In the rare event of a disagreement regarding damage, condition, or late returns,
                RentForge provides dedicated neutral claims mediation. Both parties submit handover
                logs, telemetry records, and photos.
              </p>
              <p>
                Claims unresolved through mediation are subject to binding commercial arbitration in
                accordance with standard American Arbitration Association (AAA) guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 bg-[#111827] text-white text-center border-t border-gray-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <RentForgeLogo className="size-12 mx-auto mb-4 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
          <h2 className="text-2xl sm:text-3xl font-extrabold">Join America&apos;s Pro Equipment Network</h2>
          <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
            Whether you need certified machinery on site tomorrow or want to monetize idle fleet assets.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/equipment"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition-colors"
            >
              Explore Equipment Fleet
            </Link>
            <Link
              href="/register?role=owner"
              className="rounded-xl border border-gray-700 bg-gray-800 px-6 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-750 transition-colors"
            >
              List Machinery as Owner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
