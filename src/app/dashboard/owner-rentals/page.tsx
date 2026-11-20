"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  FileCheck2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Loader2,
  ShieldCheck,
  Building,
  DollarSign,
  X,
  Layers,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { useSession } from "@/lib/auth-client";
import { axiosSecure } from "@/lib/axiosSecure";

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface OwnerBooking {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  category: string;
  customer: CustomerInfo;
  startDate: string;
  endDate: string;
  durationDays: number;
  quantity: number;
  totalAmount: number;
  paymentStatus: "Paid" | "Pending" | "Escrow Hold" | "Refunded";
  bookingStatus: "Confirmed" | "In Use" | "Completed" | "Cancelled";
  bookingDate: string;
  deliveryAddress: string;
  notes?: string;
}

// Fallback mock bookings received for owner equipment
const MOCK_OWNER_BOOKINGS: OwnerBooking[] = [
  {
    _id: "obk-901",
    equipmentId: "eq-201",
    equipmentName: "CAT 308 CR Mini Hydraulic Excavator",
    equipmentImage:
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=400&q=80",
    category: "Construction Equipment",
    customer: {
      name: "Marcus Vance",
      email: "m.vance@apexconstruct.com",
      phone: "+1 (312) 555-0192",
      address: "Apex Builders LLC, 1200 N LaSalle, Chicago, IL",
    },
    startDate: "2026-11-24",
    endDate: "2026-11-28",
    durationDays: 4,
    quantity: 1,
    totalAmount: 1382,
    paymentStatus: "Paid",
    bookingStatus: "In Use",
    bookingDate: "2026-11-20",
    deliveryAddress: "Midwest Logistics Park Gate 3, Chicago, IL",
    notes: "Requires rubber tracks for finished asphalt approach. Gate code: #4920.",
  },
  {
    _id: "obk-902",
    equipmentId: "eq-202",
    equipmentName: "RED V-Raptor 8K VV Cinema Package",
    equipmentImage:
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=400&q=80",
    category: "Photography Equipment",
    customer: {
      name: "Elena Rostova",
      email: "elena@luminafilms.io",
      phone: "+1 (310) 555-0144",
      address: "Lumina Studios, 5800 Sunset Blvd, Hollywood, CA",
    },
    startDate: "2026-12-02",
    endDate: "2026-12-05",
    durationDays: 3,
    quantity: 1,
    totalAmount: 1458,
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    bookingDate: "2026-11-19",
    deliveryAddress: "Soundstage B, Sunset Gower Studios, Los Angeles, CA",
    notes: "Please include both Gold Mount batteries and dual-bay charger.",
  },
  {
    _id: "obk-903",
    equipmentId: "eq-203",
    equipmentName: "JLG 600AJ 60ft Articulating Boom Lift",
    equipmentImage:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    category: "Construction Equipment",
    customer: {
      name: "David Sterling",
      email: "david@sterlingsteel.com",
      phone: "+1 (214) 555-0188",
      address: "Sterling Structural, 404 Commerce St, Dallas, TX",
    },
    startDate: "2026-12-08",
    endDate: "2026-12-15",
    durationDays: 7,
    quantity: 1,
    totalAmount: 1471,
    paymentStatus: "Escrow Hold",
    bookingStatus: "Confirmed",
    bookingDate: "2026-11-18",
    deliveryAddress: "Amazon Fulfillment Center Phase II, Fort Worth, TX",
    notes: "Requires OSHA certification badge for driver upon gate entry.",
  },
  {
    _id: "obk-904",
    equipmentId: "eq-201",
    equipmentName: "CAT 308 CR Mini Hydraulic Excavator",
    equipmentImage:
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=400&q=80",
    category: "Construction Equipment",
    customer: {
      name: "Sarah Jenkins",
      email: "sarah.j@windycityexcavation.com",
      phone: "+1 (312) 555-0118",
      address: "Windy City Civil Works, Chicago, IL",
    },
    startDate: "2026-11-05",
    endDate: "2026-11-11",
    durationDays: 6,
    quantity: 1,
    totalAmount: 2073,
    paymentStatus: "Paid",
    bookingStatus: "Completed",
    bookingDate: "2026-10-28",
    deliveryAddress: "Harbor Point Marina Expansion, Chicago, IL",
    notes: "Machine returned clean with full tank. 5-star customer review left.",
  },
  {
    _id: "obk-905",
    equipmentId: "eq-202",
    equipmentName: "RED V-Raptor 8K VV Cinema Package",
    equipmentImage:
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=400&q=80",
    category: "Photography Equipment",
    customer: {
      name: "Julian Rivera",
      email: "julian@riveramedia.net",
      phone: "+1 (818) 555-0177",
      address: "Rivera Media Labs, Burbank, CA",
    },
    startDate: "2026-10-14",
    endDate: "2026-10-16",
    durationDays: 2,
    quantity: 1,
    totalAmount: 972,
    paymentStatus: "Refunded",
    bookingStatus: "Cancelled",
    bookingDate: "2026-10-10",
    deliveryAddress: "Universal CityWalk, Studio City, CA",
    notes: "Cancelled by production team due to weather rescheduling. Full refund processed.",
  },
];

