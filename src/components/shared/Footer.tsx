import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
  Hammer,
  Truck,
  HardHat,
  Linkedin,
  Github,
  Youtube,
  Facebook,
} from "lucide-react";
import { RentForgeLogo } from "./Navbar";

// Official SVG for the new X logo (formerly Twitter)
function XSocialIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const equipmentCategories = [
    { name: "Heavy Earthmoving & Excavators", href: "/equipment?category=earthmoving" },
    { name: "Boom & Scissor Aerial Lifts", href: "/equipment?category=aerial" },
    { name: "Compaction & Road Rollers", href: "/equipment?category=compaction" },
    { name: "Industrial Generators & Power", href: "/equipment?category=power" },
    { name: "Concrete & Material Handling", href: "/equipment?category=concrete" },
    { name: "Commercial Site Lighting", href: "/equipment?category=lighting" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Equipment", href: "/equipment" },
    { name: "How RentForge Works", href: "/how-it-works" },
    { name: "About Our Platform", href: "/about" },
    { name: "List Your Machinery (Owners)", href: "/register?role=owner" },
    { name: "Rental Protection Guarantee", href: "/protection" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Damage Waiver & Insurance", href: "/insurance" },
    { name: "Rental Agreement", href: "/agreement" },
    { name: "Dispute Resolution", href: "/disputes" },
  ];

  return (
    <footer className="w-full border-t border-gray-800 bg-[#111827] text-gray-300 dark:border-gray-900 dark:bg-[#030712]">
      {/* Top Value Banner */}
      <div className="border-b border-gray-800/80 bg-gray-900/60 dark:border-gray-900 dark:bg-[#060b14]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">RentForge Guarantee & Verified Owners</p>
              <p className="text-xs text-gray-400">Every machine inspected, covered by comprehensive rental insurance.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Truck className="size-4 text-emerald-400" /> Jobsite Delivery Available
            </span>
            <span className="flex items-center gap-1.5">
              <HardHat className="size-4 text-emerald-400" /> Commercial Grade Equipment
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Mission Column */}
          <div className="space-y-4 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <RentForgeLogo className="size-9 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <span className="text-2xl font-bold tracking-tight text-white">
                Rent<span className="font-extrabold text-emerald-400">Forge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              RentForge is the leading on-demand equipment rental marketplace.
              Connecting verified contractors and builders with top-tier heavy
              machinery, precision power tools, and industrial equipment.
            </p>

            {/* Social Links featuring the new X logo */}
            <div className="pt-2">
              <p className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* NEW X LOGO */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow RentForge on X"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <XSocialIcon className="size-4" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RentForge on LinkedIn"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <Linkedin className="size-4" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RentForge on GitHub"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <Github className="size-4" />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RentForge on YouTube"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <Youtube className="size-4" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RentForge on Facebook"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <Facebook className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Equipment Categories */}
          <div className="space-y-3 lg:col-span-3">
            <p className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">
              Top Categories
            </p>
            <ul className="space-y-2 text-sm">
              {equipmentCategories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                  >
                    <ChevronRight className="mr-1.5 size-3.5 text-emerald-500 transition-transform duration-200 group-hover:translate-x-1" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 lg:col-span-2">
            <p className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">
              Quick Links
            </p>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                  >
                    <ChevronRight className="mr-1.5 size-3.5 text-emerald-500 transition-transform duration-200 group-hover:translate-x-1" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 lg:col-span-3">
            <p className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">
              Contact & Support
            </p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                <span>Forge Tower, 100 Industrial Pkwy, Suite 400, Chicago, IL 60607</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-emerald-400" />
                <a href="tel:+18005553674" className="hover:text-white transition-colors">
                  +1 (800) 555-FORGE (3674)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-emerald-400" />
                <a href="mailto:support@rentforge.com" className="hover:text-white transition-colors">
                  support@rentforge.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-emerald-400" />
                <span>Hotline: Mon – Sat 6:00 AM – 9:00 PM CST</span>
              </li>
            </ul>

            {/* Emergency Hotline Banner */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs text-gray-300">
              <div className="flex items-center gap-2 font-medium text-emerald-400">
                <Hammer className="size-3.5" />
                <span>Jobsite Emergency Assistance</span>
              </div>
              <p className="mt-1 text-gray-400">24/7 on-call dispatch for machinery breakdown and replacements.</p>
            </div>
          </div>
        </div>

        {/* Legal Links Divider */}
        <div className="mt-10 border-t border-gray-800 pt-6 dark:border-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-emerald-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-gray-800/60 pt-6 text-xs text-gray-400 sm:flex-row dark:border-gray-900/60">
          <p>© {currentYear} RentForge Technologies Inc. All rights reserved.</p>
          <p className="text-gray-400">
            Engineered with <span className="text-emerald-400 font-medium">Modern Emerald</span> &amp;{" "}
            <span className="text-white font-medium">Charcoal</span> precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
