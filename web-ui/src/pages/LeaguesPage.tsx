import { useState } from "react";
import { Link } from "react-router-dom";
import { useLeagues } from "@/hooks/use-leagues";
import { Input } from "@/lib/shadcn-ui/input";
import { Card, CardContent, CardTitle } from "@/lib/shadcn-ui/card";
import { Search } from "lucide-react";

export function LeaguesPage() {
  const { data: leagues, isLoading } = useLeagues();
  const [search, setSearch] = useState("");

  const filtered = leagues?.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.country.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Leagues</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search leagues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((league) => (
            <Link key={league.id} to={`/leagues/${league.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold">
                    {league.name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-base">{league.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{league.country}</p>
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
