import { useState } from "react";
import { Link } from "react-router-dom";
import { useMatches } from "@/hooks/use-matches";
import { formatDate, getDateArr } from "@/lib/utils";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { Badge } from "@/lib/shadcn-ui/badge";
import { Calendar } from "lucide-react";

export function HomePage() {
  const [selectedDate, setSelectedDate] = useState(getDateArr()[6]);
  const dates = getDateArr(6);
  const { data: matches, isLoading } = useMatches();

  const filtered = matches?.filter((m) => m.kickoff?.startsWith(selectedDate)) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Matches</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedDate === date
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <Calendar className="h-12 w-12" />
          <p>No matches on this day</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((match) => (
            <Link key={match.id} to={`/matches/${match.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="p-4">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {match.status === "LIVE" ? (
                      <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                    ) : match.status === "FT" ? (
                      <Badge variant="secondary">FT</Badge>
                    ) : (
                      new Date(match.kickoff).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex-1 truncate text-right font-medium">
                      {match.homeTeam?.name || match.homeTeamId}
                    </span>
                    <span className="text-lg font-bold tabular-nums">
                      {match.homeScore ?? "-"}:{match.awayScore ?? "-"}
                    </span>
                    <span className="flex-1 truncate font-medium">
                      {match.awayTeam?.name || match.awayTeamId}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
