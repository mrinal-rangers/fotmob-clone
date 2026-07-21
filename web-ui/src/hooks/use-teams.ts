import { useQuery } from "@tanstack/react-query";
import { fetchTeams, fetchTeam } from "@/lib/api";

export function useTeams(leagueId?: string) {
  return useQuery({
    queryKey: ["teams", leagueId],
    queryFn: () => fetchTeams(leagueId),
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => fetchTeam(id),
    enabled: !!id,
  });
}
