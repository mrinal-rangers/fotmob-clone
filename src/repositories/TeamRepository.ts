import { BaseRepository } from "./BaseRepository";
import { Team, Prisma } from "@prisma/client";

export class TeamRepository extends BaseRepository {
  async create(data: Prisma.TeamCreateInput): Promise<Team> {
    return this.prisma.team.create({ data });
  }

  async findById(id: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { id },
      include: { players: true },
    });
  }

  async findBySlug(slug: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { slug },
      include: { players: true },
    });
  }

  async findAll(): Promise<Team[]> {
    return this.prisma.team.findMany({ orderBy: { name: "asc" } });
  }

  async update(id: string, data: Prisma.TeamUpdateInput): Promise<Team> {
    return this.prisma.team.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Team> {
    return this.prisma.team.delete({ where: { id } });
  }

  async search(query: string): Promise<Team[]> {
    return this.prisma.team.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 10,
    });
  }

  async getMatches(id: string): Promise<Team> {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        homeMatches: { include: { homeTeam: true, awayTeam: true, league: true }, orderBy: { date: "desc" } },
        awayMatches: { include: { homeTeam: true, awayTeam: true, league: true }, orderBy: { date: "desc" } },
      },
    }) as unknown as Team;
  }
}
