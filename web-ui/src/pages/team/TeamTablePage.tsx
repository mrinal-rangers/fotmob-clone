import { useParams } from "react-router-dom";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function TeamTablePage() {
  const { id } = useParams<{ id: string }>();
  return <UnavailableCard message="Team standings view coming soon" />;
}
