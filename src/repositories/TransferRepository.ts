import { BaseRepository } from "./BaseRepository";
import { Transfer, Prisma } from "@prisma/client";

export class TransferRepository extends BaseRepository {
  async create(data: Prisma.TransferCreateInput): Promise<Transfer> {
    return this.prisma.transfer.create({ data });
  }

  async findById(id: string): Promise<Transfer | null> {
    return this.prisma.transfer.findUnique({
      where: { id },
      include: { player: true, fromTeam: true, toTeam: true },
    });
  }

  async findAll(filters?: { teamId?: string; playerId?: string }): Promise<Transfer[]> {
    const where: Prisma.TransferWhereInput = {};
    if (filters?.teamId) {
      where.OR = [{ fromTeamId: filters.teamId }, { toTeamId: filters.teamId }];
    }
    if (filters?.playerId) where.playerId = filters.playerId;
    return this.prisma.transfer.findMany({
      where,
      include: { player: true, fromTeam: true, toTeam: true },
      orderBy: { date: "desc" },
    });
  }

  async update(id: string, data: Prisma.TransferUpdateInput): Promise<Transfer> {
    return this.prisma.transfer.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Transfer> {
    return this.prisma.transfer.delete({ where: { id } });
  }
}
