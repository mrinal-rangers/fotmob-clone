import { useQuery } from "@tanstack/react-query";

export function usePlayer(id: string) {
  return useQuery({
    queryKey: ["player", id],
    queryFn: async () => {
      const res = await fetch(`/api/players/${id}`);
      if (!res.ok) throw new Error("Player not found");
      return res.json();
    },
    enabled: !!id,
  });
}
