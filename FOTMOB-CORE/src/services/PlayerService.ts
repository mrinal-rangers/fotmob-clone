import { PlayerRepository } from "../repositories/PlayerRepository";
import { PlayerStatsRepository } from "../repositories/PlayerStatsRepository";
import { slugify } from "../utils/slugify";
import { PlayerPosition } from "@prisma/client";

export class PlayerService {
  private playerRepo = new PlayerRepository();
  private playerStatsRepo = new PlayerStatsRepository();

  async createPlayer(data: {
    name: string;
    position: PlayerPosition;
    nationality?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
    shirtNumber?: number;
    photoUrl?: string;
    teamId?: string;
  }) {
    const slug = slugify(data.name);
    const createData: any = { ...data, slug };
    if (data.dateOfBirth) createData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.teamId) {
      createData.team = { connect: { id: data.teamId } };
      delete createData.teamId;
    }
    return this.playerRepo.create(createData);
  }

  async getPlayer(id: string) {
    return this.playerRepo.findById(id);
  }

  async listPlayers() {
    return this.playerRepo.findAll();
  }

  async getPlayerStats(playerId: string, leagueId?: string) {
    const stats = await this.playerStatsRepo.findByPlayer(playerId);
    if (leagueId) return stats.filter((s) => s.leagueId === leagueId);
    return stats;
  }

  async getTopScorers(leagueId: string, limit?: number) {
    return this.playerStatsRepo.findTopScorers(leagueId, limit);
  }

  async getTopAssisters(leagueId: string, limit?: number) {
    return this.playerStatsRepo.findTopAssisters(leagueId, limit);
  }
}
