import type { League, Team, Player, Match, Standing, MatchEvent, User, Follow } from "@/types/api";

const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:4001";

let getTokenFn: (() => Promise<string | null>) | null = null;

export function setTokenProvider(fn: () => Promise<string | null>) {
  getTokenFn = fn;
}

async function bffFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getTokenFn ? await getTokenFn() : null;
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

export async function fetchMe(): Promise<User> {
  return bffFetch("/auth/me");
}

export async function fetchLeagues(): Promise<League[]> {
  return bffFetch("/leagues");
}

export async function fetchLeague(id: string): Promise<League> {
  return bffFetch(`/leagues/${id}`);
}

export async function fetchTeams(leagueId?: string): Promise<Team[]> {
  const qs = leagueId ? `?leagueId=${leagueId}` : "";
  return bffFetch(`/teams${qs}`);
}

export async function fetchTeam(id: string): Promise<Team & { players: Player[] }> {
  return bffFetch(`/teams/${id}`);
}

export async function fetchMatches(leagueId?: string): Promise<Match[]> {
  const qs = leagueId ? `?leagueId=${leagueId}` : "";
  return bffFetch(`/matches${qs}`);
}

export async function fetchMatch(id: string): Promise<Match & { events?: MatchEvent[] }> {
  return bffFetch(`/matches/${id}`);
}

export async function fetchStandings(leagueId: string): Promise<Standing[]> {
  return bffFetch(`/standings/${leagueId}`);
}

export async function recordGoal(matchId: string, event: { teamId: string; playerId: string; minute: number }) {
  return bffFetch(`/matches/${matchId}/events`, {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export async function fetchFollows(): Promise<Follow[]> {
  return bffFetch("/users/me/follows");
}

export async function followEntity(entityType: string, entityId: string) {
  return bffFetch("/users/me/follows", {
    method: "POST",
    body: JSON.stringify({ entityType, entityId }),
  });
}

export async function unfollowEntity(followId: string) {
  return bffFetch(`/users/me/follows/${followId}`, { method: "DELETE" });
}

export async function updatePreferences(prefs: Partial<User>) {
  return bffFetch("/users/me/preferences", {
    method: "PATCH",
    body: JSON.stringify(prefs),
  });
}
