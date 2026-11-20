"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import axios from "axios";
import {
  HardHat,
  Camera,
  Truck,
  Tractor,
  Cpu,
  PartyPopper,
  ShieldCheck,
  CreditCard,
  CalendarCheck,
  DollarSign,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Search,
  Clock,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface EquipmentItem {
  _id: string;
  name: string;
  category: string;
  image: string;
  pricePerDay: number;
  location: string;
  rating: number;
  reviewsCount: number;
  condition: string;
  status: "approved" | "available";
  ownerName: string;
  specs: string[];
}

// Categories specified by user
const CATEGORIES = [
  {
    name: "Construction Equipment",
    desc: "Excavators, skid steers, boom lifts & road rollers",
    count: "140+ Machines",
    icon: HardHat,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    query: "construction",
  },
  {
    name: "Photography Equipment",
    desc: "Cinema cameras, prime lenses, gimbals & studio lighting",
    count: "95+ Gear Kits",
    icon: Camera,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    query: "photography",
  },
  {
    name: "Vehicles & Transportation",
    desc: "Flatbeds, heavy utility trucks, trailers & haulers",
    count: "60+ Vehicles",
    icon: Truck,
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80",
    query: "vehicles",
  },
  {
    name: "Agriculture Equipment",
    desc: "Combines, tractors, seeders & commercial irrigation",
    count: "45+ Farm Units",
    icon: Tractor,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
    query: "agriculture",
  },
  {
    name: "Electronics",
    desc: "Power generators, thermal scanners, drone telemetry & tools",
    count: "75+ Systems",
    icon: Cpu,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    query: "electronics",
  },
  {
    name: "Event Equipment",
    desc: "Pro PA sound systems, line arrays, staging & high-lumen rigs",
    count: "50+ Stage Kits",
    icon: PartyPopper,
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    query: "event",
  },
];

// Why Choose Us cards
const VALUE_PILLARS = [
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    desc: "Direct peer-to-peer owner rates with transparent daily, weekly, and monthly rates. Save up to 40% compared to traditional rental houses.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Owners",
    desc: "Every equipment owner passes strict identity and business verification. All machines undergo maintenance and safety certification checks.",
  },
  {
    icon: CalendarCheck,
    title: "Flexible Duration",
    desc: "From 4-hour quick emergency rentals to multi-month commercial infrastructure projects with instant extension options.",
  },
  {
    icon: CreditCard,
    title: "Stripe Security",
    desc: "Bank-grade encrypted checkout with Stripe escrow protection. Security deposits and payouts are safely managed with zero surprises.",
  },
];

// 4 realistic customer reviews
const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "Marcus Vance",
    role: "Lead Project Superintendent",
    company: "Vance Civil Construction",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "2 days ago",
    comment:
      "Our site excavator threw a track on Tuesday morning. We found a CAT 308 on RentForge by 9 AM, and the verified owner delivered it to our jobsite in Naperville by 1 PM. It saved us an entire week of liquidated damages.",
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "Director of Photography",
    company: "Lumen Horizon Media",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "1 week ago",
    comment:
      "Renting the RED V-Raptor package with full accessories through RentForge was seamless. The gear was immaculately packed, clean sensors, and fully insured under RentForge’s damage waiver.",
  },
  {
    id: 3,
    name: "Darnell Washington",
    role: "Production Operations Lead",
    company: "Apex Live Touring",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "We needed two 100kW whisper generators for a 3-day outdoor music festival in Austin. The owner brought them with full fuel tanks and provided 24/7 on-call support. Flawless execution.",
  },
  {
    id: 4,
    name: "Sarah Chen, P.E.",
    role: "Managing Principal",
    company: "Chen Engineering & Surveying",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "1 month ago",
    comment:
      "The Stripe escrow payment process gives our accounting team complete peace of mind. We have rented utility trucks, boom lifts, and soil compactors across four state projects without a single hitch.",
  },
];

