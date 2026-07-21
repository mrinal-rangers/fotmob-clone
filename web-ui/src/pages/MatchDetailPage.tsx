import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Match } from "../types";

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { admin } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchMatch(id).then(setMatch);
  }, [id]);

  async function fetchMatch(matchId: string) {
    const token = localStorage.getItem("auth");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${JSON.parse(token).token}`;
    const res = await fetch(`http://localhost:4001/api/matches/${matchId}`, { headers });
    if (res.ok) return res.json();
    return null;
  }

  if (!match) return <div>Loading...</div>;

  return (
    <div>
      <h2>Match Detail</h2>
      <p>
        {match.homeTeam?.name || match.homeTeamId} vs {match.awayTeam?.name || match.awayTeamId}
      </p>
      <p>
        Score: {match.homeScore ?? 0}-{match.awayScore ?? 0} ({match.status})
      </p>

      {admin && (
        <div>
          <h3>Record Goal</h3>
          <p>Home team player buttons and away team player buttons would go here</p>
          <p>Ready</p>
        </div>
      )}
    </div>
  );
}