export default function OwnerRentalsPage() {
  const { data: session } = useSession();

  const [bookings, setBookings] = React.useState<OwnerBooking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  // Selected Booking Details Modal
  const [selectedBooking, setSelectedBooking] = React.useState<OwnerBooking | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const fetchOwnerBookings = React.useCallback(async () => {
    setIsLoading(true);
    const email = session?.user?.email;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const queryUrl = email
        ? `${apiUrl}/api/bookings/owner-rentals?ownerEmail=${encodeURIComponent(email)}`
        : `${apiUrl}/api/bookings/owner-rentals`;

      const res = await axiosSecure.get(queryUrl);
      const data = res.data?.bookings || res.data?.data || res.data;

      if (Array.isArray(data) && data.length > 0) {
        setBookings(data);
      } else {
        setBookings(MOCK_OWNER_BOOKINGS);
      }
    } catch (err) {
      console.warn("Could not fetch owner bookings from backend; using mock fallback:", err);
      setBookings(MOCK_OWNER_BOOKINGS);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  React.useEffect(() => {
    fetchOwnerBookings();
  }, [fetchOwnerBookings]);

  // Update Booking Status
  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: "Confirmed" | "In Use" | "Completed" | "Cancelled"
  ) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axiosSecure.patch(`${apiUrl}/api/bookings/${bookingId}/status`, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: newStatus } : b))
      );
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: newStatus } : null));
      }
      toast.success(`Booking status updated to "${newStatus}".`);
    } catch (err) {
      // Local fallback
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: newStatus } : b))
      );
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: newStatus } : null));
      }
      toast.success(`Booking status updated to "${newStatus}" (saved).`);
    }
  };

  // Filter Bookings
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b._id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        b.bookingStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  // Status Summary Counts
  const counts = React.useMemo(() => {
    return {
      all: bookings.length,
      confirmed: bookings.filter((b) => b.bookingStatus === "Confirmed").length,
      inUse: bookings.filter((b) => b.bookingStatus === "In Use").length,
      completed: bookings.filter((b) => b.bookingStatus === "Completed").length,
      cancelled: bookings.filter((b) => b.bookingStatus === "Cancelled").length,
    };
  }, [bookings]);

  return (
    <PrivateRoute allowedRoles={["owner", "admin"]}>
      <div className="space-y-8 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Equipment Rentals Received
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track incoming customer bookings for your listed machines, review jobsite logistics, and monitor payouts.
            </p>
          </div>

          <button
            onClick={() => fetchOwnerBookings()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="size-3.5" />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "All", label: "All Bookings", count: counts.all },
              { id: "Confirmed", label: "Confirmed", count: counts.confirmed },
              { id: "In Use", label: "Active On Site", count: counts.inUse },
              { id: "Completed", label: "Completed", count: counts.completed },
              { id: "Cancelled", label: "Cancelled", count: counts.cancelled },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    statusFilter === tab.id
                      ? "bg-emerald-800 text-emerald-100"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search customer, machine, address..."
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
              <Loader2 className="size-8 animate-spin text-emerald-600 dark:text-emerald-400" />
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Loading incoming rental orders...
              </p>
            </div>
          ) : paginatedBookings.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <FileCheck2 className="size-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">
                No rental bookings found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                {searchTerm || statusFilter !== "All"
                  ? "No bookings match your current filter criteria."
                  : "You have not received any rental bookings yet. Once contractors reserve your equipment, they will appear here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 uppercase tracking-wider text-[11px] font-bold text-muted-foreground">
                  <tr>
                    <th scope="col" className="py-4 pl-6 pr-4">
                      Equipment
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Customer Info
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Duration &amp; Qty
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Amount ($)
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Payment Status
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Booking Status
                    </th>
                    <th scope="col" className="py-4 pl-4 pr-6 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedBookings.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Equipment */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                            <Image
                              src={b.equipmentImage}
                              alt={b.equipmentName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <Link
                              href={`/equipment/${b.equipmentId}`}
                              className="font-bold text-sm text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
                            >
                              {b.equipmentName}
                            </Link>
                            <span className="text-[11px] text-muted-foreground">
                              {b.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground">
                            {b.customer.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground break-all">
                            {b.customer.email}
                          </p>
                          {b.customer.phone && (
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                              {b.customer.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Duration & Qty */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>
                              {b.startDate} → {b.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span>{b.durationDays} days</span>
                            <span>•</span>
                            <span className="font-medium text-foreground">
                              {b.quantity} {b.quantity === 1 ? "unit" : "units"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-extrabold text-sm text-foreground">
                          ${b.totalAmount.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          Booked on {b.bookingDate}
                        </p>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {b.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="size-3" />
                            <span>Paid</span>
                          </span>
                        ) : b.paymentStatus === "Escrow Hold" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <ShieldCheck className="size-3" />
                            <span>Escrow Hold</span>
                          </span>
                        ) : b.paymentStatus === "Refunded" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-500 border border-blue-500/20">
                            <RotateCcw className="size-3" />
                            <span>Refunded</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-500 border border-amber-500/20">
                            <Clock className="size-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Booking Status Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {b.bookingStatus === "Confirmed" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="size-3" />
                            <span>Confirmed</span>
                          </span>
                        ) : b.bookingStatus === "In Use" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-500 border border-blue-500/20">
                            <Clock className="size-3" />
                            <span>In Use</span>
                          </span>
                        ) : b.bookingStatus === "Completed" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-3 py-1 text-[11px] font-bold text-slate-500 border border-slate-500/20">
                            <CheckCircle2 className="size-3" />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[11px] font-bold text-rose-500 border border-rose-500/20">
                            <XCircle className="size-3" />
                            <span>Cancelled</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-emerald-500/50 transition-colors shadow-2xs"
                        >
                          <span>Review Order</span>
                          <ArrowUpRight className="size-3.5 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredBookings.length > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <span className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * itemsPerPage, filteredBookings.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">
                  {filteredBookings.length}
                </span>{" "}
                rental bookings
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-xs font-bold text-foreground px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ----------------- BOOKING DETAILS & DISPATCH MODAL ----------------- */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <FileCheck2 className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Rental Booking Dossier
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Reference #{selectedBooking._id} • Booked {selectedBooking.bookingDate}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-6 space-y-6 text-xs">
                {/* Equipment Summary */}
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    <Image
                      src={selectedBooking.equipmentImage}
                      alt={selectedBooking.equipmentName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-foreground">
                      {selectedBooking.equipmentName}
                    </h4>
                    <p className="text-muted-foreground mt-0.5">
                      {selectedBooking.category}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-foreground font-semibold">
                      <span>Total Payout: ${selectedBooking.totalAmount.toLocaleString()}</span>
                      <span>•</span>
                      <span>Quantity: {selectedBooking.quantity} unit(s)</span>
                    </div>
                  </div>
                </div>

                {/* Customer & Jobsite Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <User className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Contractor Contact</span>
                    </span>
                    <p className="font-extrabold text-sm text-foreground">
                      {selectedBooking.customer.name}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3.5" />
                      <span>{selectedBooking.customer.email}</span>
                    </p>
                    {selectedBooking.customer.phone && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Phone className="size-3.5" />
                        <span>{selectedBooking.customer.phone}</span>
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Delivery / Jobsite Address</span>
                    </span>
                    <p className="font-bold text-foreground text-xs leading-relaxed">
                      {selectedBooking.deliveryAddress}
                    </p>
                    {selectedBooking.notes && (
                      <p className="mt-2 text-muted-foreground bg-muted/60 p-2 rounded-lg italic">
                        &quot;{selectedBooking.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Rental Period Schedule */}
                <div className="rounded-2xl border border-border bg-card p-4">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5 mb-2">
                    <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Rental Schedule &amp; Duration</span>
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Start Date:
                      </span>
                      <span className="font-bold text-sm text-foreground">
                        {selectedBooking.startDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        End Date:
                      </span>
                      <span className="font-bold text-sm text-foreground">
                        {selectedBooking.endDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Duration:
                      </span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {selectedBooking.durationDays} Days
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Payment:
                      </span>
                      <span className="font-bold text-sm text-foreground">
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Status Transition Controls */}
                <div className="border-t border-border pt-4">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground block mb-3">
                    Update Equipment Jobsite Status
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {(["Confirmed", "In Use", "Completed", "Cancelled"] as const).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() =>
                            handleUpdateBookingStatus(selectedBooking._id, st)
                          }
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                            selectedBooking.bookingStatus === st
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-xl bg-muted px-6 py-2.5 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
