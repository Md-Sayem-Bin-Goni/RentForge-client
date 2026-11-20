"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  Wrench,
  User,
  Calendar,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { useSession } from "@/lib/auth-client";
import { axiosSecure } from "@/lib/axiosSecure";

interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
  image?: string;
  createdAt: string;
  phone?: string;
  location?: string;
}

export default function AllUsersAdminPage() {
  const { data: session } = useSession();

  const [users, setUsers] = React.useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("All");
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axiosSecure.get(`${apiUrl}/api/users`);
      const data = res.data?.users || res.data?.data || res.data;

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.warn("Could not fetch users from backend:", err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Role Change
  const handleRoleChange = async (
    targetUser: PlatformUser,
    newRole: "customer" | "owner" | "admin"
  ) => {
    if (targetUser.role === newRole) return;

    // Prevent accidentally demoting currently logged in admin without notice
    if (
      session?.user?.email === targetUser.email &&
      newRole !== "admin" &&
      !window.confirm("You are about to change your own role from Admin. Proceed?")
    ) {
      return;
    }

    setUpdatingUserId(targetUser._id);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const encodedEmail = encodeURIComponent(targetUser.email);

      // Persist role update to MongoDB across both 'users' and 'user' collections
      await axiosSecure.patch(`${apiUrl}/api/users/${encodedEmail}`, {
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
      toast.success(
        `Role for "${targetUser.name}" successfully updated to ${newRole.toUpperCase()} in MongoDB!`
      );
    } catch (err: any) {
      console.error("Failed to update user role in MongoDB:", err);
      const errMsg =
        err.response?.data?.message || err.message || "Failed to update user role in database.";
      toast.error(errMsg);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter Users
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.location && u.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole =
        roleFilter === "All" || u.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Role Counts
  const counts = React.useMemo(() => {
    return {
      all: users.length,
      customers: users.filter((u) => u.role === "customer").length,
      owners: users.filter((u) => u.role === "owner").length,
      admins: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <div className="space-y-8 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              User Role Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage platform contractor accounts, assign equipment owner privileges, and delegate administrator roles.
            </p>
          </div>

          <button
            onClick={() => fetchUsers()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="size-3.5" />
            <span>Refresh Users</span>
          </button>
        </div>

        {/* Filter Pills & Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Role Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "All", label: "All Users", count: counts.all },
              { id: "customer", label: "Customers", count: counts.customers },
              { id: "owner", label: "Equipment Owners", count: counts.owners },
              { id: "admin", label: "Administrators", count: counts.admins },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setRoleFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  roleFilter === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    roleFilter === tab.id
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, city..."
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
              <Loader2 className="size-8 animate-spin text-emerald-600 dark:text-emerald-400" />
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Loading user directory...
              </p>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Users className="size-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">
                No users found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                No registered accounts match your current search or role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 uppercase tracking-wider text-[11px] font-bold text-muted-foreground">
                  <tr>
                    <th scope="col" className="py-4 pl-6 pr-4">
                      User Profile
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Email Address
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Registration Date
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Current Role
                    </th>
                    <th scope="col" className="py-4 pl-4 pr-6 text-right">
                      Change Role Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedUsers.map((u) => {
                    const isSelf = session?.user?.email === u.email;
                    const isUpdating = updatingUserId === u._id;

                    return (
                      <tr
                        key={u._id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Name & Photo */}
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center">
                              {u.image ? (
                                <Image
                                  src={u.image}
                                  alt={u.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <span>{u.name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-foreground">
                                  {u.name}
                                </span>
                                {isSelf && (
                                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                {u.location || "United States"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-4 font-medium text-foreground whitespace-nowrap">
                          {u.email}
                        </td>

                        {/* Registration Date */}
                        <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{u.createdAt}</span>
                          </div>
                        </td>

                        {/* Current Role Badge */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {u.role === "admin" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              <ShieldCheck className="size-3" />
                              <span>Administrator</span>
                            </span>
                          ) : u.role === "owner" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <Wrench className="size-3" />
                              <span>Equipment Owner</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-3 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 border border-slate-500/20">
                              <User className="size-3" />
                              <span>Customer</span>
                            </span>
                          )}
                        </td>

                        {/* Action Buttons/Dropdown to Change Role */}
                        <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-2xs">
                            {isUpdating ? (
                              <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] text-muted-foreground font-semibold">
                                <Loader2 className="size-3.5 animate-spin text-emerald-600" />
                                <span>Updating...</span>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRoleChange(u, "customer")}
                                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                                    u.role === "customer"
                                      ? "bg-slate-700 text-white shadow-2xs"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                  title="Assign Customer role"
                                >
                                  Customer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRoleChange(u, "owner")}
                                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                                    u.role === "owner"
                                      ? "bg-emerald-600 text-white shadow-2xs"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                  title="Assign Equipment Owner role"
                                >
                                  Owner
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRoleChange(u, "admin")}
                                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                                    u.role === "admin"
                                      ? "bg-purple-600 text-white shadow-2xs"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                  title="Assign Administrator role"
                                >
                                  Admin
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredUsers.length > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <span className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">
                  {filteredUsers.length}
                </span>{" "}
                registered users
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
      </div>
    </PrivateRoute>
  );
}
