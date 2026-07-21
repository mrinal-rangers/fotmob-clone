import { useParams } from "react-router-dom";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function LeagueSeasonsPage() {
  const { id } = useParams<{ id: string }>();
  return <UnavailableCard message="League seasons history coming soon" />;
}
