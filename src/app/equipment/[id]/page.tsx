"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Heart,
  Calendar,
  MapPin,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Share2,
  AlertCircle,
  FileText,
  DollarSign,
  Phone,
  Home,
  MessageSquare,
  X,
  Loader2,
  Check,
  CreditCard,
  Building2,
  Layers,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { axiosSecure, axiosPublic, getApiBaseUrl } from "@/lib/axiosSecure";
import { useSession } from "@/lib/auth-client";
import { syncUserAndFetchJwt } from "@/lib/auth-sync";

interface EquipmentDetail {
  _id: string;
  name: string;
  category: string;
  image: string;
  gallery?: string[];
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Hourly" | "Monthly";
  location: string;
  isAvailable: boolean;
  availableQuantity: number;
  condition: string;
  rating: number;
  reviewsCount: number;
  owner: {
    name: string;
    avatar?: string;
    company: string;
    rating: number;
    responseTime: string;
    verified: boolean;
    location: string;
    totalRentals: number;
    email?: string;
  };
  ownerEmail?: string;
  specs: Record<string, string>;
  description: string;
  applications: string[];
  rentalTerms: {
    securityDeposit: number;
    damageWaiver: string;
    cancellationPolicy: string;
    operatingHoursAllowed: string;
    deliveryAvailable: boolean;
  };
}

function EquipmentDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const { data: session } = useSession();

  const [equipment, setEquipment] = React.useState<EquipmentDetail | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [favoriteId, setFavoriteId] = React.useState<string | null>(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = React.useState(false);
  const [isPageLoading, setIsPageLoading] = React.useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);

  // Booking Modal State
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [requiredQuantity, setRequiredQuantity] = React.useState(1);
  const [contactNumber, setContactNumber] = React.useState("");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [additionalNotes, setAdditionalNotes] = React.useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false);

  // 1. Fetch full details from backend
  React.useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setIsPageLoading(true);
        const apiUrl = getApiBaseUrl();
        const res = await axiosPublic.get(`${apiUrl}/api/equipment/${id}`);
        if (isMounted && res.data) {
          const item = res.data.equipment || res.data;
          const priceVal = Number(item.rentalPrice ?? item.price ?? item.pricePerDay ?? 0);
          const imageVal =
            item.image ||
            item.equipmentImage ||
            (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "");
          const nameVal = item.name || item.title || "Equipment Detail";
          const qtyVal = Number(item.availableQuantity ?? item.quantity ?? 1);

          const loadedEquip: EquipmentDetail = {
            _id: item._id,
            name: nameVal,
            category: item.category || "General",
            rentalPrice: priceVal,
            rentalType: item.rentalType || "Daily",
            location: item.location || "",
            image: imageVal,
            gallery: Array.isArray(item.images) && item.images.length > 0 ? item.images : [imageVal],
            availableQuantity: qtyVal,
            isAvailable: item.isAvailable !== undefined ? item.isAvailable : qtyVal > 0,
            condition: item.condition || "Excellent",
            rating: item.rating !== undefined ? Number(item.rating) : 5.0,
            reviewsCount: item.reviewsCount !== undefined ? Number(item.reviewsCount) : 0,
            specs: item.specs || {},
            owner: item.owner || {
              name: item.ownerName || "Equipment Owner",
              company: "Equipment Fleet LLC",
              rating: 5.0,
              responseTime: "Within 1 hour",
              verified: true,
              location: item.location || "",
              totalRentals: 0,
            },
            description: item.description || "",
            applications: Array.isArray(item.applications) ? item.applications : [],
            rentalTerms: item.rentalTerms || {
              securityDeposit: 500,
              damageWaiver: "Optional Comprehensive Damage Protection",
              cancellationPolicy: "Free cancellation up to 48 hours before scheduled start",
              operatingHoursAllowed: "8 engine hours per daily rate included",
              deliveryAvailable: true,
            },
          };

          setEquipment(loadedEquip);
          if (imageVal) {
            setSelectedImage(imageVal);
          }
        }
      } catch (err) {
        console.warn("Could not fetch equipment details from backend:", err);
        if (isMounted) setEquipment(null);
      } finally {
        if (isMounted) setIsPageLoading(false);
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. On page load, check if this item is in the logged-in user's favorites from GET /api/favorites/:email
  React.useEffect(() => {
    let isMounted = true;
    const checkFavoriteStatus = async () => {
      if (!session?.user?.email) return;

      try {
        const apiUrl = getApiBaseUrl();
        const token =
          localStorage.getItem("token") || localStorage.getItem("access-token");
        if (!token) {
          await syncUserAndFetchJwt({
            email: session.user.email,
            name: session.user.name || undefined,
            image: session.user.image || undefined,
            role: (session.user as any)?.role || "customer",
          });
        }

        const res = await axiosSecure.get(
          `${apiUrl}/api/favorites/${encodeURIComponent(session.user.email)}`
        );

        if (isMounted && Array.isArray(res.data)) {
          const match = res.data.find(
            (fav: any) =>
              fav.equipmentId === id ||
              fav.equipmentId?.toString() === id.toString() ||
              fav.equipment?._id === id ||
              fav.equipment?._id?.toString() === id.toString() ||
              (equipment?._id &&
                (fav.equipmentId === equipment._id ||
                  fav.equipment?._id === equipment._id))
          );

          if (match) {
            setIsFavorited(true);
            setFavoriteId(match._id);
          } else {
            setIsFavorited(false);
            setFavoriteId(null);
          }
        }
      } catch (err) {
        console.warn("Could not check favorite status from backend:", err);
      }
    };

    checkFavoriteStatus();
    return () => {
      isMounted = false;
    };
  }, [session?.user?.email, id, equipment?._id]);

  // Set min dates to today
  const todayStr = new Date().toISOString().split("T")[0];

  // Dynamic cost calculation
  const calculateDurationDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const durationDays = calculateDurationDays();
  const rentalPrice = equipment?.rentalPrice || 0;
  const baseRentalSubtotal = rentalPrice * durationDays * requiredQuantity;
  const damageWaiverFee = Math.round(baseRentalSubtotal * 0.08); // 8% waiver fee
  const securityDeposit = equipment?.rentalTerms?.securityDeposit || 500;
  const estimatedTotal = baseRentalSubtotal + damageWaiverFee;

  // 3. Handle Add to Favorites / Toggle
  const handleToggleFavorite = async () => {
    if (!equipment) return;
    if (!session?.user?.email) {
      toast.error("Please sign in to save equipment to your favorites.");
      return;
    }

    try {
      setIsFavoriteLoading(true);
      const apiUrl = getApiBaseUrl();

      const token =
        localStorage.getItem("token") || localStorage.getItem("access-token");
      if (!token) {
        await syncUserAndFetchJwt({
          email: session.user.email,
          name: session.user.name || undefined,
          image: session.user.image || undefined,
          role: (session.user as any)?.role || "customer",
        });
      }

      if (isFavorited) {
        // DELETE /api/favorites/:id
        const targetId = favoriteId || id;
        await axiosSecure.delete(`${apiUrl}/api/favorites/${targetId}`);
        setIsFavorited(false);
        setFavoriteId(null);
        toast.success("Removed from your saved equipment.");
      } else {
        // POST /api/favorites
        const res = await axiosSecure.post(`${apiUrl}/api/favorites`, {
          userEmail: session.user.email,
          equipmentId: equipment._id || id,
        });

        const newFavId = res.data?.favoriteId || res.data?._id;
        if (newFavId) {
          setFavoriteId(newFavId);
        }
        setIsFavorited(true);
        toast.success("Added to your favorites list!");
      }
    } catch (error: any) {
      console.error("Favorite toggle error:", error);
      const errMsg =
        error.response?.data?.message || "Failed to update favorite status.";
      toast.error(errMsg);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // Handle Booking & Stripe Checkout Redirect
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment) {
      toast.error("Equipment information is still loading.");
      return;
    }

    if (!startDate) {
      toast.error("Please select a rental start date.");
      return;
    }
    if (!endDate) {
      toast.error("Please select a rental end date.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("Rental end date cannot be earlier than start date.");
      return;
    }
    if (requiredQuantity < 1) {
      toast.error("Quantity must be at least 1 unit.");
      return;
    }
    if (requiredQuantity > (equipment.availableQuantity || 1)) {
      toast.error(`Only ${equipment.availableQuantity} units available.`);
      return;
    }
    if (!contactNumber.trim()) {
      toast.error("Please provide a contact phone number for jobsite dispatch.");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please provide the jobsite delivery or yard pickup address.");
      return;
    }

    try {
      setIsCheckoutLoading(true);
      const apiUrl = getApiBaseUrl();

      // Ensure user has valid JWT token in localStorage before checkout
      if (typeof window !== "undefined" && session?.user?.email) {
        const token = localStorage.getItem("token") || localStorage.getItem("access-token");
        if (!token) {
          await syncUserAndFetchJwt({
            email: session.user.email,
            name: session.user.name,
            image: session.user.image || undefined,
            role: (session.user as any)?.role || "customer",
          });
        }
      }

      const bookingPayload = {
        equipmentId: equipment._id,
        equipmentName: equipment.name,
        category: equipment.category,
        image: equipment.image,
        equipmentImage: equipment.image,
        startDate,
        endDate,
        durationDays,
        rentalDays: durationDays,
        quantity: requiredQuantity,
        contactNumber: contactNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        additionalNotes: additionalNotes.trim(),
        pricePerDay: equipment.rentalPrice,
        price: estimatedTotal,
        subtotal: baseRentalSubtotal,
        damageWaiverFee,
        totalAmount: estimatedTotal,
        totalPrice: estimatedTotal,
        ownerEmail: equipment.owner?.email || (equipment as any)?.ownerEmail || "",
        userEmail: session?.user?.email,
        userName: session?.user?.name,
      };

      const response = await axiosSecure.post(
        `${apiUrl}/api/bookings/create-checkout`,
        bookingPayload
      );

      const targetUrl = response.data?.url || response.data?.checkoutUrl;

      if (targetUrl) {
        toast.success("Redirecting to Stripe payment checkout...");
        window.location.href = targetUrl;
        return;
      } else {
        toast.error("Failed to generate Stripe checkout session. Please try again.");
      }
    } catch (error: any) {
      console.error("Backend checkout call error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Payment service unreachable. Please ensure the backend server is running.";
      toast.error(errorMsg);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
          <Loader2 className="size-10 animate-spin text-emerald-600 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Loading equipment specifications...</p>
        </div>
      </PrivateRoute>
    );
  }

  if (!equipment) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="size-12 text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Equipment Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            The requested equipment could not be found or has been removed from the platform.
          </p>
          <Link
            href="/equipment"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Equipment Catalog</span>
          </Link>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background text-foreground pb-20">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-border bg-card/60 py-3.5">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to All Equipment</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Add to Favorites Button */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                disabled={isFavoriteLoading}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isFavorited
                    ? "border-red-500/50 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {isFavoriteLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Heart
                    className={`size-3.5 ${
                      isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`}
                  />
                )}
                <span>{isFavorited ? "Favorited" : "Save to Favorites"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Details Body */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Columns: Gallery, Overview & Specs */}
            <div className="lg:col-span-7 space-y-8">
              {/* Main Image Display */}
              <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
                <div className="relative h-96 w-full">
                  <img
                    src={selectedImage}
                    alt={equipment.name}
                    className="h-full w-full object-cover transition-all duration-300"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-[#111827]/85 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    {equipment.category}
                  </span>
                  <span
                    className={`absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-md ${
                      equipment.isAvailable
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full ${
                        equipment.isAvailable ? "bg-white animate-pulse" : "bg-gray-400"
                      }`}
                    />
                    <span>{equipment.isAvailable ? "Available" : "Rented Out"}</span>
                  </span>
                </div>

                {/* Thumbnails */}
                {equipment.gallery && equipment.gallery.length > 1 && (
                  <div className="flex gap-2 p-3 bg-card border-t border-border overflow-x-auto">
                    {equipment.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative size-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === img
                            ? "border-emerald-500 shadow-sm"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Key Attributes */}
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    {equipment.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {equipment.rating} ({equipment.reviewsCount} verified reviews)
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {equipment.availableQuantity} Units in Stock
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {equipment.name}
                </h1>
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  Condition: <span className="text-foreground">{equipment.condition}</span>
                </p>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Equipment Description</span>
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {equipment.description}
                </p>

                {/* Applications list */}
                <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Ideal Jobsite Applications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {equipment.applications.map((app, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                      <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Technical Specifications</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(equipment.specs).map(([key, val]) => (
                    <div key={key} className="rounded-lg bg-muted/40 p-3 border border-border/60">
                      <span className="text-muted-foreground block text-[11px] font-medium">{key}</span>
                      <span className="font-semibold text-foreground mt-0.5 block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental Terms & Policies */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Rental Terms &amp; Jobsite Protection</span>
                </h2>

                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Security Deposit:</strong> ${equipment.rentalTerms.securityDeposit} refundable hold placed at checkout, released upon equipment return inspection.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Jobsite Protection:</strong> {equipment.rentalTerms.damageWaiver}. Covers accidental machinery rollover, mechanical failure, and glass breakage.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Cancellation:</strong> {equipment.rentalTerms.cancellationPolicy}.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Operating Allowance:</strong> {equipment.rentalTerms.operatingHoursAllowed}.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Sticky Booking Card & Owner Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Primary Rental Booking Card */}
              <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-emerald-950/5">
                <div className="flex items-baseline justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Rental Rate
                    </span>
                    <span className="text-3xl font-extrabold text-foreground">
                      ${equipment.rentalPrice}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {" "}/ {equipment.rentalType.toLowerCase()}
                    </span>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Insured Rental
                  </span>
                </div>

                {/* Quick Delivery Tag */}
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  <Truck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Direct jobsite drop-off available in {equipment.location}</span>
                </div>

                {/* Booking Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  disabled={!equipment.isAvailable}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-950/20 transition-all hover:bg-emerald-500 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                >
                  <Calendar className="size-5" />
                  <span>{equipment.isAvailable ? "Book This Equipment" : "Currently Unavailable"}</span>
                </button>

                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  You will not be charged until the owner verifies availability.
                </p>

                {/* Price Summary Preview */}
                <div className="mt-6 border-t border-border pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base 1-Day Rental</span>
                    <span>${equipment.rentalPrice}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Rental Damage Waiver (8%)</span>
                    <span>${Math.round(equipment.rentalPrice * 0.08)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border/60">
                    <span>Estimated Daily Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                      ${equipment.rentalPrice + Math.round(equipment.rentalPrice * 0.08)}
                    </span>
                  </div>
                </div>

                {/* Owner Card */}
                <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm">
                      {equipment.owner.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-foreground">
                          {equipment.owner.name}
                        </span>
                        {equipment.owner.verified && (
                          <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{equipment.owner.company}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground border-t border-border pt-3">
                    <div>
                      <span>Owner Rating:</span>{" "}
                      <strong className="text-foreground">{equipment.owner.rating} ★</strong>
                    </div>
                    <div>
                      <span>Response:</span>{" "}
                      <strong className="text-foreground">{equipment.owner.responseTime}</strong>
                    </div>
                    <div>
                      <span>Completed:</span>{" "}
                      <strong className="text-foreground">{equipment.owner.totalRentals} rentals</strong>
                    </div>
                    <div>
                      <span>Fleet Area:</span>{" "}
                      <strong className="text-foreground">{equipment.owner.location}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING MODAL */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Rental Reservation
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-foreground">
                    Book {equipment.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
                {/* Date Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Required Quantity */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Required Quantity
                    </label>
                    <span className="text-xs text-muted-foreground">
                      Max: {equipment.availableQuantity} units available
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={equipment.availableQuantity || 1}
                    required
                    value={requiredQuantity}
                    onChange={(e) => setRequiredQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Contact Phone Number */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                    Contact Phone Number (For Dispatch)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Phone className="size-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full rounded-lg border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                    Jobsite Delivery Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <MapPin className="size-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Jobsite 14, 400 Industrial Way, Chicago, IL"
                      className="w-full rounded-lg border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
                    Additional Notes &amp; Access Codes
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Gate codes, delivery time window, on-site contact person..."
                    className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Dynamic Cost Itemization Breakdown */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      ${equipment.rentalPrice} × {durationDays} day{durationDays > 1 ? "s" : ""} × {requiredQuantity} unit{requiredQuantity > 1 ? "s" : ""}
                    </span>
                    <span className="font-semibold text-foreground">${baseRentalSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Damage Waiver &amp; Protection (8%)</span>
                    <span className="font-semibold text-foreground">${damageWaiverFee}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Refundable Security Deposit (Hold)</span>
                    <span className="font-semibold text-foreground">${securityDeposit}</span>
                  </div>
                  <div className="border-t border-emerald-500/30 pt-2 flex justify-between text-sm font-bold text-foreground">
                    <span>Total Due at Checkout:</span>
                    <span className="text-emerald-500 font-extrabold">${estimatedTotal}</span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  disabled={isCheckoutLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-500 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                >
                  {isCheckoutLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Redirecting to Stripe Checkout...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-4" />
                      <span>Proceed to Stripe Checkout (${estimatedTotal})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}

export default function EquipmentDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <EquipmentDetailsContent />
    </React.Suspense>
  );
}
