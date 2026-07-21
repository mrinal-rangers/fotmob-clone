import { Link } from "react-router-dom";
import { cn, getFormColor } from "@/lib/utils";
import type { Standing } from "@/types/api";

interface StandingsTableProps {
  data: Standing[];
  teamId?: string;
  compact?: boolean;
  showForm?: boolean;
}

export function StandingsTable({ data, teamId, compact, showForm = true }: StandingsTableProps) {
  const sorted = [...data].sort((a, b) => a.position - b.position);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground text-xs uppercase">
            <th className="px-2 py-2 text-left w-8">#</th>
            <th className="px-2 py-2 text-left">Team</th>
            <th className="px-2 py-2 text-center w-8">P</th>
            {!compact && (
              <>
                <th className="px-2 py-2 text-center w-8">W</th>
                <th className="px-2 py-2 text-center w-8">D</th>
                <th className="px-2 py-2 text-center w-8">L</th>
                <th className="px-2 py-2 text-center w-8">GF</th>
                <th className="px-2 py-2 text-center w-8">GA</th>
                <th className="px-2 py-2 text-center w-8">GD</th>
              </>
            )}
            <th className="px-2 py-2 text-center w-10 font-bold">Pts</th>
            {showForm && !compact && <th className="px-2 py-2 text-center">Form</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => {
            const isHighlighted = teamId && s.teamId === teamId;
            return (
              <tr
                key={s.id}
                className={cn(
                  "border-b hover:bg-accent/50 transition-colors",
                  isHighlighted && "bg-accent font-semibold",
                )}
              >
                <td className="px-2 py-2.5 text-center text-xs">{s.position}</td>
                <td className="px-2 py-2.5">
                  <Link to={`/teams/${s.teamId}/overview`} className="flex items-center gap-2 hover:underline">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                      {s.team?.shortName?.[0] || s.team?.name?.[0]}
                    </div>
                    <span className="truncate">{s.team?.name || s.teamId}</span>
                  </Link>
                </td>
                <td className="px-2 py-2.5 text-center">{s.played}</td>
                {!compact && (
                  <>
                    <td className="px-2 py-2.5 text-center text-muted-foreground">{s.won}</td>
                    <td className="px-2 py-2.5 text-center text-muted-foreground">{s.drawn}</td>
                    <td className="px-2 py-2.5 text-center text-muted-foreground">{s.lost}</td>
                    <td className="px-2 py-2.5 text-center text-muted-foreground">{s.goalsFor}</td>
                    <td className="px-2 py-2.5 text-center text-muted-foreground">{s.goalsAgainst}</td>
                    <td className={cn("px-2 py-2.5 text-center", s.goalDifference > 0 ? "text-green-600" : s.goalDifference < 0 ? "text-red-600" : "")}>
                      {s.goalDifference > 0 ? "+" : ""}{s.goalDifference}
                    </td>
                  </>
                )}
                <td className="px-2 py-2.5 text-center font-bold">{s.points}</td>
                {showForm && !compact && (
                  <td className="px-2 py-2.5">
                    {s.form && (
                      <div className="flex gap-0.5 justify-center">
                        {s.form.split("").map((r, i) => (
                          <span key={i} className={cn("inline-block h-3.5 w-3.5 rounded-[2px] text-[8px] text-white flex items-center justify-center font-bold", getFormColor(r))}>
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function StandingsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 h-10">
          <div className="h-4 w-6 rounded bg-muted animate-pulse" />
          <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
          {Array.from({ length: 8 }).map((_, j) => (
            <div key={j} className="h-4 w-8 rounded bg-muted animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}
