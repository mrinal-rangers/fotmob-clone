export interface League {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  leagueId: string;
  players?: Player[];
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number?: number;
  teamId: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  leagueId: string;
  kickoff: string;
  status: string;
  homeScore?: number;
  awayScore?: number;
  homeTeam?: Team;
  awayTeam?: Team;
}

export interface Standing {
  id: string;
  leagueId: string;
  teamId: string;
  team?: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
  form?: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  player?: Player;
  type: string;
  minute: number;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  theme?: string;
  language?: string;
  unitSystem?: string;
  timezone?: string;
}

export interface Follow {
  id: string;
  userId: string;
  entityType: "PLAYER" | "TEAM" | "LEAGUE" | "COUNTRY";
  entityId: string;
  entity?: Team | League | Player;
}
