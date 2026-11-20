import axios from "axios";

/**
 * Returns the sanitized backend API base URL without trailing slashes.
 * Ensures consistent URL formatting across development and production.
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // If in browser on production without env var, fall back to current origin for rewrite proxy
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return window.location.origin;
  }

  return "http://localhost:5000";
}

/**
 * Normalizes requests to avoid mixed content (localhost in production) and double slashes.
 */
function normalizeUrl(url: string | undefined, base: string): string {
  if (!url) return base;
  let normalized = url;

  if (normalized.startsWith("/")) {
    normalized = `${base}${normalized}`;
  } else if (normalized.startsWith("http://localhost:5000") && base !== "http://localhost:5000") {
    normalized = normalized.replace("http://localhost:5000", base);
  }

  // Collapse double slashes after protocol
  return normalized.replace(/([^:]\/)\/+/g, "$1");
}

/**
 * Public Axios instance for unauthenticated endpoints (catalog, featured, details).
 */
export const axiosPublic = axios.create({
  baseURL: getApiBaseUrl(),
});

axiosPublic.interceptors.request.use((config) => {
  const base = getApiBaseUrl();
  config.baseURL = base;
  if (config.url) {
    config.url = normalizeUrl(config.url, base);
  }
  return config;
});

/**
 * Authenticated Axios instance with JWT Authorization header.
 */
export const axiosSecure = axios.create({
  baseURL: getApiBaseUrl(),
});

axiosSecure.interceptors.request.use(
  (config) => {
    const base = getApiBaseUrl();
    config.baseURL = base;

    if (config.url) {
      config.url = normalizeUrl(config.url, base);
    }

    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosSecure;
