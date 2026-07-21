import { BaseRepository } from "./BaseRepository";
import { League, Prisma } from "@prisma/client";

export class LeagueRepository extends BaseRepository {
  async create(data: Prisma.LeagueCreateInput): Promise<League> {
    return this.prisma.league.create({ data });
  }

  async findById(id: string): Promise<League | null> {
    return this.prisma.league.findUnique({
      where: { id },
      include: { standings: { include: { team: true }, orderBy: { position: "asc" } } },
    });
  }

  async findBySlug(slug: string): Promise<League | null> {
    return this.prisma.league.findUnique({ where: { slug } });
  }

  async findAll(): Promise<League[]> {
    return this.prisma.league.findMany({ orderBy: { name: "asc" } });
  }

  async update(id: string, data: Prisma.LeagueUpdateInput): Promise<League> {
    return this.prisma.league.update({ where: { id }, data });
  }

  async delete(id: string): Promise<League> {
    return this.prisma.league.delete({ where: { id } });
  }

  async search(query: string): Promise<League[]> {
    return this.prisma.league.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 10,
    });
  }
}
