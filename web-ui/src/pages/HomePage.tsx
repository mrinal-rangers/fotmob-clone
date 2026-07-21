import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { Button } from "@/lib/shadcn-ui/button";
import { MatchCard, MatchCardSkeleton } from "@/components/shared/MatchCard";
import { DateNavBar, DateNavBarSkeleton } from "@/components/shared/DateNavBar";
import { StandingsTable } from "@/components/shared/StandingsTable";
import { UnavailableCard, Skeleton } from "@/components/shared/ErrorStates";
import { useSignedIn } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-user";
import { fetchLeagues, fetchMatches } from "@/lib/api";
import { useState } from "react";
import { getDateArr } from "@/lib/utils";
import { Trophy, Newspaper, ArrowRight } from "lucide-react";

export function HomePage() {
  const isSignedIn = useSignedIn();
  const { data: user } = useCurrentUser();
  const { data: leagues, isLoading: leaguesLoading } = useQuery({ queryKey: ["leagues"], queryFn: fetchLeagues });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const dates = getDateArr(5);
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches", selectedDate],
    queryFn: () => fetchMatches(),
  });

  const topMatches = matches?.slice(0, 8) || [];
  const topLeagues = leagues?.slice(0, 8) || [];

  return (
    <div className="space-y-8">
      {isSignedIn && user && (
        <div className="rounded-lg bg-accent/50 p-4">
          <h2 className="text-lg font-semibold">Welcome back, {user.name}</h2>
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Matches</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/matches">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        {matchesLoading ? <DateNavBarSkeleton /> : <DateNavBar dates={dates} selected={selectedDate} onSelect={setSelectedDate} />}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matchesLoading
            ? Array.from({ length: 8 }).map((_, i) => <MatchCardSkeleton key={i} />)
            : topMatches.length === 0
              ? <div className="col-span-full"><UnavailableCard message="No matches on this date" icon="empty" /></div>
              : topMatches.map((m: any) => <MatchCard key={m.id} match={m} />)}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Leagues</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/leagues">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leaguesLoading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)
            : topLeagues.map((l: any) => (
                <Link key={l.id} to={`/leagues/${l.id}/overview`}>
                  <Card className="transition-colors hover:bg-accent/50 h-full">
                    <CardContent className="flex items-center gap-3 p-4">
                      <Trophy className="h-8 w-8 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{l.name}</p>
                        <p className="text-xs text-muted-foreground">{l.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">News</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/news">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <Link to="/news">
          <Card className="transition-colors hover:bg-accent/50">
            <CardContent className="flex items-center gap-4 p-6">
              <Newspaper className="h-10 w-10 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">Football News</p>
                <p className="text-sm text-muted-foreground">Latest headlines, rumors, and analysis</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>
    </div>
  );
}
