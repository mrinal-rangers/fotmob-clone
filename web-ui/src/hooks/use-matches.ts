import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMatches, fetchMatch } from "@/lib/api";

export function useMatches(leagueId?: string) {
  return useQuery({
    queryKey: ["matches", leagueId],
    queryFn: () => fetchMatches(leagueId),
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ["match", id],
    queryFn: () => fetchMatch(id),
    enabled: !!id,
  });
}
