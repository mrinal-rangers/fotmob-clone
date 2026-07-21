import { BaseRepository } from "./BaseRepository";
import { MatchEvent, Prisma } from "@prisma/client";

export class MatchEventRepository extends BaseRepository {
  async create(data: Prisma.MatchEventCreateInput): Promise<MatchEvent> {
    return this.prisma.matchEvent.create({ data });
  }

  async findByMatch(matchId: string): Promise<MatchEvent[]> {
    return this.prisma.matchEvent.findMany({
      where: { matchId },
      include: { player: true, assistPlayer: true, team: true },
      orderBy: { minute: "asc" },
    });
  }

  async findById(id: string): Promise<MatchEvent | null> {
    return this.prisma.matchEvent.findUnique({
      where: { id },
      include: { player: true, assistPlayer: true, team: true },
    });
  }

  async update(id: string, data: Prisma.MatchEventUpdateInput): Promise<MatchEvent> {
    return this.prisma.matchEvent.update({ where: { id }, data });
  }

  async delete(id: string): Promise<MatchEvent> {
    return this.prisma.matchEvent.delete({ where: { id } });
  }
}
