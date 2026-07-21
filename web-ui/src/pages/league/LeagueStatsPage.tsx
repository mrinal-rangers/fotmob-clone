import { useParams } from "react-router-dom";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function LeagueStatsPage() {
  const { id } = useParams<{ id: string }>();
  return <UnavailableCard message="League stats coming soon" />;
}
