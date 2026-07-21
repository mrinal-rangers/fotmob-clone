import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLeagues } from "../api";
import type { League } from "../types";

export default function DashboardPage() {
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    fetchLeagues().then(setLeagues).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Leagues</h2>
      <ul>
        {leagues.map((l) => (
          <li key={l.id}>
            <Link to={`/leagues/${l.id}`}>{l.name}</Link> — {l.country}
          </li>
        ))}
      </ul>
    </div>
  );
}
