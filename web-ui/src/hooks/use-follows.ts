import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";

export function useFollows() {
  return useQuery({
    queryKey: ["follows"],
    queryFn: async () => {
      const token = await getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/users/me/follows", { headers });
      if (!res.ok) throw new Error("Failed to load follows");
      return res.json();
    },
  });
}

export function useFollow() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityType, entityId }: { entityType: string; entityId: string }) => {
      const token = await getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/users/me/follows", {
        method: "POST",
        headers,
        body: JSON.stringify({ entityType, entityId }),
      });
      if (!res.ok) throw new Error("Failed to follow");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["follows"] }),
  });
}

export function useUnfollow() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (followId: string) => {
      const token = await getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      await fetch(`/api/users/me/follows/${followId}`, { method: "DELETE", headers });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["follows"] }),
  });
}
