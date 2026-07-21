export interface AdminSession {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  token: string;
  admin: AdminSession;
}

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
