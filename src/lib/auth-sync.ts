import axios from "axios";

export interface SyncUserData {
  name?: string;
  email: string;
  image?: string;
  role?: string;
}

/**
 * On login/register success:
 * 1. Syncs user profile to backend POST /api/users
 * 2. Fetches JWT token from backend POST /api/jwt
 * 3. Saves token to localStorage ('token' and 'access-token')
 */
export async function syncUserAndFetchJwt(
  userData: SyncUserData
): Promise<string | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 1. Sync user to backend POST /api/users
  try {
    await axios.post(`${apiUrl}/api/users`, {
      name: userData.name || userData.email.split("@")[0],
      email: userData.email,
      image: userData.image || "",
      role: userData.role || "customer",
    });
  } catch (error) {
    console.warn("Backend /api/users sync warning:", error);
  }

  // 2. Fetch JWT from backend POST /api/jwt
  try {
    const jwtRes = await axios.post(`${apiUrl}/api/jwt`, {
      email: userData.email,
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
