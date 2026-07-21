import { useParams } from "react-router-dom";
import { useMatch, useRecordGoal } from "@/hooks/use-matches";
import { useCurrentUser } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/shadcn-ui/card";
import { Badge } from "@/lib/shadcn-ui/badge";
import { Button } from "@/lib/shadcn-ui/button";
import { Input } from "@/lib/shadcn-ui/input";
import { useState } from "react";
import { Trophy, Swords } from "lucide-react";

export function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading } = useMatch(id!);
  const { data: user } = useCurrentUser();
  const recordGoal = useRecordGoal(id!);
  const [minute, setMinute] = useState("");

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (!match) return <div className="py-12 text-center text-muted-foreground">Match not found</div>;

  const handleRecordGoal = async (teamId: string) => {
    if (!minute) return;
    try {
      await recordGoal.mutateAsync({ teamId, playerId: "", minute: parseInt(minute) });
      setMinute("");
    } catch {}
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 text-center">
            {match.status === "LIVE" ? (
              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
            ) : (
              <Badge variant="secondary">{match.status}</Badge>
            )}
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-bold mx-auto">
                {match.homeTeam?.shortName || match.homeTeamId?.slice(0, 2)}
              </div>
              <p className="font-semibold">{match.homeTeam?.name || match.homeTeamId}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold tabular-nums">
                {match.homeScore ?? 0} : {match.awayScore ?? 0}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(match.kickoff).toLocaleDateString("en-GB", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-bold mx-auto">
                {match.awayTeam?.shortName || match.awayTeamId?.slice(0, 2)}
              </div>
              <p className="font-semibold">{match.awayTeam?.name || match.awayTeamId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {match.events && match.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5" /> Match Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {match.events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 text-sm">
                  <Badge variant="outline" className="w-12 justify-center">{event.minute}'</Badge>
                  <span>{event.player?.name || event.playerId}</span>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {user?.isAdmin && match.status === "LIVE" && (
        <Card>
          <CardHeader>
            <CardTitle>Record Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Minute"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="w-24"
              />
              <Button onClick={() => handleRecordGoal(match.homeTeamId)} variant="outline">
                {match.homeTeam?.name || "Home"} Goal
              </Button>
              <Button onClick={() => handleRecordGoal(match.awayTeamId)} variant="outline">
                {match.awayTeam?.name || "Away"} Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
