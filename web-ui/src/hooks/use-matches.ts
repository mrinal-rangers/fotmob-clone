import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMatches, fetchMatch, recordGoal } from "@/lib/api";

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

export function useRecordGoal(matchId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (event: { teamId: string; playerId: string; minute: number }) => recordGoal(matchId, event),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["match", matchId] });
    },
  });
}
