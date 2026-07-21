import { TeamRepository } from "../repositories/TeamRepository";
import { slugify } from "../utils/slugify";

export class TeamService {
  private teamRepo = new TeamRepository();

  async createTeam(data: {
    name: string;
    shortName?: string;
    logoUrl?: string;
    country?: string;
    stadium?: string;
    foundedYear?: number;
  }) {
    const slug = slugify(data.name);
    return this.teamRepo.create({ ...data, slug });
  }

  async getTeam(id: string) {
    return this.teamRepo.findById(id);
  }

  async listTeams() {
    return this.teamRepo.findAll();
  }

  async getTeamMatches(id: string) {
    const team = await this.teamRepo.findById(id);
    if (!team) return null;

    const matches = await this.teamRepo.getMatches(id);
    return matches;
  }

  async getTeamSquad(id: string) {
    const team = await this.teamRepo.findById(id);
    if (!team) return null;
    return (team as any).players as Array<{ id: string; name: string; position: string; shirtNumber: number | null }>;
  }
}
