import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeam } from "@/lib/api";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { Skeleton, UnavailableCard } from "@/components/shared/ErrorStates";

export function TeamSquadPage() {
  const { id } = useParams<{ id: string }>();
  const { data: team, isLoading, error } = useQuery({
    queryKey: ["team", id],
    queryFn: () => fetchTeam(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  if (error || !team) return <UnavailableCard message="Squad data unavailable" />;

  const players = team.players || [];
  if (players.length === 0) return <UnavailableCard message="No squad data" icon="empty" />;

  const grouped = players.reduce<Record<string, typeof players>>((acc, p) => {
    const pos = p.position || "Other";
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([position, squad]) => (
        <section key={position}>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase">{position}</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {squad.map((p: any) => (
              <Card key={p.id} className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {p.number || "—"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
