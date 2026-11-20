"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Upload,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { syncUserAndFetchJwt } from "@/lib/auth-sync";
import { RentForgeLogo } from "@/components/shared/Navbar";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // Photo state (file upload to imgbb vs direct URL)
  const [photoMode, setPhotoMode] = React.useState<"upload" | "url">("upload");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [uploadFileName, setUploadFileName] = React.useState("");

  // Submission loading state
  const [isLoading, setIsLoading] = React.useState(false);

  // Password validation rules:
  // - at least 1 uppercase letter
  // - at least 1 lowercase letter
  // - min 6 characters
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  // Handle image upload to imgbb
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbApiKey) {
      toast.error("ImgBB API key is not configured in environment variables.");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setUploadFileName(file.name);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        const uploadedUrl = data.data.display_url || data.data.url;
        setPhotoUrl(uploadedUrl);
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error(data.error?.message || "Failed to upload image to ImgBB.");
      }
    } catch (error) {
      console.error("ImgBB upload error:", error);
      toast.error("Image upload failed. Please try a direct URL instead.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password validation check
    if (!hasMinLength) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (!hasUppercase) {
      toast.error("Password must contain at least one uppercase letter (A-Z).");
      return;
    }

    if (!hasLowercase) {
      toast.error("Password must contain at least one lowercase letter (a-z).");
      return;
    }

    try {
      setIsLoading(true);

      // 1. Better-Auth signUp
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // 2. Sync user to backend POST /api/users & fetch JWT from POST /api/jwt
      await syncUserAndFetchJwt({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        image: photoUrl.trim() || "",
        role: "customer",
      });

      // 3. Success notification & redirect
      toast.success("Account created successfully! Welcome to RentForge.");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "An unexpected error occurred during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <RentForgeLogo className="size-10 drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]" />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Rent<span className="font-extrabold text-emerald-600 dark:text-emerald-400">Forge</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the premier equipment and heavy machinery rental platform.
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-emerald-950/5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
              >
                Full Name
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="size-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="block w-full rounded-lg border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@contracting.com"
                  className="block w-full rounded-lg border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Profile Photo: Upload or URL */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Profile Photo
                </label>
                <div className="flex items-center gap-1 rounded-md bg-muted p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPhotoMode("upload")}
                    className={`rounded px-2 py-0.5 font-medium transition-colors ${
                      photoMode === "upload"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoMode("url")}
                    className={`rounded px-2 py-0.5 font-medium transition-colors ${
                      photoMode === "url"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Direct URL
                  </button>
                </div>
              </div>

              {photoMode === "upload" ? (
                <div className="mt-1.5">
                  <label
                    htmlFor="photo-file"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-emerald-500 hover:bg-muted/60"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-emerald-600" />
                        <span>Uploading to ImgBB...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="size-4 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          {uploadFileName ? uploadFileName : "Select an image file"}
                        </span>
                      </>
                    )}
                    <input
                      id="photo-file"
                      type="file"
                      accept="image/*"
                      disabled={isUploadingPhoto}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <LinkIcon className="size-4" />
                  </div>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="block w-full rounded-lg border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              )}

              {/* Photo Preview Thumbnail */}
              {photoUrl && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-1.5">
                  <img
                    src={photoUrl}
                    alt="Photo preview"
                    className="size-8 rounded-full object-cover border border-emerald-500"
                  />
                  <span className="truncate text-xs text-muted-foreground flex-1">
                    {photoUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl("");
                      setUploadFileName("");
                    }}
                    className="text-xs text-red-500 hover:text-red-700 px-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="size-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-input bg-background py-2.5 pr-10 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {/* Password Requirement Badges */}
              <div className="mt-2.5 space-y-1.5 rounded-lg border border-border/80 bg-muted/30 p-2.5 text-xs">
                <p className="font-semibold text-muted-foreground">Password Requirements:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px]">
                  <div
                    className={`flex items-center gap-1 ${
                      hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {hasMinLength ? (
                      <CheckCircle className="size-3.5" />
                    ) : (
                      <XCircle className="size-3.5 opacity-60" />
                    )}
                    <span>Min 6 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {hasUppercase ? (
                      <CheckCircle className="size-3.5" />
                    ) : (
                      <XCircle className="size-3.5 opacity-60" />
                    )}
                    <span>1 uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {hasLowercase ? (
                      <CheckCircle className="size-3.5" />
                    ) : (
                      <XCircle className="size-3.5 opacity-60" />
                    )}
                    <span>1 lowercase letter</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isUploadingPhoto}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-950/20 transition-all hover:bg-emerald-500 active:translate-y-px disabled:pointer-events-none disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register with RentForge</span>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
