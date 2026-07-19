import { apiRequest } from "@/lib/server-api";

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string | null;
  status: "ACTIVE" | "INACTIVE";
}

interface BranchesResponse {
  branches: Branch[];
}

export async function getBranches(): Promise<Branch[] | null> {
  try {
    const response = await apiRequest("/branches");

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as BranchesResponse;
    return body.branches;
  } catch {
    return null;
  }
}
