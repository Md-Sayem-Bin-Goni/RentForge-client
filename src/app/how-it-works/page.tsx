"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  HardHat,
  ArrowRight,
  Award,
  ChevronDown,
} from "lucide-react";

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Search & Compare Verified Equipment",
      description:
        "Filter thousands of machines across excavation, aerial lifts, heavy transport, and cinema kits. Check real-time owner ratings, machine specs, operating hours, and location.",
      features: [
        "Certified mechanical inspection badges",
        "Clear daily, weekly, and monthly rates",
        "Available inventory near your project site",
      ],
    },
    {
      step: "02",
      icon: CreditCard,
      title: "Book & Escrow with Stripe Security",
      description:
        "Select your rental dates and quantity. Submit payment through bank-level encrypted Stripe checkout. Funds and refundable damage deposits are held safely in escrow.",
      features: [
        "No hidden platform fees or surprise surcharges",
        "Transparent refundable security deposit",
        "Free cancellation up to 48 hours prior",
      ],
    },
    {
      step: "03",
      icon: Truck,
      title: "Direct Jobsite Haul or Yard Pickup",
      description:
        "Choose direct flatbed haul-off straight to your construction jobsite, or coordinate quick local pickup from the owner's depot with digital check-in.",
      features: [
        "Digital photo handover and condition logs",
        "Owner briefing on controls and safety protocols",
        "Fuel and hour-meter verification at drop-off",
      ],
    },
    {
      step: "04",
      icon: RotateCcw,
      title: "Perform Your Build & Easy Return",
      description:
        "Operate with complete peace of mind backed by the RentForge Protection Guarantee. When your lease ends, schedule pickup and receive instant deposit release.",
      features: [
        "24/7 on-call jobsite emergency support",
        "Instant digital return inspection sign-off",
        "Automatic escrow deposit refund within 24 hours",
      ],
    },
  ];

  const faqs = [
    {
      q: "How does the RentForge Damage Waiver & Protection work?",
      a: "Our optional comprehensive Damage Waiver covers accidental jobsite damage, hydraulic rollovers, and glass breakage with zero deductible up to $1,000,000. It shields both contractors and owners from costly out-of-pocket downtime.",
    },
    {
      q: "When is my security deposit released back to my account?",
      a: "Upon completion of the rental and completion of the digital check-out condition report, your refundable security deposit is automatically released via Stripe within 24 hours.",
    },
    {
      q: "Can I extend my rental duration while the machine is on site?",
      a: "Yes. Simply navigate to your Customer Dashboard > My Rentals, select your active booking, and request an extension. Once approved by the owner, your billing is prorated seamlessly.",
    },
    {
      q: "What if a machine breaks down or malfunctions during my rental?",
      a: "We maintain a Zero Downtime promise. If a mechanical failure occurs through normal operation, our 24/7 field dispatch coordinates an emergency field mechanic or delivers a replacement unit within 4 hours.",
    },
    {
      q: "How are equipment owners vetted and approved?",
      a: "Every owner undergoes strict identity, commercial insurance, and fleet maintenance verification before their listings are approved by our administration team.",
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
            <span className="uppercase tracking-wider">Simple, Verified &amp; Protected</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
            How RentForge Works
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From discovering specialized machinery to guaranteed jobsite delivery and escrow
            protection, here is how we power America&apos;s builds.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition-colors"
            >
              <Search className="size-4" />
              <span>Explore Fleet</span>
            </Link>
            <Link
              href="/register?role=owner"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/80 px-6 py-3.5 text-sm font-semibold text-gray-200 hover:border-emerald-500/50 hover:bg-gray-800 transition-colors"
            >
              <span>List Your Equipment</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4-STEP WORKFLOW SECTION */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              The 4-Step Process
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              From Blueprint to Operational Jobsite
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Zero hassle, zero surprise paperwork. Rent industrial gear in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-emerald-600/30 dark:text-emerald-500/30">
                      {st.step}
                    </span>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Icon className="size-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">{st.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {st.description}
                  </p>

                  <ul className="space-y-2.5 border-t border-border pt-4">
                    {st.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-foreground">
                        <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ANCHOR SECTION: THE RENTFORGE PROTECTION GUARANTEE (#protection) */}
      <section
        id="protection"
        className="scroll-mt-24 py-20 lg:py-28 bg-[#111827] text-white border-y border-gray-800"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="size-4" />
              <span>Jobsite Guarantee</span>
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              The RentForge Protection Guarantee
            </h2>
            <p className="mt-3 text-base text-gray-400">
              Contractors trust us with mission-critical projects because our protection policies
              cover every machine from dispatch to return.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">$1M Damage Waiver</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Comprehensive damage protection covering hydraulic rollovers, mechanical failure,
                and accidental jobsite impact with zero out-of-pocket deductibles.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                <Clock className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">4-Hour Swap Guarantee</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                If any certified machinery experiences mechanical fault, our emergency on-call team
                swaps or repairs it within 4 hours to eliminate downtime.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                <Award className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">42-Point Inspection</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Every listed asset undergoes an independent 42-point safety, fluid, and mechanical
                certification before being approved for deployment.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                <CreditCard className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Stripe Escrow Release</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Your deposit and rental funds are safely escrowed. Owners receive payout only upon
                successful verification of delivery and performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 lg:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              Got Questions?
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything you need to know about the RentForge equipment leasing platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background p-5 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between text-left text-sm sm:text-base font-bold text-foreground"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`size-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-950 via-[#06261c] to-[#041f17] text-white text-center">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Power Your Next Build?</h2>
          <p className="mt-3 text-sm text-emerald-200/80 max-w-xl mx-auto">
            Browse hundreds of machines ready for immediate jobsite dispatch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/equipment"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#090D16] shadow-lg hover:bg-emerald-50 transition-colors"
            >
              Browse Equipment Catalog
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-emerald-500/40 bg-emerald-900/30 px-6 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-900/60 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
