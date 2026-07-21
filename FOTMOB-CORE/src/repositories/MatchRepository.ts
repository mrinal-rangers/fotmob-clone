import { BaseRepository } from "./BaseRepository";
import { Match, Prisma } from "@prisma/client";

export class MatchRepository extends BaseRepository {
  async create(data: Prisma.MatchCreateInput): Promise<Match> {
    return this.prisma.match.create({ data });
  }

  async findById(id: string): Promise<Match | null> {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        events: {
          include: { player: true, assistPlayer: true, team: true },
          orderBy: { minute: "asc" },
        },
      },
    });
  }

  async findAll(filters?: {
    leagueId?: string;
    teamId?: string;
    status?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Match[]> {
    const where: Prisma.MatchWhereInput = {};
    if (filters?.leagueId) where.leagueId = filters.leagueId;
    if (filters?.status) where.status = filters.status as any;
    if (filters?.teamId) {
      where.OR = [{ homeTeamId: filters.teamId }, { awayTeamId: filters.teamId }];
    }
    if (filters?.fromDate || filters?.toDate) {
      where.date = {};
      if (filters.fromDate) where.date.gte = filters.fromDate;
      if (filters.toDate) where.date.lte = filters.toDate;
    }
    return this.prisma.match.findMany({
      where,
      include: { homeTeam: true, awayTeam: true, league: true },
      orderBy: { date: "desc" },
    });
  }

  async findLive(): Promise<Match[]> {
    return this.prisma.match.findMany({
      where: { status: "LIVE" },
      include: { homeTeam: true, awayTeam: true, league: true },
      orderBy: { date: "desc" },
    });
  }

  async update(id: string, data: Prisma.MatchUpdateInput): Promise<Match> {
    return this.prisma.match.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Match> {
    return this.prisma.match.delete({ where: { id } });
  }
}
