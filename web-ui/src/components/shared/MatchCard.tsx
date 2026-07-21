import { Link } from "react-router-dom";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { Badge } from "@/lib/shadcn-ui/badge";
import { cn, getStatusBadge } from "@/lib/utils";
import type { Match } from "@/types/api";

export function MatchCard({ match, compact }: { match: Match; compact?: boolean }) {
  const badge = getStatusBadge(match.status);
  const isLive = match.status === "LIVE" || match.status === "HT";
  const isFinished = match.status === "FT" || match.status === "AET" || match.status === "PEN";

  return (
    <Link to={`/matches/${match.id}`}>
      <Card className={cn("transition-colors hover:bg-accent/50", compact && "py-0")}>
        <CardContent className={cn("p-3", compact ? "flex items-center gap-2" : "p-4")}>
          {!compact && (
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              {isLive ? (
                <Badge variant="destructive" className="animate-pulse text-[10px] px-1.5 py-0">LIVE</Badge>
              ) : isFinished ? (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">FT</Badge>
              ) : (
                <span>{new Date(match.kickoff).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
              )}
              {match.round && <span className="text-muted-foreground">{match.round}</span>}
            </div>
          )}
          <div className={cn("flex items-center gap-2", compact ? "justify-between" : "justify-between")}>
            <span className={cn("flex-1 truncate font-medium", compact ? "text-right text-sm" : "text-right")}>
              {match.homeTeam?.shortName || match.homeTeam?.name || match.homeTeamId}
            </span>
            <span className={cn("font-bold tabular-nums", compact ? "text-sm" : "text-lg", isLive && "text-red-500")}>
              {match.homeScore ?? "-"}:{match.awayScore ?? "-"}
            </span>
            <span className={cn("flex-1 truncate font-medium", compact ? "text-sm" : "")}>
              {match.awayTeam?.shortName || match.awayTeam?.name || match.awayTeamId}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function MatchCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 h-3 w-16 rounded bg-muted animate-pulse" />
        <div className="flex items-center justify-between">
          <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
          <div className="mx-4 h-6 w-12 rounded bg-muted animate-pulse" />
          <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
