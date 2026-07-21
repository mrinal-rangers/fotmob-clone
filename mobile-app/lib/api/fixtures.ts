import api from "./client";

function transformMatch(match: any) {
  return {
    fixture: {
      id: parseInt(match.id.replace(/-/g, "").slice(0, 9), 16) || Math.floor(Math.random() * 1000000),
      date: match.kickoff,
      timestamp: new Date(match.kickoff).getTime() / 1000,
      status: {
        long: match.status === "LIVE" ? "First Half" : match.status === "FINISHED" ? "Match Finished" : "Not Started",
        short: match.status === "LIVE" ? "1H" : match.status === "FINISHED" ? "FT" : "NS",
        elapsed: match.status === "LIVE" ? (match.minute || 0) : match.status === "FINISHED" ? 90 : null,
      },
    },
    league: match.league ? {
      id: parseInt(match.league.id.replace(/-/g, "").slice(0, 9), 16) || Math.floor(Math.random() * 1000000),
      name: match.league.name,
      country: match.league.country,
      logo: match.league.logoUrl || "",
      flag: null,
      season: parseInt(match.league.season?.split("/")[0]) || 2025,
      round: `Regular Season - ${match.round || 1}`,
    } : {
      id: 0, name: "", country: "", logo: "", flag: null, season: 2025, round: "",
    },
    teams: {
      home: {
        id: parseInt(match.homeTeam?.id?.replace(/-/g, "").slice(0, 9), 16) || 0,
        name: match.homeTeam?.name || "Home",
        logo: match.homeTeam?.logoUrl || "",
        winner: match.homeScore != null && match.awayScore != null ? match.homeScore > match.awayScore : false,
      },
      away: {
        id: parseInt(match.awayTeam?.id?.replace(/-/g, "").slice(0, 9), 16) || 0,
        name: match.awayTeam?.name || "Away",
        logo: match.awayTeam?.logoUrl || "",
        winner: match.homeScore != null && match.awayScore != null ? match.awayScore > match.homeScore : false,
      },
    },
    goals: {
      home: match.homeScore ?? null,
      away: match.awayScore ?? null,
    },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: match.homeScore ?? null, away: match.awayScore ?? null },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null },
    },
    events: [],
  };
}

export const fetchFixtures = async (date: string) => {
  const { data: matches } = await api.get("/matches");
  const dayMatches = matches.filter((m: any) =>
    new Date(m.kickoff).toISOString().slice(0, 10) === date
  );
  return { response: dayMatches.map(transformMatch) };
};

export const fetchFixtureByFixtureId = async (fixtureId: string) => {
  const { data: match } = await api.get(`/matches/${fixtureId}`);
  return { response: [transformMatch(match)] };
};

export const fetchFixturesByLeagueId = async (leagueId: string, _season: string) => {
  const { data: matches } = await api.get(`/matches?leagueId=${leagueId}`);
  return { response: matches.map(transformMatch) };
};

export const fetchFixturesByTeamId = async (_season: string, teamId: string) => {
  const { data: matches } = await api.get(`/matches?teamId=${teamId}`);
  return { response: matches.map(transformMatch) };
};

export const fetchLastFixturesByTeamId = async (teamId: string, _last: number) => {
  const { data: matches } = await api.get(`/matches?teamId=${teamId}&status=FINISHED`);
  return { response: matches.map(transformMatch) };
};

export const fetchNextFixturesByTeamId = async (teamId: string, _next: number) => {
  const { data: matches } = await api.get(`/matches?teamId=${teamId}&status=SCHEDULED`);
  return { response: matches.map(transformMatch) };
};

export const fetchFixtureStats = async (_fixtureId: string) => {
  return { response: [] };
};

export const fetchPlayerStats = async (_fixtureId: string) => {
  return { response: [] };
};
