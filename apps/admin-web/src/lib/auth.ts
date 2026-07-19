import { apiRequest } from "@/lib/server-api";

export interface CurrentUser {
  id: string;
  username: string;
  email: string | null;
  role: "CENTRAL_ADMIN";
}

interface CurrentUserResponse {
  user: CurrentUser;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await apiRequest("/auth/me");

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as CurrentUserResponse;
    return body.user;
  } catch {
    return null;
  }
}
