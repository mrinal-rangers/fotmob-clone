import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const token = await getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/auth/me", { headers });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: false,
  });
}
