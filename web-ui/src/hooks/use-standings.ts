import { useQuery } from "@tanstack/react-query";

export function useStandings(leagueId: string) {
  return useQuery({
    queryKey: ["standings", leagueId],
    queryFn: async () => {
      const token = localStorage.getItem("clerk-token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`/api/standings/${leagueId}`, { headers });
      if (!res.ok) throw new Error("Standings unavailable");
      return res.json();
    },
    enabled: !!leagueId,
  });
}
