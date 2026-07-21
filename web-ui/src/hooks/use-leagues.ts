import { useQuery } from "@tanstack/react-query";
import { fetchLeagues, fetchLeague } from "@/lib/api";

export function useLeagues() {
  return useQuery({ queryKey: ["leagues"], queryFn: fetchLeagues });
}

export function useLeague(id: string) {
  return useQuery({
    queryKey: ["league", id],
    queryFn: () => fetchLeague(id),
    enabled: !!id,
  });
}
