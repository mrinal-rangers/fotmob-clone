import api from "./client";

function transformTeam(team: any) {
  return {
    team: {
      id: parseInt(team.id.replace(/-/g, "").slice(0, 9), 16) || Math.floor(Math.random() * 1000000),
      name: team.name,
      code: team.shortName || team.name?.slice(0, 3).toUpperCase(),
      country: team.country || "",
      founded: team.foundedYear || 1900,
      national: false,
      logo: team.logoUrl || "",
    },
    venue: {
      id: 0,
      name: team.stadium || "Unknown",
      address: "",
      city: team.country || "",
      capacity: 0,
      surface: "",
      image: "",
    },
  };
}

export const fetchTeam = async (teamId: string) => {
  const { data: team } = await api.get(`/teams/${teamId}`);
  return { response: [transformTeam(team)] };
};

export const fetchTeamStats = async (_leagueId: string, _season: string, _teamId: string) => {
  return { response: { team: { id: 0, name: "", logo: "" }, statistics: { played: { home: 0, away: 0, total: 0 }, wins: { home: 0, away: 0, total: 0 }, draws: { home: 0, away: 0, total: 0 }, loses: { home: 0, away: 0, total: 0 }, goals: { for: { home: 0, away: 0, total: 0 }, against: { home: 0, away: 0, total: 0 } } } } };
};
