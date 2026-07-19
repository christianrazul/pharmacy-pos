import { cookies } from "next/headers";

export async function apiRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const headers = new Headers(init.headers);

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  return fetch(new URL(path, requiredApiUrl()), {
    ...init,
    headers,
    cache: "no-store",
  });
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
