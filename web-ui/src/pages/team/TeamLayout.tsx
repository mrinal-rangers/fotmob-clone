import { useState } from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeam } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/shared/ErrorStates";
import { Users } from "lucide-react";

const TEAM_TABS = [
  { label: "Overview", path: "overview" },
  { label: "Squad", path: "squad" },
  { label: "Fixtures", path: "fixtures" },
  { label: "Table", path: "table" },
];

export function TeamLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data: team, isLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: () => fetchTeam(id!),
    enabled: !!id,
  });

  const currentTab = location.pathname.split("/").pop() || "overview";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Team Not Found</h1>
        <p className="mt-2 text-muted-foreground">This team does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold">
          {team.name?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-sm text-muted-foreground">{team.shortName}</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b pb-0 scrollbar-none">
        {TEAM_TABS.map((tab) => (
          <Link
            key={tab.path}
            to={`/teams/${id}/${tab.path}`}
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
