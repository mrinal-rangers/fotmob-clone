import { useParams } from "react-router-dom";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function TeamFixturesPage() {
  const { id } = useParams<{ id: string }>();
  return <UnavailableCard message="Team fixtures coming soon" />;
}
