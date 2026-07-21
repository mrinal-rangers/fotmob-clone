import { BFF_URL } from "./config";
import type { AuthResponse, League, Team, Player, Match } from "./types";

function getToken(): string | null {
  const stored = localStorage.getItem("auth");
  if (!stored) return null;
  try {
    return JSON.parse(stored).token;
  } catch {
    return null;
  }
}

async function bffFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BFF_URL}/api${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function googleSignIn(idToken: string): Promise<AuthResponse> {
  const res = await fetch(`${BFF_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchLeagues(): Promise<League[]> {
  return bffFetch("/leagues");
}

export async function fetchLeague(leagueId: string): Promise<League> {
  return bffFetch(`/leagues/${leagueId}`);
}

export async function fetchTeams(leagueId?: string): Promise<Team[]> {
  const qs = leagueId ? `?leagueId=${leagueId}` : "";
  return bffFetch(`/teams${qs}`);
}

export async function fetchTeam(teamId: string): Promise<Team & { players: Player[] }> {
  return bffFetch(`/teams/${teamId}`);
}

export async function fetchMatches(leagueId?: string): Promise<Match[]> {
  const qs = leagueId ? `?leagueId=${leagueId}` : "";
  return bffFetch(`/matches${qs}`);
}

export async function recordGoal(matchId: string, event: { teamId: string; playerId: string; minute: number }) {
  return bffFetch(`/matches/${matchId}/events`, {
    method: "POST",
    body: JSON.stringify(event),
  });
}
