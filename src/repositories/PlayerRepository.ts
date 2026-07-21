import { BaseRepository } from "./BaseRepository";
import { Player, Prisma } from "@prisma/client";

export class PlayerRepository extends BaseRepository {
  async create(data: Prisma.PlayerCreateInput): Promise<Player> {
    return this.prisma.player.create({ data });
  }

  async findById(id: string): Promise<Player | null> {
    return this.prisma.player.findUnique({
      where: { id },
      include: { team: true, playerStats: { include: { league: true } } },
    });
  }

  async findBySlug(slug: string): Promise<Player | null> {
    return this.prisma.player.findUnique({
      where: { slug },
      include: { team: true, playerStats: { include: { league: true } } },
    });
  }

  async findAll(): Promise<Player[]> {
    return this.prisma.player.findMany({ orderBy: { name: "asc" } });
  }

  async findByTeam(teamId: string): Promise<Player[]> {
    return this.prisma.player.findMany({
      where: { teamId },
      orderBy: { shirtNumber: "asc" },
    });
  }

  async update(id: string, data: Prisma.PlayerUpdateInput): Promise<Player> {
    return this.prisma.player.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Player> {
    return this.prisma.player.delete({ where: { id } });
  }

  async search(query: string): Promise<Player[]> {
    return this.prisma.player.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      include: { team: true },
      take: 10,
    });
  }
}
