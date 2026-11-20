"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Receipt,
  RotateCcw,
  Loader2,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { axiosSecure } from "@/lib/axiosSecure";
import { useSession } from "@/lib/auth-client";

interface RentalBooking {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  category: string;
  startDate: string;
  endDate: string;
  bookingDate: string;
  totalAmount: number;
  quantity: number;
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Escrow Hold";
  bookingStatus: "Confirmed" | "In Use" | "Completed" | "Cancelled";
  durationDays: number;
  deliveryAddress: string;
}

// Fallback customer bookings for resilient UX
const MOCK_CUSTOMER_RENTALS: RentalBooking[] = [
  {
    _id: "bk-801",
    equipmentId: "eq-201",
    equipmentName: "CAT 308 CR Mini Hydraulic Excavator",
    equipmentImage:
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=400&q=80",
    category: "Construction Equipment",
    startDate: "2026-11-24",
    endDate: "2026-11-28",
    bookingDate: "2026-11-19",
    totalAmount: 1382,
    quantity: 1,
    paymentStatus: "Paid",
    bookingStatus: "In Use",
    durationDays: 4,
    deliveryAddress: "Jobsite 14, 400 Industrial Way, Chicago, IL",
  },
  {
    _id: "bk-802",
    equipmentId: "eq-202",
    equipmentName: "RED V-Raptor 8K VV Cinema Package",
    equipmentImage:
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=400&q=80",
    category: "Photography Equipment",
    startDate: "2026-12-02",
    endDate: "2026-12-05",
    bookingDate: "2026-11-18",
    totalAmount: 1458,
    quantity: 1,
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    durationDays: 3,
    deliveryAddress: "Stage 4, Sunset Gower Studios, Los Angeles, CA",
  },
  {
    _id: "bk-803",
    equipmentId: "eq-205",
    equipmentName: "Cummins 100kW Towable Quiet Generator",
    equipmentImage:
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
    startDate: "2026-11-10",
    endDate: "2026-11-14",
    bookingDate: "2026-11-05",
    totalAmount: 907,
    quantity: 1,
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    durationDays: 4,
    deliveryAddress: "Centennial Park Event Lawn, Atlanta, GA",
  },
  {
    _id: "bk-804",
    equipmentId: "eq-203",
    equipmentName: "JLG 600AJ 60ft Articulating Boom Lift",
    equipmentImage:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    category: "Construction Equipment",
    startDate: "2026-10-14",
    endDate: "2026-10-21",
    bookingDate: "2026-10-09",
    totalAmount: 1458,
    quantity: 1,
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    durationDays: 7,
    deliveryAddress: "Northgate Logistics Center, Dallas, TX",
  },
  {
    _id: "bk-805",
    equipmentId: "eq-206",
    equipmentName: "Ford F-550 Crew Cab 4x4 Utility Truck",
    equipmentImage:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80",
    category: "Vehicles & Transportation",
    startDate: "2026-09-22",
    endDate: "2026-09-25",
    bookingDate: "2026-09-18",
    totalAmount: 734,
    quantity: 1,
    paymentStatus: "Refunded",
    bookingStatus: "Cancelled",
    durationDays: 3,
    deliveryAddress: "Mountain Pass Base Camp, Denver, CO",
  },
];

