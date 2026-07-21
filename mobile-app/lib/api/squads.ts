import api from "./client";

export const fetchSquad = async (teamId: string) => {
  const { data: team } = await api.get(`/teams/${teamId}`);
  const players = (team.players || []).map((p: any) => ({
    id: parseInt(p.id.replace(/-/g, "").slice(0, 9), 16) || Math.floor(Math.random() * 1000000),
    name: p.name,
    age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000) : 0,
    number: p.shirtNumber || null,
    position: p.position || "",
    photo: p.photoUrl || "",
  }));
  return {
    response: [{
      team: {
        id: parseInt(team.id.replace(/-/g, "").slice(0, 9), 16) || 0,
        name: team.name,
        logo: team.logoUrl || "",
      },
      players,
    }],
  };
};
