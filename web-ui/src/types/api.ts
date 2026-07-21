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
  country?: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number?: number;
  teamId: string;
  nationality?: string;
  age?: number;
  height?: number;
  preferredFoot?: string;
  photoUrl?: string;
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
  league?: League;
  round?: string;
  stadium?: string;
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
  homeScore?: number;
  awayScore?: number;
  assistPlayerId?: string;
  assistPlayerName?: string;
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

export interface LeagueDetail extends League {
  seasons?: string[];
  currentSeason?: string;
}

export interface PlayerDetail extends Player {
  team?: Team;
  nationality?: string;
  age?: number;
  height?: number;
  preferredFoot?: string;
  photoUrl?: string;
  birthDate?: string;
  positionDescription?: string;
  recentMatches?: PlayerMatchPerformance[];
  stats?: PlayerSeasonStats;
}

export interface PlayerMatchPerformance {
  matchId: string;
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  rating?: number;
  competition?: string;
}

export interface PlayerSeasonStats {
  appearances: number;
  goals: number;
  assists: number;
  minutes: number;
  rating?: number;
  cleanSheets?: number;
  saves?: number;
  tackles?: number;
  passes?: number;
  keyPasses?: number;
  dribbles?: number;
}
