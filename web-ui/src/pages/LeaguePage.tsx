import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLeague, fetchTeams, fetchMatches } from "../api";
import type { League, Team, Match } from "../types";

export default function LeaguePage() {
  const { id } = useParams<{ id: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchLeague(id).then(setLeague);
    fetchTeams(id).then(setTeams);
    fetchMatches(id).then(setMatches);
  }, [id]);

  if (!league) return <div>Loading...</div>;

  return (
    <div>
      <h2>{league.name}</h2>
      <p>{league.country}</p>

      <h3>Teams</h3>
      <ul>
        {teams.map((t) => (
          <li key={t.id}>
            {t.name} ({t.shortName})
          </li>
        ))}
      </ul>

      <h3>Matches</h3>
      <ul>
        {matches.map((m) => (
          <li key={m.id}>
            {m.homeTeam?.name || m.homeTeamId} vs {m.awayTeam?.name || m.awayTeamId} —{" "}
            {m.status === "LIVE" ? `${m.homeScore}-${m.awayScore}` : m.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
