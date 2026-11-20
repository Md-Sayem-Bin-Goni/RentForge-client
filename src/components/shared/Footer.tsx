"use client";

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

// LinkedIn SVG Icon
function LinkedInIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.02-3.28 1.64 1.64 0 0 0 .02 3.28m1.4 9.74V9.93H5.06v8.57h2.8z" />
    </svg>
  );
}

// GitHub SVG Icon
function GitHubIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// YouTube SVG Icon
function YouTubeIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Facebook SVG Icon
function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Footer() {
  const [currentYear, setCurrentYear] = React.useState<number | string>(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

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
    { name: "Rental Protection Guarantee", href: "/how-it-works#protection" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/about#terms" },
    { name: "Privacy Policy", href: "/about#privacy" },
    { name: "Damage Waiver & Insurance", href: "/how-it-works#protection" },
    { name: "Rental Agreement", href: "/about#agreement" },
    { name: "Dispute Resolution", href: "/about#disputes" },
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
              <p className="text-sm font-semibold text-white">RentForge Guarantee &amp; Verified Owners</p>
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
                  <LinkedInIcon className="size-4" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RentForge on GitHub"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <GitHubIcon className="size-4" />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RentForge on YouTube"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <YouTubeIcon className="size-4" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RentForge on Facebook"
                  className="flex size-9 items-center justify-center rounded-lg border border-gray-750 bg-gray-800 text-gray-300 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <FacebookIcon className="size-4" />
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
              Contact &amp; Support
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
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="hover:text-emerald-400 transition-colors"
                  >
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
