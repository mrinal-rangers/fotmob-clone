import api from "./client";

function transformPlayer(player: any) {
  const age = player.dateOfBirth
    ? Math.floor((Date.now() - new Date(player.dateOfBirth).getTime()) / 31557600000)
    : 0;
  return {
    player: {
      id: parseInt(player.id.replace(/-/g, "").slice(0, 9), 16) || Math.floor(Math.random() * 1000000),
      name: player.name,
      firstname: player.name?.split(" ")[0] || "",
      lastname: player.name?.split(" ").slice(1).join(" ") || "",
      age,
      birth: { date: player.dateOfBirth || "", place: player.nationality || "", country: player.nationality || "" },
      nationality: player.nationality || "",
      height: player.height ? `${player.height} cm` : "",
      weight: player.weight ? `${player.weight} kg` : "",
      injured: false,
      photo: player.photoUrl || "",
    },
    statistics: [{
      team: { id: 0, name: "", logo: "" },
      league: { id: 0, name: "", country: "", logo: "", flag: null, season: 2025 },
      games: { appearences: 0, lineups: 0, minutes: 0, number: player.shirtNumber || null, position: player.position || "", rating: "", captain: false },
      substitutes: { in: 0, out: 0, bench: 0 },
      shots: { total: null, on: null },
      goals: { total: null, conceded: null, assists: null, saves: null },
      passes: { total: null, key: null, accuracy: null },
      tackles: { total: null, blocks: null, interceptions: null },
      duels: { total: null, won: null },
      dribbles: { attempts: null, success: null, past: null },
      fouls: { drawn: null, committed: null },
      cards: { yellow: null, yellowred: null, red: null },
      penalty: { won: null, commited: null, scored: null, missed: null, saved: null },
    }],
  };
}

export const fetchPlayerByPlayerId = async (playerId: string) => {
  const { data: player } = await api.get(`/players/${playerId}`);
  return { response: [transformPlayer(player)] };
};

export const fetchPlayersByTeamId = async (_season: string, teamId: string) => {
  const { data: team } = await api.get(`/teams/${teamId}`);
  return { response: (team.players || []).map(transformPlayer) };
};

export const fetchTopScorers = async (leagueId: string, _season: string) => {
  const { data: standings } = await api.get(`/leagues/${leagueId}/standings`);
  return { response: [] };
};

export const fetchTopAssists = async (_leagueId: string, _season: string) => {
  return { response: [] };
};

export const fetchTopYellowCards = async (_leagueId: string, _season: string) => {
  return { response: [] };
};

export const fetchTopRedCards = async (_leagueId: string, _season: string) => {
  return { response: [] };
};
