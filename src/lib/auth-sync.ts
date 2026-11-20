import { axiosPublic, getApiBaseUrl } from "./axiosSecure";

export interface SyncUserData {
  name?: string;
  email: string;
  image?: string;
  role?: string;
}

/**
 * On login/register success or session detection (Email/Password or Google Social Login):
 * 1. Syncs user profile to backend POST /api/users with { name, email, image }
 * 2. Fetches JWT token from backend POST /api/jwt
 * 3. Saves token to localStorage ('token' and 'access-token')
 */
export async function syncUserAndFetchJwt(
  userData: SyncUserData
): Promise<string | null> {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl =
    envUrl && envUrl.trim().length > 0
      ? envUrl.trim().replace(/\/+$/, "")
      : getApiBaseUrl();

  // 1. Sync user to backend POST /api/users with { name, email, image }
  try {
    await axiosPublic.post(`${apiUrl}/api/users`, {
      name: userData.name || userData.email.split("@")[0],
      email: userData.email.trim(),
      image: userData.image || "",
    });
  } catch (error) {
    console.warn("Backend /api/users sync warning:", error);
  }

  // 2. Fetch JWT from backend POST /api/jwt
  try {
    const jwtRes = await axiosPublic.post(`${apiUrl}/api/jwt`, {
      email: userData.email.trim(),
    });

    const token = jwtRes.data?.token || jwtRes.data?.data?.token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("access-token", token);
      return token;
    }
  } catch (error) {
    console.warn("Backend /api/jwt fetch warning:", error);
  }

  return null;
}
