import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  try {
    const response = await fetch(new URL("/auth/me", requiredApiUrl()), {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as CurrentUserResponse;
    return body.user;
  } catch {
    return null;
  }
}

function requiredApiUrl(): URL {
  const value = process.env.API_INTERNAL_URL?.trim();

  if (!value) {
    throw new Error("Missing required environment variable: API_INTERNAL_URL");
  }

  const url = new URL(value);

  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error("API_INTERNAL_URL must use HTTP or HTTPS");
  }

  return url;
}
