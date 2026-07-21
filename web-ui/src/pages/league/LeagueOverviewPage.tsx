import { useLeague } from "@/hooks/use-leagues";
import { useMatches } from "@/hooks/use-matches";
import { useStandings } from "@/hooks/use-standings";
import { useParams } from "react-router-dom";
import { MatchCard, MatchCardSkeleton } from "@/components/shared/MatchCard";
import { StandingsTable, StandingsTableSkeleton } from "@/components/shared/StandingsTable";
import { UnavailableCard } from "@/components/shared/ErrorStates";

export function LeagueOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: league } = useLeague(id!);
  const { data: matches, isLoading: matchesLoading } = useMatches(id);
  const { data: standings, isLoading: standingsLoading, error: standingsError } = useStandings(id!);

  const recentMatches = matches?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent Fixtures</h2>
        {matchesLoading
          ? Array.from({ length: 5 }).map((_, i) => <MatchCardSkeleton key={i} />)
          : recentMatches.length === 0
            ? <UnavailableCard message="No recent matches" icon="empty" />
            : <div className="grid gap-3 sm:grid-cols-2">{recentMatches.map((m: any) => <MatchCard key={m.id} match={m} />)}</div>
        }
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Standings</h2>
        {standingsLoading
          ? <StandingsTableSkeleton />
          : standingsError
            ? <UnavailableCard message="Standings unavailable" />
            : standings?.length
              ? <StandingsTable data={standings} compact />
              : <UnavailableCard message="No standings data" icon="empty" />
        }
      </section>
    </div>
  );
}
