import { useParams } from "react-router-dom";
import { useMatch } from "@/hooks/use-matches";
import { Badge } from "@/lib/shadcn-ui/badge";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { UnavailableCard, Skeleton, PageError } from "@/components/shared/ErrorStates";
import { getStatusBadge } from "@/lib/utils";
import { Calendar, MapPin, Clock } from "lucide-react";

export function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, error } = useMatch(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (error) return <PageError title="Match Not Found" description="This match could not be loaded." />;
  if (!match) return <PageError title="Match Not Found" />;

  const badge = getStatusBadge(match.status);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 text-center">
        <div className="mb-2">
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
        </div>
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
              {match.homeTeam?.shortName?.[0] || "H"}
            </div>
            <p className="font-semibold text-lg">{match.homeTeam?.name || match.homeTeamId}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold tabular-nums">
              {match.homeScore ?? "-"}:{match.awayScore ?? "-"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{match.round}</p>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
              {match.awayTeam?.shortName?.[0] || "A"}
            </div>
            <p className="font-semibold text-lg">{match.awayTeam?.name || match.awayTeamId}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(match.kickoff).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(match.kickoff).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {match.stadium && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {match.stadium}
            </span>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Match Events</h3>
          <UnavailableCard message="Match events coming soon" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Lineups</h3>
          <UnavailableCard message="Lineups coming soon" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Statistics</h3>
          <UnavailableCard message="Match statistics coming soon" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Head to Head</h3>
          <UnavailableCard message="Head to head data coming soon" />
        </CardContent>
      </Card>
    </div>
  );
}
