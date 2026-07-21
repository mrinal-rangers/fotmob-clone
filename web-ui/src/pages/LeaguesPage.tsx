import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchLeagues } from "@/lib/api";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { Skeleton } from "@/components/shared/ErrorStates";
import { Trophy } from "lucide-react";

export function LeaguesPage() {
  const { data: leagues, isLoading, error } = useQuery({ queryKey: ["leagues"], queryFn: fetchLeagues });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Leagues</h1>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  if (error || !leagues) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Leagues</h1>
        <p className="text-muted-foreground">Unable to load leagues. Please try again later.</p>
      </div>
    );
  }

  const grouped = leagues.reduce<Record<string, typeof leagues>>((acc, l) => {
    const country = l.country || "Other";
    if (!acc[country]) acc[country] = [];
    acc[country].push(l);
    return acc;
  }, {});

  const sortedCountries = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Leagues</h1>
      {sortedCountries.map((country) => (
        <section key={country}>
          <h2 className="mb-3 text-lg font-semibold text-muted-foreground">{country}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[country].map((l) => (
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
      ))}
    </div>
  );
}
