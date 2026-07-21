import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { Skeleton, UnavailableCard, PageError } from "@/components/shared/ErrorStates";
import { Calendar, Flag, Ruler, Weight } from "lucide-react";

export function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading, error } = useQuery({
    queryKey: ["player", id],
    queryFn: async () => {
      const res = await fetch(`/api/players/${id}`);
      if (!res.ok) throw new Error("Player not found");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) return <PageError title="Player Not Found" description="This player could not be loaded." />;
  if (!player) return <PageError title="Player Not Found" />;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-3xl font-bold">
            {player.name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{player.name}</h1>
            <p className="text-muted-foreground">{player.position}</p>
            {player.team && <p className="text-sm text-muted-foreground">{player.team.name}</p>}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {player.nationality && (
            <div className="flex items-center gap-2 text-sm">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <span>{player.nationality}</span>
            </div>
          )}
          {player.age && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{player.age} years</span>
            </div>
          )}
          {player.height && (
            <div className="flex items-center gap-2 text-sm">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span>{player.height} cm</span>
            </div>
          )}
          {player.number && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">#</span>
              <span>{player.number}</span>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Season Statistics</h3>
          <UnavailableCard message="Player stats coming soon" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Recent Matches</h3>
          <UnavailableCard message="Recent matches coming soon" />
        </CardContent>
      </Card>
    </div>
  );
}