// Stats milestones for "Trusted Equipment Owners"
const OWNER_STATS = [
  { value: "2,850+", label: "Certified Heavy Machines & Pro Gear" },
  { value: "$3.4M+", label: "Direct Owner Rental Earnings" },
  { value: "99.8%", label: "Verified Safety & Inspection Score" },
  { value: "62,000+", label: "Jobsite Rental Days Completed" },
];

// Animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [featuredItems, setFeaturedItems] = React.useState<EquipmentItem[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = React.useState(false);

  // Fetch 6 approved featured items from GET /api/equipment/featured
  React.useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        setIsLoadingFeatured(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await axios.get(`${apiUrl}/api/equipment/featured`);

        if (isMounted && response.data) {
          const items = Array.isArray(response.data)
            ? response.data
            : response.data.equipment || response.data.items || [];

          if (items.length > 0) {
            // Take up to 6 approved items with normalized fields
            const approved = items.slice(0, 6).map((it: any) => {
              const specsArr = Array.isArray(it.specs)
                ? it.specs
                : typeof it.specs === "object" && it.specs !== null
                ? Object.entries(it.specs).map(([k, v]) => `${k}: ${v}`)
                : [];

              return {
                ...it,
                name: it.name || it.title || "Equipment Item",
                image:
                  it.image ||
                  it.equipmentImage ||
                  (Array.isArray(it.images) && it.images.length > 0 ? it.images[0] : ""),
                pricePerDay: Number(it.pricePerDay ?? it.rentalPrice ?? it.price ?? 0),
                rentalPrice: Number(it.rentalPrice ?? it.pricePerDay ?? it.price ?? 0),
                specs: specsArr,
                ownerName: it.ownerName || it.owner?.name || "Equipment Owner",
                location: it.location || "Available Nationwide",
                rating: it.rating !== undefined ? Number(it.rating) : 5.0,
                reviewsCount: it.reviewsCount !== undefined ? Number(it.reviewsCount) : 0,
              };
            });
            setFeaturedItems(approved);
          }
        }
      } catch (err) {
        console.warn("Featured equipment fetch notice: Backend unavailable or empty.");
        setFeaturedItems([]);
      } finally {
        if (isMounted) setIsLoadingFeatured(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle View Details with auth check
  const handleViewDetails = (id: string) => {
    if (isPending) return;

    if (!session?.user) {
      // Redirect unauthenticated users to /login
      router.push(`/login?redirect=/equipment/${id}`);
    } else {
      // Redirect authenticated users to /equipment/[id]
      router.push(`/equipment/${id}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* SECTION 1: ANIMATED HERO BANNER */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-border bg-[#111827] text-white">
        {/* Ambient Dark Charcoal & Emerald Lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/90 via-[#111827]/80 to-[#090D16] z-10" />

        {/* Dynamic Background Image Carousel / Composite */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=80"
            alt="Heavy industrial machinery and cinema production equipment"
            className="w-full h-full object-cover object-center opacity-35 scale-105 animate-pulse [animation-duration:12s]"
          />
        </div>

        {/* Emerald Ambient Glow Orbs */}
        <div className="absolute top-1/4 -left-20 size-96 rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none z-10" />
        <div className="absolute bottom-1/4 -right-20 size-96 rounded-full bg-emerald-600/15 blur-[140px] pointer-events-none z-10" />

        {/* Hero Content */}
        <div className="relative z-20 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-lg shadow-emerald-950/50"
          >
            <Sparkles className="size-3.5 text-emerald-400 animate-spin [animation-duration:4s]" />
            <span className="tracking-wide uppercase">Next-Gen Heavy Machinery &amp; Pro Gear Rental</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto"
          >
            Forge Bigger Projects.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Rent Pro Equipment
            </span>{" "}
            On Demand.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Access certified excavators, aerial boom lifts, 8K cinema packages, and utility
            power from verified equipment owners. Guaranteed jobsite delivery with comprehensive
            rental protection.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/equipment"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/40 transition-all hover:bg-emerald-500 hover:shadow-emerald-700/30 hover:scale-[1.02] active:translate-y-px"
            >
              <Search className="size-5" />
              <span>Explore Equipment</span>
            </Link>

            <Link
              href="/register?role=owner"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900/80 backdrop-blur-md px-7 py-4 text-base font-semibold text-gray-200 transition-all hover:border-emerald-500/50 hover:bg-gray-800 hover:text-white"
            >
              <span>List Your Equipment</span>
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>

          {/* Trust badges strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="mt-14 pt-8 border-t border-gray-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">100% Insured</p>
                <p className="text-xs text-gray-400">Full damage coverage</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Truck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Jobsite Dispatch</p>
                <p className="text-xs text-gray-400">Direct haul &amp; drop-off</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CreditCard className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Stripe Escrow</p>
                <p className="text-xs text-gray-400">Safe release of funds</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Zero Downtime</p>
                <p className="text-xs text-gray-400">24/7 swap guarantee</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: FEATURED EQUIPMENT (EQUAL-HEIGHT CARDS + AUTH-AWARE VIEW DETAILS) */}
      <section className="py-20 lg:py-28 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-300 uppercase">
                <Layers className="size-3.5" />
                <span>Verified Machinery Registry</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Featured Equipment
              </h2>
              <p className="mt-2 text-base text-muted-foreground max-w-xl">
                Inspected, field-certified, and ready for immediate deployment.
              </p>
            </div>

            <Link
              href="/equipment"
              className="group inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              <span>Explore All Equipment</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Cards Grid: Enforcing STRICT uniform height and width */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredItems.map((item) => (
              <motion.div
                key={item._id}
                variants={fadeIn}
                className="group flex flex-col h-full rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 overflow-hidden"
              >
                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 rounded-full bg-[#111827]/85 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    {item.category}
                  </span>

                  {/* Status / Condition */}
                  <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                    <CheckCircle2 className="size-3" />
                    <span>Approved</span>
                  </span>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-3 rounded-lg bg-[#111827]/90 backdrop-blur-md px-3 py-1 text-right border border-gray-750">
                    <span className="text-base font-extrabold text-white">
                      ${item.pricePerDay}
                    </span>
                    <span className="text-xs text-gray-400">/day</span>
                  </div>
                </div>

                {/* Card Body with Flex Column Spacing */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        {item.rating} ({item.reviewsCount})
                      </span>
                    </div>

                    {/* Machine Title */}
                    <h3 className="mt-3 text-lg font-bold text-foreground line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>

                    {/* Spec Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.specs?.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Owner info + View Details Action */}
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-muted-foreground block">Owner:</span>
                      <span className="font-semibold text-foreground truncate max-w-[120px] block">
                        {item.ownerName}
                      </span>
                    </div>

                    {/* View Details Button with Auth Check */}
                    <button
                      type="button"
                      onClick={() => handleViewDetails(item._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-500 shadow-sm shadow-emerald-950/20 active:translate-y-px"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: ANIMATED CATEGORIES */}
      <section className="py-20 lg:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              Fleet Catalog
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Equipped for Every Industry
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Explore specialized machinery, production kits, and heavy hauling units tailored to your project.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.name}
                  variants={fadeIn}
                  className="group relative h-72 rounded-2xl overflow-hidden border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-500/60"
                >
                  {/* Category Background Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay for Charcoal depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/75 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-95" />

                  {/* Category Details */}
                  <div className="relative z-20 h-full flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-600/90 text-white backdrop-blur-md shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500">
                        <Icon className="size-5" />
                      </div>
                      <span className="rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                        {cat.count}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        {cat.desc}
                      </p>

                      <Link
                        href={`/equipment?category=${cat.query}`}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-white transition-colors"
                      >
                        <span>Browse Category</span>
                        <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <section className="py-20 lg:py-28 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              The RentForge Advantage
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Why Builders Choose RentForge
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Built by industrial professionals for contractors who cannot afford downtime or surprise fees.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {VALUE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  variants={fadeIn}
                  className="flex flex-col h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{pillar.title}</h3>
                  <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed flex-1">
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS (EXTRA SECTION 1: 3 STEPS) */}
      <section className="py-20 lg:py-28 bg-[#111827] text-white border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Simple 3-Step Process
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              How RentForge Works
            </h2>
            <p className="mt-3 text-base text-gray-400">
              Go from reservation to operational machinery on your jobsite in three straightforward steps.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Step 1 */}
            <motion.div
              variants={fadeIn}
              className="relative flex flex-col items-start rounded-2xl border border-gray-800 bg-gray-900/60 p-8 shadow-md"
            >
              <div className="flex items-center justify-between w-full mb-6">
                <span className="text-4xl font-black text-emerald-500/40">01</span>
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Search className="size-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Browse &amp; Select Dates</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Filter by equipment specs, location, and required dates. Compare transparent pricing
                from verified commercial owners.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeIn}
              className="relative flex flex-col items-start rounded-2xl border border-gray-800 bg-gray-900/60 p-8 shadow-md"
            >
              <div className="flex items-center justify-between w-full mb-6">
                <span className="text-4xl font-black text-emerald-500/40">02</span>
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CreditCard className="size-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Instant Stripe Checkout</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Reserve seamlessly with bank-level encryption. Your funds and damage deposits are safely held in
                escrow until equipment is verified on site.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeIn}
              className="relative flex flex-col items-start rounded-2xl border border-gray-800 bg-gray-900/60 p-8 shadow-md"
            >
              <div className="flex items-center justify-between w-full mb-6">
                <span className="text-4xl font-black text-emerald-500/40">03</span>
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Truck className="size-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Jobsite Delivery &amp; Work</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                The verified owner delivers the machinery right to your jobsite, or pick it up locally.
                Perform your build with 100% damage protection.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: TRUSTED EQUIPMENT OWNERS STATS (EXTRA SECTION 2) */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-emerald-950 via-[#06261c] to-[#041f17] text-white border-b border-emerald-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Column: Heading & Owner CTA */}
            <div className="lg:max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                <Award className="size-3.5" />
                <span>Verified Owner Network</span>
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Powered by America&apos;s Top Equipment Owners
              </h2>
              <p className="mt-4 text-base text-emerald-100/80 leading-relaxed">
                From regional heavy construction yards to independent production houses, our verified owners
                keep America’s job sites moving with certified machinery.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/register?role=owner"
                  className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#090D16] shadow-lg hover:bg-emerald-50 transition-colors text-center"
                >
                  List Your Fleet Today
                </Link>
                <Link
                  href="/about"
                  className="rounded-xl border border-emerald-500/40 bg-emerald-900/30 px-6 py-3.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-900/60 transition-colors text-center"
                >
                  Learn About Verification
                </Link>
              </div>
            </div>

            {/* Right Column: Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full lg:max-w-xl">
              {OWNER_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-950/60 backdrop-blur-md p-6 text-center"
                >
                  <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-emerald-100/70 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CUSTOMER REVIEWS */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              Field Feedback
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Trusted on Thousands of Jobsites
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Read how superintendents, directors, and independent builders rely on RentForge.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CUSTOMER_REVIEWS.map((rev) => (
              <motion.div
                key={rev.id}
                variants={fadeIn}
                className="flex flex-col h-full rounded-2xl border border-border bg-card p-6 shadow-sm justify-between transition-all duration-300 hover:shadow-lg hover:border-emerald-500/40"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">{rev.date}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-foreground/90 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="size-10 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-foreground">{rev.name}</p>
                    <p className="text-muted-foreground truncate max-w-[150px]">{rev.role}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[150px]">
                      {rev.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#111827] via-[#0b1c16] to-[#111827] p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 size-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
              Ready to Equip Your Next Jobsite?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              Join thousands of contractors and creators. Find the right machine at the best price today.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/equipment"
                className="rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-colors"
              >
                Browse All Machinery
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-gray-700 bg-gray-900/80 px-8 py-3.5 text-base font-semibold text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
