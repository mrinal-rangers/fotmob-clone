import { useParams } from "react-router-dom";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function LeagueNewsPage() {
  const { id } = useParams<{ id: string }>();
  return <UnavailableCard message="League news coming soon" />;
}
