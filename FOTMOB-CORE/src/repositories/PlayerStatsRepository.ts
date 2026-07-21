import { BaseRepository } from "./BaseRepository";
import { PlayerStats, Prisma } from "@prisma/client";

export class PlayerStatsRepository extends BaseRepository {
  async upsert(
    playerId: string,
    leagueId: string,
    season: string,
    data: Prisma.PlayerStatsCreateInput
  ): Promise<PlayerStats> {
    return this.prisma.playerStats.upsert({
      where: { playerId_leagueId_season: { playerId, leagueId, season } },
      update: data as any,
      create: data,
    });
  }

  async findByPlayer(playerId: string): Promise<PlayerStats[]> {
    return this.prisma.playerStats.findMany({
      where: { playerId },
      include: { league: true, team: true },
    });
  }

  async findByLeague(leagueId: string): Promise<PlayerStats[]> {
    return this.prisma.playerStats.findMany({
      where: { leagueId },
      include: { player: true, team: true },
      orderBy: { goals: "desc" },
    });
  }

  async findTopScorers(leagueId: string, limit = 10): Promise<PlayerStats[]> {
    return this.prisma.playerStats.findMany({
      where: { leagueId, goals: { gt: 0 } },
      include: { player: true, team: true },
      orderBy: { goals: "desc" },
      take: limit,
    });
  }

  async findTopAssisters(leagueId: string, limit = 10): Promise<PlayerStats[]> {
    return this.prisma.playerStats.findMany({
      where: { leagueId, assists: { gt: 0 } },
      include: { player: true, team: true },
      orderBy: { assists: "desc" },
      take: limit,
    });
  }
}
