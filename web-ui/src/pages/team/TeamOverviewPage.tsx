import { useParams } from "react-router-dom";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function TeamOverviewPage() {
  const { id } = useParams<{ id: string }>();
  return <UnavailableCard message="Team overview coming soon" />;
}
