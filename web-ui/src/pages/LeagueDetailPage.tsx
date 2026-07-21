import { useParams, Link } from "react-router-dom";
import { useLeague } from "@/hooks/use-leagues";
import { useTeams } from "@/hooks/use-teams";
import { useMatches } from "@/hooks/use-matches";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/shadcn-ui/tabs";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { Badge } from "@/lib/shadcn-ui/badge";
import { ScrollArea } from "@/lib/shadcn-ui/scroll-area";

export function LeagueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: league, isLoading: loadingLeague } = useLeague(id!);
  const { data: teams } = useTeams(id);
  const { data: matches } = useMatches(id);

  if (loadingLeague) {
    return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (!league) return <div className="py-12 text-center text-muted-foreground">League not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold">
          {league.name[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{league.name}</h1>
          <p className="text-muted-foreground">{league.country}</p>
        </div>
      </div>

      <Tabs defaultValue="matches">
        <TabsList>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4">
          {matches?.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No matches</p>
          ) : (
            matches?.map((match) => (
              <Link key={match.id} to={`/matches/${match.id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <span className="flex-1 truncate text-right font-medium">
                      {match.homeTeam?.name || match.homeTeamId}
                    </span>
                    <div className="mx-4 text-center">
                      <span className="text-lg font-bold tabular-nums">
                        {match.homeScore ?? "-"}:{match.awayScore ?? "-"}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {match.status === "LIVE" ? (
                          <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                        ) : (
                          match.status
                        )}
                      </div>
                    </div>
                    <span className="flex-1 truncate font-medium">
                      {match.awayTeam?.name || match.awayTeamId}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="teams">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams?.map((team) => (
              <Link key={team.id} to={`/teams/${team.id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      {team.shortName}
                    </div>
                    <span className="font-medium">{team.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
