import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Truck,
  Clock,
  ArrowRight,
  HardHat,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { RentForgeLogo } from "@/components/shared/Navbar";

export default function Home() {
  const categories = [
    {
      title: "Earthmoving & Excavators",
      count: "48 Available",
      desc: "Mini excavators, skid steers, backhoes, and trenchers for heavy excavation.",
      icon: HardHat,
    },
    {
      title: "Aerial & Scissor Lifts",
      count: "32 Available",
      desc: "Electric scissor lifts, articulating boom lifts, and vertical mast lifts.",
      icon: Wrench,
    },
    {
      title: "Generators & Site Power",
      count: "27 Available",
      desc: "Towable diesel generators, power distribution panels, and site light towers.",
      icon: Sparkles,
    },
    {
      title: "Compaction Equipment",
      count: "19 Available",
      desc: "Smooth drum rollers, vibratory trench rollers, and reversible plate compactors.",
      icon: Truck,
    },
  ];

  const features = [
    {
      title: "Verified Owners & Gear",
      desc: "Every machine and tool undergoes safety inspection and owner verification before listing.",
    },
    {
      title: "Comprehensive Coverage",
      desc: "Damage waiver and protection plans built into every rental agreement.",
    },
    {
      title: "Flexible Jobsite Delivery",
      desc: "Direct jobsite drop-off and pickup coordinated with verified transport partners.",
    },
    {
      title: "Transparent Daily Rates",
      desc: "Zero hidden fees. Clear daily, weekly, and monthly commercial pricing.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-10 dark:opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Modern Heavy Equipment & Tool Rental</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Power Your Projects with{" "}
              <span className="text-emerald-600 dark:text-emerald-400">RentForge</span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Rent high-performance machinery, commercial power tools, and industrial equipment
              from verified owners. On-demand jobsite delivery, insured rentals, and transparent pricing.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/equipment"
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-emerald-950/20 transition-all hover:bg-emerald-500 active:translate-y-px"
              >
                <span>Browse All Equipment</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>How It Works</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Equipment Categories */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                Categories
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Ready for Every Jobsite
              </h2>
            </div>
            <Link
              href="/equipment"
              className="group flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>View all categories</span>
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Category Cards with uniform height and width */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-950/5"
                >
                  <div>
                    <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-foreground">{cat.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {cat.count}
                    </span>
                    <span className="text-muted-foreground group-hover:text-foreground">
                      Explore &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why RentForge Section */}
      <section className="border-t border-border bg-muted/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineered for Contractors and Builders
            </h2>
            <p className="mt-3 text-muted-foreground">
              RentForge removes downtime and simplifies equipment logistics with verified safety standards.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat) => (
              <div key={feat.title} className="flex flex-col items-start rounded-lg bg-card p-5 border border-border">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="mt-3 text-base font-semibold text-foreground">{feat.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
