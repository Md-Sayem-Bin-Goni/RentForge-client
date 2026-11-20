"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Wrench,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
  DollarSign,
  Layers,
  X,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { useSession } from "@/lib/auth-client";
import { syncUserAndFetchJwt } from "@/lib/auth-sync";
import { axiosSecure } from "@/lib/axiosSecure";

interface EquipmentItem {
  _id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  availableQuantity: number;
  location: string;
  image: string;
  status: "Approved" | "Pending" | "Rejected";
  condition?: string;
  description?: string;
  rentalTerms?: string;
  createdAt?: string;
}

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

export default function MyEquipmentPage() {
  const { data: session } = useSession();

  const [equipmentList, setEquipmentList] = React.useState<EquipmentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<EquipmentItem | null>(null);
  const [editFormData, setEditFormData] = React.useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    rentalPrice: 0,
    rentalType: "Daily" as "Daily" | "Weekly" | "Monthly",
    availableQuantity: 1,
    location: "",
    condition: "Excellent",
    description: "",
    rentalTerms: "",
  });
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState<EquipmentItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Fetch owner equipment from GET /api/equipment/owner/:email
  const fetchEquipment = React.useCallback(async () => {
    setIsLoading(true);
    const email = session?.user?.email;
    if (!email) {
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Ensure JWT token exists
      const token =
        localStorage.getItem("token") || localStorage.getItem("access-token");
      if (!token) {
        await syncUserAndFetchJwt({
          email: session.user.email,
          name: session.user.name || undefined,
          image: session.user.image || undefined,
          role: (session.user as any)?.role || "owner",
        });
      }

      // Live fetch from authenticated GET /api/equipment/owner/:email
      const res = await axiosSecure.get(
        `${apiUrl}/api/equipment/owner/${encodeURIComponent(email)}`
      );

      const items = res.data?.equipment || res.data?.data || res.data;

      if (Array.isArray(items)) {
        const mapped = items.map((it: any) => ({
          ...it,
          rentalPrice: Number(it.rentalPrice ?? it.price ?? it.pricePerDay ?? 0),
          price: Number(it.price ?? it.rentalPrice ?? it.pricePerDay ?? 0),
          image:
            it.image ||
            it.equipmentImage ||
            (Array.isArray(it.images) && it.images.length > 0 ? it.images[0] : ""),
          availableQuantity: Number(it.availableQuantity ?? it.quantity ?? 1),
        }));
        setEquipmentList(mapped);
      } else {
        setEquipmentList([]);
      }
    } catch (err: any) {
      console.warn("Could not fetch owner equipment from backend:", err);
      setEquipmentList([]);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email, session?.user?.name, session?.user?.image, session?.user]);

  React.useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Open Edit Modal
  const handleOpenEdit = (item: EquipmentItem) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      category: item.category,
      brand: item.brand || "",
      model: item.model || "",
      rentalPrice: item.rentalPrice,
      rentalType: item.rentalType,
      availableQuantity: item.availableQuantity,
      location: item.location,
      condition: item.condition || "Excellent",
      description: item.description || "",
      rentalTerms: item.rentalTerms || "",
    });
    setIsEditOpen(true);
  };

  // Submit Edit Modal (PATCH /api/equipment/:id)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSavingEdit(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axiosSecure.patch(`${apiUrl}/api/equipment/${editingItem._id}`, editFormData);

      toast.success("Equipment details updated successfully in MongoDB!");
      setIsEditOpen(false);
      setEditingItem(null);
      await fetchEquipment();
    } catch (err: any) {
      console.error("Backend PATCH /api/equipment error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update equipment.";
      toast.error(errMsg);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (item: EquipmentItem) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  // Confirm Delete (DELETE /api/equipment/:id)
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axiosSecure.delete(`${apiUrl}/api/equipment/${deletingItem._id}`);

      toast.success(`"${deletingItem.name}" deleted from your inventory in MongoDB.`);
      setIsDeleteOpen(false);
      setDeletingItem(null);
      await fetchEquipment();
    } catch (err: any) {
      console.error("Backend DELETE /api/equipment error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to delete equipment.";
      toast.error(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtering
  const filteredEquipment = React.useMemo(() => {
    return equipmentList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [equipmentList, searchTerm, statusFilter]);

  // Counts
  const counts = React.useMemo(() => {
    return {
      all: equipmentList.length,
      approved: equipmentList.filter((e) => e.status === "Approved").length,
      pending: equipmentList.filter((e) => e.status === "Pending").length,
      rejected: equipmentList.filter((e) => e.status === "Rejected").length,
    };
  }, [equipmentList]);

  return (
    <PrivateRoute allowedRoles={["owner", "admin"]}>
      <div className="space-y-8 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              My Equipment Fleet
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your machinery listings, track admin review status, edit specs, and monitor availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchEquipment()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
              title="Refresh inventory"
            >
              <RotateCcw className="size-3.5" />
              <span>Refresh</span>
            </button>

            <Link
              href="/dashboard/add-equipment"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
            >
              <PlusCircle className="size-4" />
              <span>Add Equipment</span>
            </Link>
          </div>
        </div>

        {/* Filter & Metric Tabs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "All", label: "All Fleet", count: counts.all },
              { id: "Approved", label: "Approved / Active", count: counts.approved },
              { id: "Pending", label: "Pending Review", count: counts.pending },
              { id: "Rejected", label: "Rejected / Inactive", count: counts.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
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

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search machine, brand, location..."
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Equipment Table */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
              <Loader2 className="size-8 animate-spin text-emerald-600 dark:text-emerald-400" />
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Loading equipment fleet...
              </p>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Wrench className="size-8" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">
                No equipment matches found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                {searchTerm || statusFilter !== "All"
                  ? "Try resetting your search filters or status selection."
                  : "You haven't listed any equipment yet. Click below to publish your first machine."}
              </p>
              <div className="mt-5 flex items-center gap-3">
                {(searchTerm || statusFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("All");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Reset Filters
                  </button>
                )}
                <Link
                  href="/dashboard/add-equipment"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500"
                >
                  <PlusCircle className="size-3.5" />
                  <span>Add First Equipment</span>
                </Link>
              </div>
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
                      Category
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Rental Rate
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Available Qty
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Location
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Status
                    </th>
                    <th scope="col" className="py-4 pl-4 pr-6 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEquipment.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Name & Photo */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          </div>
                          <div>
                            <Link
                              href={`/equipment/${item._id}`}
                              className="font-bold text-sm text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {item.brand ? `${item.brand} • ` : ""}
                              {item.model || "Standard Model"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 font-medium text-foreground whitespace-nowrap">
                        {item.category}
                      </td>

                      {/* Rental Rate */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-extrabold text-sm text-foreground">
                          ${item.rentalPrice}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {" "}
                          / {item.rentalType}
                        </span>
                      </td>

                      {/* Available Qty */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-lg bg-muted text-foreground">
                          {item.availableQuantity} units
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {item.location}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {item.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="size-3" />
                            <span>Approved</span>
                          </span>
                        ) : item.status === "Pending" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-500 border border-amber-500/20">
                            <Clock className="size-3" />
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[11px] font-bold text-rose-500 border border-rose-500/20">
                            <XCircle className="size-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details */}
                          <Link
                            href={`/equipment/${item._id}`}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="View Public Details"
                          >
                            <Eye className="size-3.5" />
                          </Link>

                          {/* Edit Modal (PATCH) */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            title="Edit Equipment Details"
                          >
                            <Edit3 className="size-3.5" />
                          </button>

                          {/* Delete Confirmation (DELETE) */}
                          <button
                            onClick={() => handleOpenDelete(item)}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                            title="Delete Equipment"
                          >
                            <Trash2 className="size-3.5" />
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

        {/* ----------------- EDIT MODAL (PATCH) ----------------- */}
        {isEditOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Edit3 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Edit Equipment Details
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      ID: {editingItem._id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Category
                    </label>
                    <select
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Condition
                    </label>
                    <input
                      type="text"
                      value={editFormData.condition}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          condition: e.target.value,
                        })
                      }
                      placeholder="e.g. Excellent / Like New"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Rental Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editFormData.rentalPrice}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          rentalPrice: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Billing Type
                    </label>
                    <select
                      value={editFormData.rentalType}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          rentalType: e.target.value as any,
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Available Qty
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editFormData.availableQuantity}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          availableQuantity: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Location / Depot
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none resize-y"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isSavingEdit ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>Save Changes (PATCH)</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- DELETE CONFIRMATION MODAL (DELETE) ----------------- */}
        {isDeleteOpen && deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/5">
                <AlertTriangle className="size-7" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-foreground">
                Delete Equipment Listing?
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="font-bold text-foreground">
                  &quot;{deletingItem.name}&quot;
                </span>
                ? This will remove this machine from the public catalog and disable new bookings.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Permanently</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
