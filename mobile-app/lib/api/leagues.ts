import api from "./client";

function transformLeague(league: any) {
  return {
    league: {
      id: parseInt(league.id.replace(/-/g, "").slice(0, 9), 16) || Math.floor(Math.random() * 1000000),
      name: league.name,
      type: league.type || "League",
      logo: league.logoUrl || "",
    },
    country: {
      name: league.country,
      code: league.country?.slice(0, 3).toUpperCase() || "",
      flag: league.logoUrl || "",
    },
    seasons: [{
      year: parseInt(league.season?.split("/")[0]) || 2025,
      start: `${league.season || "2025"}-08-01`,
      end: `${parseInt(league.season?.split("/")[0] || "2025") + 1}-05-31`,
      current: true,
      coverage: { fixtures: { events: true, lineups: true, statistics_fixtures: true, statistics_players: true }, standings: true, players: true, top_scorers: true, top_assists: true, top_cards: true, injuries: true, predictions: true, odds: true },
    }],
  };
}

export const fetchLeagueByLeagueId = async (leagueId: string) => {
  const { data: league } = await api.get(`/leagues/${leagueId}`);
  return { response: [transformLeague(league)] };
};

export const fetchLeagueByTeamId = async (teamId: string) => {
  const { data: leagues } = await api.get("/leagues");
  return { response: leagues.map(transformLeague) };
};
