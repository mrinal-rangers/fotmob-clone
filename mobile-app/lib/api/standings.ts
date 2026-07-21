import api from "./client";

function transformStanding(standing: any) {
  return {
    rank: standing.position,
    team: {
      id: parseInt(standing.team?.id?.replace(/-/g, "").slice(0, 9), 16) || 0,
      name: standing.team?.name || "",
      logo: standing.team?.logoUrl || "",
      winner: standing.position === 1,
    },
    points: standing.points,
    goalsDiff: standing.goalDifference,
    group: "",
    form: standing.form || null,
    status: standing.position <= 4 ? "same" : "same",
    description: null,
    all: {
      played: standing.played,
      win: standing.wins,
      draw: standing.draws,
      lose: standing.losses,
      goals: { for: standing.goalsFor, against: standing.goalsAgainst },
    },
    home: { played: 0, win: 0, draw: 0, lose: 0, goals: { for: 0, against: 0 } },
    away: { played: 0, win: 0, draw: 0, lose: 0, goals: { for: 0, against: 0 } },
    update: new Date().toISOString(),
  };
}

export const fetchStandings = async (leagueId: string, _season: string) => {
  const { data: standings } = await api.get(`/leagues/${leagueId}/standings`);
  return {
    response: [{
      league: {
        id: parseInt(leagueId.replace(/-/g, "").slice(0, 9), 16) || 0,
        name: "",
        country: "",
        logo: "",
        flag: "",
        season: parseInt(_season) || 2025,
        standings: [standings.map(transformStanding)],
      },
    }],
  };
};
