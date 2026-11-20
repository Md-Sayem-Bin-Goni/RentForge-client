"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { axiosPublic, getApiBaseUrl } from "@/lib/axiosSecure";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Loader2,
  X,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export interface EquipmentItem {
  _id: string;
  name: string;
  category: string;
  image: string;
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Hourly" | "Monthly";
  location: string;
  isAvailable: boolean;
  status: "approved" | "pending";
  rating: number;
  reviewsCount: number;
  ownerName: string;
  specs: string[];
  createdAt?: string;
}

const CATEGORIES = [
  "All Categories",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = ["All Types", "Daily", "Weekly", "Hourly", "Monthly"];

function EquipmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isAuthPending } = useSession();

  // Search & Filter state
  const initialCategory = searchParams.get("category") || "All Categories";
  const [searchTerm, setSearchTerm] = React.useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [selectedRentalType, setSelectedRentalType] = React.useState("All Types");
  const [minPrice, setMinPrice] = React.useState<number | "">("");
  const [maxPrice, setMaxPrice] = React.useState<number | "">("");
  const [availableOnly, setAvailableOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"newest" | "price_asc" | "price_desc">("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  // Data & Loading state
  const [equipmentList, setEquipmentList] = React.useState<EquipmentItem[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = React.useState(false);

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedRentalType, minPrice, maxPrice, availableOnly, sortBy]);

  // Fetch or filter equipment
  React.useEffect(() => {
    let isCancelled = false;

    const fetchEquipment = async () => {
      setIsLoading(true);
      const envUrl = process.env.NEXT_PUBLIC_API_URL;
      const apiUrl =
        envUrl && envUrl.trim().length > 0
          ? envUrl.trim().replace(/\/+$/, "")
          : getApiBaseUrl();

      try {
        const params: Record<string, any> = {
          page: currentPage,
          limit: itemsPerPage,
          sort: sortBy,
        };

        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (selectedCategory !== "All Categories") params.category = selectedCategory;
        if (selectedRentalType !== "All Types") params.rentalType = selectedRentalType;
        if (minPrice !== "") params.minPrice = minPrice;
        if (maxPrice !== "") params.maxPrice = maxPrice;
        if (availableOnly) params.availableOnly = true;

        const response = await axiosPublic.get(`${apiUrl}/api/equipment`, { params });

        if (!isCancelled && response.data) {
          const raw = response.data;
          const rawItems = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.equipment)
            ? raw.equipment
            : Array.isArray(raw?.items)
            ? raw.items
            : [];

          const serverTotal =
            response.data.totalCount !== undefined
              ? response.data.totalCount
              : response.data.total !== undefined
              ? response.data.total
              : rawItems.length;
          const serverPages =
            response.data.totalPages ||
            Math.ceil(serverTotal / itemsPerPage) ||
            1;

          const normalized = rawItems.map((it: any) => {
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
              rentalPrice: Number(it.rentalPrice ?? it.price ?? it.pricePerDay ?? 0),
              price: Number(it.price ?? it.rentalPrice ?? it.pricePerDay ?? 0),
              specs: specsArr,
              ownerName: it.ownerName || it.owner?.name || "Equipment Owner",
              location: it.location || "Available Nationwide",
              rating: it.rating !== undefined ? Number(it.rating) : 5.0,
              reviewsCount: it.reviewsCount !== undefined ? Number(it.reviewsCount) : 0,
            };
          });

          setEquipmentList(normalized);
          setTotalCount(serverTotal);
          setTotalPages(serverPages);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch equipment catalog from backend:", err);
        if (!isCancelled) {
          setEquipmentList([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchEquipment();

    return () => {
      isCancelled = true;
    };
  }, [
    debouncedSearch,
    selectedCategory,
    selectedRentalType,
    minPrice,
    maxPrice,
    availableOnly,
    sortBy,
    currentPage,
  ]);

  // Auth-aware navigation to View Details
  const handleViewDetails = (id: string) => {
    if (isAuthPending) return;

    if (!session?.user) {
      router.push(`/login?redirect=/equipment/${id}`);
    } else {
      router.push(`/equipment/${id}`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedRentalType("All Types");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(false);
    setSortBy("newest");
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== "All Categories" ? 1 : 0) +
    (selectedRentalType !== "All Types" ? 1 : 0) +
    (minPrice !== "" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (availableOnly ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Banner Header */}
      <div className="border-b border-border bg-gradient-to-b from-card via-card/90 to-background py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-300 uppercase">
                <Layers className="size-3.5" />
                <span>Verified Heavy Fleet</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                All Equipment Catalog
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
                Browse, search, and reserve certified machinery, high-performance power tools, and
                commercial vehicles from vetted owners.
              </p>
            </div>

            {/* Quick Stat Counter */}
            <div className="hidden sm:flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 shadow-xs">
              <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">
                <strong className="text-foreground font-semibold">{totalCount}</strong> Approved Units Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search & Top Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-8">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <Search className="size-4.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by equipment name, make, model, or city (e.g. Excavator, Chicago, RED)..."
              className="block w-full rounded-xl border border-input bg-card py-3 pr-10 pl-10 text-sm text-foreground shadow-xs placeholder:text-muted-foreground/70 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Controls: Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto appearance-none rounded-xl border border-input bg-card py-3 pr-9 pl-4 text-xs sm:text-sm font-medium text-foreground shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="newest">Sort by: Recently Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                <ArrowUpRight className="size-3.5 rotate-45" />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs sm:text-sm font-semibold text-foreground shadow-xs hover:bg-muted"
            >
              <SlidersHorizontal className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls Bar (Desktop & Expandable Mobile) */}
        <div
          className={`rounded-2xl border border-border bg-card p-5 mb-8 shadow-xs ${
            showFiltersMobile ? "block" : "hidden lg:block"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2 px-3 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Rental Type Filter */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                Rental Duration Type
              </label>
              <select
                value={selectedRentalType}
                onChange={(e) => setSelectedRentalType(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2 px-3 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {RENTAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                Min Price ($)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-lg border border-input bg-background py-2 pr-3 pl-7 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                Max Price ($)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="5000"
                  className="w-full rounded-lg border border-input bg-background py-2 pr-3 pl-7 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Available Only Switch & Reset */}
            <div className="flex items-center justify-between sm:justify-start gap-4 h-9">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="size-4 rounded border-input text-emerald-600 focus:ring-emerald-500/30 accent-emerald-600"
                />
                <span>Available Only</span>
              </label>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status / Active Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs text-muted-foreground">
          <p>
            Showing <strong className="text-foreground">{equipmentList.length}</strong> of{" "}
            <strong className="text-foreground">{totalCount}</strong> equipment listings
          </p>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium">Active Filters:</span>
              {selectedCategory !== "All Categories" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground font-medium">
                  {selectedCategory}
                  <X
                    className="size-3 cursor-pointer hover:text-red-500"
                    onClick={() => setSelectedCategory("All Categories")}
                  />
                </span>
              )}
              {selectedRentalType !== "All Types" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground font-medium">
                  {selectedRentalType}
                  <X
                    className="size-3 cursor-pointer hover:text-red-500"
                    onClick={() => setSelectedRentalType("All Types")}
                  />
                </span>
              )}
              {availableOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-medium">
                  Available Only
                  <X
                    className="size-3 cursor-pointer hover:text-red-500"
                    onClick={() => setAvailableOnly(false)}
                  />
                </span>
              )}
              {(minPrice !== "" || maxPrice !== "") && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground font-medium">
                  ${minPrice || 0} - ${maxPrice || "Any"}
                  <X
                    className="size-3 cursor-pointer hover:text-red-500"
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                  />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading Overlay or 3-Column Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[430px] rounded-2xl border border-border bg-card animate-pulse flex flex-col justify-between p-5"
              >
                <div className="h-52 w-full rounded-xl bg-muted" />
                <div className="space-y-3 mt-4">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
                <div className="h-9 w-full rounded-lg bg-muted mt-4" />
              </div>
            ))}
          </div>
        ) : equipmentList.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-16 px-4 text-center my-8 shadow-xs">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
              <AlertCircle className="size-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Equipment Matches Your Criteria</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              We couldn’t find any approved equipment matching your exact search or filter settings.
              Try clearing filters or broadening your search keywords.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              <RotateCcw className="size-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* STRICT Uniform 3-Column Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentList.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col h-full rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 overflow-hidden"
              >
                {/* 1. Image with Uniform Aspect Ratio */}
                <div className="relative h-56 w-full overflow-hidden bg-muted shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 rounded-full bg-[#111827]/85 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    {item.category}
                  </span>

                  {/* Availability Badge */}
                  <span
                    className={`absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-md ${
                      item.isAvailable
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800 text-gray-300 border border-gray-700"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        item.isAvailable ? "bg-white animate-pulse" : "bg-gray-400"
                      }`}
                    />
                    <span>{item.isAvailable ? "Available" : "Rented Out"}</span>
                  </span>

                  {/* Rental Price Badge */}
                  <div className="absolute bottom-3 right-3 rounded-lg bg-[#111827]/90 backdrop-blur-md px-3 py-1 text-right border border-gray-750">
                    <span className="text-base font-extrabold text-white">
                      ${item.rentalPrice}
                    </span>
                    <span className="text-xs text-gray-400"> / {item.rentalType.toLowerCase()}</span>
                  </div>
                </div>

                {/* 2. Card Body (Equal-Height Balanced Layout) */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        {item.rating} ({item.reviewsCount})
                      </span>
                    </div>

                    {/* Equipment Name */}
                    <h3 className="mt-3 text-lg font-bold text-foreground line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>

                    {/* Rental Type & Owner Info */}
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                        {item.rentalType} Lease
                      </span>
                      <span>•</span>
                      <span className="truncate">By {item.ownerName}</span>
                    </div>

                    {/* Machine Specs Badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(Array.isArray(item.specs)
                        ? item.specs
                        : typeof item.specs === "object" && item.specs
                        ? Object.values(item.specs)
                        : []
                      )
                        .slice(0, 3)
                        .map((spec: any, i: number) => (
                          <span
                            key={i}
                            className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {spec}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* 3. Card Bottom: View Details Action */}
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-muted-foreground block text-[11px]">Rental Rate</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        ${item.rentalPrice}
                        <span className="text-xs font-normal text-muted-foreground">
                          /{item.rentalType.toLowerCase()}
                        </span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleViewDetails(item._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-950/20 transition-all hover:bg-emerald-500 active:translate-y-px"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Page <strong className="text-foreground">{currentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong> ({totalCount} total units)
            </p>

            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <button
                type="button"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span>Previous</span>
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`size-8 rounded-lg text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "border border-input bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page Button */}
              <button
                type="button"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap EquipmentContent in Suspense to satisfy Next.js static prerender requirements for useSearchParams
export default function EquipmentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <EquipmentContent />
    </React.Suspense>
  );
}