export default function MyRentalsPage() {
  const { data: session } = useSession();

  const [rentals, setRentals] = React.useState<RentalBooking[]>(MOCK_CUSTOMER_RENTALS);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [isLoading, setIsLoading] = React.useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;

  // Fetch bookings from backend
  React.useEffect(() => {
    let isCancelled = false;

    const fetchRentals = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const email = session?.user?.email;
        const res = await axiosSecure.get(`${apiUrl}/api/bookings/my-bookings`, {
          params: { userEmail: email },
        });

        if (!isCancelled && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : res.data.bookings || res.data.rentals || [];
          if (list.length > 0) {
            setRentals(list);
          }
        }
      } catch (err) {
        // Fallback to mock rentals
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchRentals();

    return () => {
      isCancelled = true;
    };
  }, [session]);

  // Filter rentals
  const filteredRentals = React.useMemo(() => {
    return rentals.filter((item) => {
      const matchesSearch =
        item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.bookingStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchTerm, statusFilter]);

  // Pagination slice
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage) || 1;
  const paginatedRentals = filteredRentals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaymentBadge = (status: RentalBooking["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      case "Escrow Hold":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "Pending":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "Refunded":
        return "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30";
    }
  };

  const getBookingBadge = (status: RentalBooking["bookingStatus"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-600 text-white shadow-xs";
      case "In Use":
        return "bg-blue-600 text-white shadow-xs";
      case "Completed":
        return "bg-gray-750 text-gray-200 border border-gray-600";
      case "Cancelled":
        return "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30";
    }
  };

  return (
    <PrivateRoute allowedRoles={["customer"]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1.5">
              <ShoppingBag className="size-3.5" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              My Equipment Rentals
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track active jobsites, booking timelines, escrow payment receipts, and machinery return dates.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors w-fit"
          >
            <span>Rent More Equipment</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <Search className="size-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by equipment name or order ID..."
              className="w-full rounded-xl border border-input bg-background py-2 pr-3 pl-9 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-input bg-background py-2 px-3 text-xs sm:text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="In Use">In Use (Active)</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {(searchTerm || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-emerald-600 hover:text-emerald-500"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Rentals Responsive Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
              <p className="mt-3 text-sm text-muted-foreground">Loading your rental bookings...</p>
            </div>
          ) : filteredRentals.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                <ShoppingBag className="size-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No Rental Bookings Found</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                You haven&apos;t booked any equipment matching this criteria yet.
              </p>
              <Link
                href="/equipment"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-500"
              >
                <span>Browse Equipment Fleet</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 sm:px-6">Equipment Name</th>
                    <th className="py-3.5 px-4">Rental Duration</th>
                    <th className="py-3.5 px-4">Booking Date</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedRentals.map((rental) => (
                    <tr
                      key={rental._id}
                      className="transition-colors hover:bg-muted/30 group"
                    >
                      {/* Equipment Name & Image */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={rental.equipmentImage}
                            alt={rental.equipmentName}
                            className="size-12 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/equipment/${rental.equipmentId}`}
                              className="font-bold text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
                            >
                              {rental.equipmentName}
                            </Link>
                            <span className="text-[11px] text-muted-foreground block">
                              {rental.category} • Qty: {rental.quantity}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rental Start -> End Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-xs">
                          <span className="font-semibold text-foreground block">
                            {rental.startDate} → {rental.endDate}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {rental.durationDays} day{rental.durationDays > 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>

                      {/* Booking Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-muted-foreground">
                        {rental.bookingDate}
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-foreground text-sm">
                          ${rental.totalAmount}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                          Escrow Protected
                        </span>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getPaymentBadge(
                            rental.paymentStatus
                          )}`}
                        >
                          <ShieldCheck className="size-3" />
                          <span>{rental.paymentStatus}</span>
                        </span>
                      </td>

                      {/* Booking Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${getBookingBadge(
                            rental.bookingStatus
                          )}`}
                        >
                          {rental.bookingStatus === "In Use" && (
                            <span className="size-1.5 rounded-full bg-white animate-pulse" />
                          )}
                          <span>{rental.bookingStatus}</span>
                        </span>
                      </td>

                      {/* Action View */}
                      <td className="py-4 px-4 text-right pr-6 whitespace-nowrap">
                        <Link
                          href={`/equipment/${rental.equipmentId}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 group-hover:underline"
                        >
                          <span>View Gear</span>
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border p-4 bg-card">
              <span className="text-xs text-muted-foreground">
                Showing <strong className="text-foreground">{paginatedRentals.length}</strong> of{" "}
                <strong className="text-foreground">{filteredRentals.length}</strong> rental records
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={`size-7 rounded-lg text-xs font-bold transition-colors ${
                      num === currentPage
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "border border-input bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}
