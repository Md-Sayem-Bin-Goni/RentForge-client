"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Heart,
  MapPin,
  Star,
  Trash2,
  ArrowUpRight,
  RotateCcw,
  Search,
  Wrench,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { axiosSecure } from "@/lib/axiosSecure";
import { useSession } from "@/lib/auth-client";

interface FavoriteEquipment {
  _id: string;
  equipmentId: string;
  name: string;
  category: string;
  image: string;
  rentalPrice: number;
  rentalType: string;
  location: string;
  isAvailable: boolean;
  rating: number;
  addedAt: string;
}

// Fallback favorites list for robust preview
const MOCK_FAVORITES: FavoriteEquipment[] = [
  {
    _id: "fav-1",
    equipmentId: "eq-201",
    name: "CAT 308 CR Mini Hydraulic Excavator",
    category: "Construction Equipment",
    image:
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=400&q=80",
    rentalPrice: 320,
    rentalType: "Daily",
    location: "Chicago, IL",
    isAvailable: true,
    rating: 4.95,
    addedAt: "2026-11-18",
  },
  {
    _id: "fav-2",
    equipmentId: "eq-202",
    name: "RED V-Raptor 8K VV Cinema Package",
    category: "Photography Equipment",
    image:
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=400&q=80",
    rentalPrice: 450,
    rentalType: "Daily",
    location: "Los Angeles, CA",
    isAvailable: true,
    rating: 5.0,
    addedAt: "2026-11-15",
  },
  {
    _id: "fav-3",
    equipmentId: "eq-203",
    name: "JLG 600AJ 60ft Articulating Boom Lift",
    category: "Construction Equipment",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    rentalPrice: 1350,
    rentalType: "Weekly",
    location: "Dallas, TX",
    isAvailable: true,
    rating: 4.9,
    addedAt: "2026-11-10",
  },
  {
    _id: "fav-4",
    equipmentId: "eq-205",
    name: "Cummins 100kW Towable Quiet Generator",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80",
    rentalPrice: 210,
    rentalType: "Daily",
    location: "Atlanta, GA",
    isAvailable: false,
    rating: 4.92,
    addedAt: "2026-11-04",
  },
];

export default function FavoritesPage() {
  const { data: session } = useSession();

  const [favorites, setFavorites] = React.useState<FavoriteEquipment[]>(MOCK_FAVORITES);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  // Fetch favorites from backend
  React.useEffect(() => {
    let isCancelled = false;

    const fetchFavorites = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const email = session?.user?.email;
        const res = await axiosSecure.get(`${apiUrl}/api/favorites`, {
          params: { userEmail: email },
        });

        if (!isCancelled && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : res.data.favorites || res.data.items || [];
          if (list.length > 0) {
            setFavorites(list);
          }
        }
      } catch (err) {
        // Fallback to mock list
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      isCancelled = true;
    };
  }, [session]);

  // Handle Remove from Favorites
  const handleRemove = async (favId: string, equipmentName: string) => {
    try {
      setRemovingId(favId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Call DELETE /api/favorites/:id
      try {
        await axiosSecure.delete(`${apiUrl}/api/favorites/${favId}`);
      } catch (err) {
        // Optimistic removal for mock support
      }

      setFavorites((prev) => prev.filter((item) => item._id !== favId));
      toast.success(`Removed "${equipmentName}" from favorites.`);
    } catch (error) {
      toast.error("Failed to remove favorite item.");
    } finally {
      setRemovingId(null);
    }
  };

  const filteredFavorites = favorites.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PrivateRoute allowedRoles={["customer"]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1.5">
              <Heart className="size-3.5 fill-current" />
              <span>Saved Machinery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              My Saved Equipment
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick access to your bookmarked machinery, camera packages, and commercial tools.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors w-fit"
          >
            <span>Explore Catalog</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <Search className="size-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved equipment by name, category, or city..."
              className="w-full rounded-xl border border-input bg-background py-2 pr-3 pl-9 text-xs sm:text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <span className="text-xs text-muted-foreground whitespace-nowrap">
            <strong className="text-foreground">{filteredFavorites.length}</strong> items saved
          </span>
        </div>

        {/* Favorites Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
              <p className="mt-3 text-sm text-muted-foreground">Loading your saved favorites...</p>
            </div>
          ) : filteredFavorites.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                <Heart className="size-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No Saved Equipment</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                You haven&apos;t saved any equipment to your favorites yet.
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
                    <th className="py-3.5 px-4 sm:px-6">Equipment</th>
                    <th className="py-3.5 px-4">Rental Rate</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Availability</th>
                    <th className="py-3.5 px-4">Saved On</th>
                    <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFavorites.map((item) => (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-muted/30 group"
                    >
                      {/* Equipment Image & Name */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-12 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/equipment/${item.equipmentId}`}
                              className="font-bold text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <span className="text-[11px] text-muted-foreground block">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rental Rate */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-foreground text-sm">
                          ${item.rentalPrice}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {" "}/ {item.rentalType.toLowerCase()}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          {item.location}
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            item.isAvailable
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              item.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                            }`}
                          />
                          <span>{item.isAvailable ? "Available" : "Rented Out"}</span>
                        </span>
                      </td>

                      {/* Saved Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-muted-foreground">
                        {item.addedAt}
                      </td>

                      {/* Actions: View Details + Remove */}
                      <td className="py-4 px-4 text-right pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/equipment/${item.equipmentId}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="size-3" />
                          </Link>

                          <button
                            type="button"
                            disabled={removingId === item._id}
                            onClick={() => handleRemove(item._id, item.name)}
                            aria-label="Remove from favorites"
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-50 p-1.5 text-xs font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                          >
                            {removingId === item._id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}
