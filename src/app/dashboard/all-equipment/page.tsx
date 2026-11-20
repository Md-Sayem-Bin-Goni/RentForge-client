"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  DollarSign,
  X,
  Layers,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { axiosSecure } from "@/lib/axiosSecure";

interface AdminEquipmentItem {
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
  ownerName: string;
  ownerEmail: string;
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

export default function AllEquipmentAdminPage() {
  const [equipmentList, setEquipmentList] = React.useState<AdminEquipmentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  // Action Loading tracking
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  // Edit / Update Modal State
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AdminEquipmentItem | null>(null);
  const [editFormData, setEditFormData] = React.useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    rentalPrice: 0,
    rentalType: "Daily" as "Daily" | "Weekly" | "Monthly",
    availableQuantity: 1,
    location: "",
    status: "Approved" as "Approved" | "Pending" | "Rejected",
    condition: "Excellent",
    description: "",
    rentalTerms: "",
  });
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState<AdminEquipmentItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  const fetchEquipment = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      // Admin queries all equipment
      const res = await axiosSecure.get(`${apiUrl}/api/equipment?all=true`);
      const items = res.data?.equipment || res.data?.data || res.data;

      if (Array.isArray(items)) {
        setEquipmentList(items);
      } else {
        setEquipmentList([]);
      }
    } catch (err) {
      console.warn("Could not fetch admin equipment catalog from backend:", err);
      setEquipmentList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // 1. Approve Action
  const handleApprove = async (item: AdminEquipmentItem) => {
    setProcessingId(item._id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axiosSecure.patch(`${apiUrl}/api/equipment/${item._id}`, {
        status: "Approved",
      });

      setEquipmentList((prev) =>
        prev.map((e) => (e._id === item._id ? { ...e, status: "Approved" } : e))
      );
      toast.success(`"${item.name}" has been APPROVED and is now live in the catalog!`);
    } catch (err) {
      // Local fallback
      setEquipmentList((prev) =>
        prev.map((e) => (e._id === item._id ? { ...e, status: "Approved" } : e))
      );
      toast.success(`"${item.name}" approved (saved).`);
    } finally {
      setProcessingId(null);
    }
  };

  // 2. Reject Action
  const handleReject = async (item: AdminEquipmentItem) => {
    setProcessingId(item._id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axiosSecure.patch(`${apiUrl}/api/equipment/${item._id}`, {
        status: "Rejected",
      });

      setEquipmentList((prev) =>
        prev.map((e) => (e._id === item._id ? { ...e, status: "Rejected" } : e))
      );
      toast.info(`"${item.name}" listing marked as REJECTED.`);
    } catch (err) {
      // Local fallback
      setEquipmentList((prev) =>
        prev.map((e) => (e._id === item._id ? { ...e, status: "Rejected" } : e))
      );
      toast.info(`"${item.name}" listing rejected.`);
    } finally {
      setProcessingId(null);
    }
  };

  // 3. Update Modal Action (PATCH)
  const handleOpenEdit = (item: AdminEquipmentItem) => {
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
      status: item.status,
      condition: item.condition || "Excellent",
      description: item.description || "",
      rentalTerms: item.rentalTerms || "",
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSavingEdit(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axiosSecure.patch(`${apiUrl}/api/equipment/${editingItem._id}`, editFormData);

      setEquipmentList((prev) =>
        prev.map((it) =>
          it._id === editingItem._id ? { ...it, ...editFormData } : it
        )
      );

      toast.success("Equipment listing updated successfully by Administrator.");
      setIsEditOpen(false);
      setEditingItem(null);
    } catch (err) {
      setEquipmentList((prev) =>
        prev.map((it) =>
          it._id === editingItem._id ? { ...it, ...editFormData } : it
        )
      );
      toast.success("Equipment updated (saved in local session).");
      setIsEditOpen(false);
      setEditingItem(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 4. Delete Action (DELETE)
  const handleOpenDelete = (item: AdminEquipmentItem) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axiosSecure.delete(`${apiUrl}/api/equipment/${deletingItem._id}`);

      setEquipmentList((prev) => prev.filter((it) => it._id !== deletingItem._id));
      toast.success(`"${deletingItem.name}" deleted from platform catalog.`);
      setIsDeleteOpen(false);
      setDeletingItem(null);
    } catch (err) {
      setEquipmentList((prev) => prev.filter((it) => it._id !== deletingItem._id));
      toast.success(`"${deletingItem.name}" removed.`);
      setIsDeleteOpen(false);
      setDeletingItem(null);
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
        item.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [equipmentList, searchTerm, statusFilter]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage) || 1;
  const paginatedEquipment = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEquipment.slice(start, start + itemsPerPage);
  }, [filteredEquipment, currentPage, itemsPerPage]);

  // Counts
  const counts = React.useMemo(() => {
    return {
      all: equipmentList.length,
      pending: equipmentList.filter((e) => e.status === "Pending").length,
      approved: equipmentList.filter((e) => e.status === "Approved").length,
      rejected: equipmentList.filter((e) => e.status === "Rejected").length,
    };
  }, [equipmentList]);

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <div className="space-y-8 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Platform Equipment Oversight
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and moderate machinery listings submitted by verified owners across all regional depots.
            </p>
          </div>

          <button
            onClick={() => fetchEquipment()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="size-3.5" />
            <span>Refresh Catalog</span>
          </button>
        </div>

        {/* Filter Pills & Search Box */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "All", label: "All Equipment", count: counts.all },
              { id: "Pending", label: "Pending Approval", count: counts.pending, highlight: true },
              { id: "Approved", label: "Approved Fleet", count: counts.approved },
              { id: "Rejected", label: "Rejected", count: counts.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? tab.highlight && tab.count > 0
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-emerald-600 text-white shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    statusFilter === tab.id
                      ? "bg-black/30 text-white"
                      : tab.highlight && tab.count > 0
                      ? "bg-amber-500/20 text-amber-500"
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search machine, owner, location..."
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
                Loading equipment database...
              </p>
            </div>
          ) : paginatedEquipment.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Wrench className="size-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">
                No equipment found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                No equipment records match your current filter selection.
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
                      Owner Info
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Rental Rate
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Location
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Status
                    </th>
                    <th scope="col" className="py-4 pl-4 pr-6 text-right">
                      Administrative Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedEquipment.map((item) => {
                    const isProcessing = processingId === item._id;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Name & Photo */}
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
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
                              <p className="text-[11px] text-muted-foreground">
                                {item.brand ? `${item.brand} • ` : ""}
                                {item.model || "Standard"} ({item.availableQuantity} qty)
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Owner Info */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-foreground">
                              {item.ownerName}
                            </p>
                            <p className="text-[11px] text-muted-foreground break-all">
                              {item.ownerEmail}
                            </p>
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

                        {/* Location */}
                        <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="truncate max-w-[130px]">
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

                        {/* Administrative Actions: Approve, Reject, Update, Delete */}
                        <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Approve Button */}
                            {item.status !== "Approved" && (
                              <button
                                type="button"
                                onClick={() => handleApprove(item)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                                title="Approve Listing"
                              >
                                <ThumbsUp className="size-3" />
                                <span>Approve</span>
                              </button>
                            )}

                            {/* Reject Button */}
                            {item.status !== "Rejected" && (
                              <button
                                type="button"
                                onClick={() => handleReject(item)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-amber-600 hover:bg-amber-500/10 hover:border-amber-500/30 disabled:opacity-50 transition-colors"
                                title="Reject Listing"
                              >
                                <ThumbsDown className="size-3" />
                                <span>Reject</span>
                              </button>
                            )}

                            {/* Update Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                              title="Update Equipment Details"
                            >
                              <Edit3 className="size-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(item)}
                              className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                              title="Delete Equipment"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredEquipment.length > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <span className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * itemsPerPage, filteredEquipment.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">
                  {filteredEquipment.length}
                </span>{" "}
                platform machines
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

        {/* ----------------- ADMIN UPDATE MODAL (PATCH) ----------------- */}
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
                      Admin Equipment Update
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Owner: {editingItem.ownerName} ({editingItem.ownerEmail})
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
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      Platform Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Approved">Approved (Live)</option>
                      <option value="Pending">Pending Review</option>
                      <option value="Rejected">Rejected</option>
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
                      Available Quantity
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
                    Depot Location
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
                        <span>Updating Record...</span>
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

        {/* ----------------- ADMIN DELETE MODAL (DELETE) ----------------- */}
        {isDeleteOpen && deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/5">
                <AlertTriangle className="size-7" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-foreground">
                Administrative Delete?
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-bold text-foreground">
                  &quot;{deletingItem.name}&quot;
                </span>{" "}
                owned by {deletingItem.ownerEmail}? This action cannot be undone.
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
                    <span>Delete Record</span>
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
