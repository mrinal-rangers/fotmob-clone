import { useParams } from "react-router-dom";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function LeagueFixturesPage() {
  const { id } = useParams<{ id: string }>();
  return <UnavailableCard message="League fixtures data coming soon" />;
}
