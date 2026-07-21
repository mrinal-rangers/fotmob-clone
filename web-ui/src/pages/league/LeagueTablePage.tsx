import { useParams } from "react-router-dom";
import { useStandings } from "@/hooks/use-standings";
import { StandingsTable, StandingsTableSkeleton } from "@/components/shared/StandingsTable";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function LeagueTablePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useStandings(id!);

  if (isLoading) return <StandingsTableSkeleton />;
  if (error) return <UnavailableCard message="Standings unavailable" />;
  if (!data?.length) return <UnavailableCard message="No standings data" icon="empty" />;

  return <StandingsTable data={data} showForm />;
}
