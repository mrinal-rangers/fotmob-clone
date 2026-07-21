import { useParams, Link } from "react-router-dom";
import { useTeam } from "@/hooks/use-teams";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/shadcn-ui/card";
import { Badge } from "@/lib/shadcn-ui/badge";
import { ArrowLeft } from "lucide-react";

const positionOrder: Record<string, number> = {
  Goalkeeper: 0, Defender: 1, Midfielder: 2, Forward: 3,
};

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: team, isLoading } = useTeam(id!);

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (!team) return <div className="py-12 text-center text-muted-foreground">Team not found</div>;

  const sortedPlayers = [...(team.players || [])].sort(
    (a, b) => (positionOrder[a.position] ?? 99) - (positionOrder[b.position] ?? 99),
  );

  return (
    <div className="space-y-6">
      <Link to={`/leagues/${team.leagueId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to league
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold">
          {team.shortName}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">{team.players?.length || 0} players</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Squad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {sortedPlayers.map((player) => (
              <div key={player.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {player.number && (
                    <span className="w-8 text-center text-sm text-muted-foreground">{player.number}</span>
                  )}
                  <span className="font-medium">{player.name}</span>
                </div>
                <Badge variant="secondary">{player.position}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
