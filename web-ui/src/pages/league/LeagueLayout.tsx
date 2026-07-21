import { useState } from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLeague } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/shared/ErrorStates";
import { Trophy } from "lucide-react";

const LEAGUE_TABS = [
  { label: "Overview", path: "overview" },
  { label: "Table", path: "table" },
  { label: "Fixtures", path: "fixtures" },
  { label: "Stats", path: "stats" },
  { label: "Transfers", path: "transfers" },
  { label: "Seasons", path: "seasons" },
  { label: "News", path: "news" },
];

export function LeagueLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data: league, isLoading } = useQuery({
    queryKey: ["league", id],
    queryFn: () => fetchLeague(id!),
    enabled: !!id,
  });

  const currentTab = location.pathname.split("/").pop() || "overview";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">League Not Found</h1>
        <p className="mt-2 text-muted-foreground">This league does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold">{league.name}</h1>
          <p className="text-sm text-muted-foreground">{league.country}</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b pb-0 scrollbar-none">
        {LEAGUE_TABS.map((tab) => (
          <Link
            key={tab.path}
            to={`/leagues/${id}/${tab.path}`}
            className={cn(
              "shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              currentTab === tab.path
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
