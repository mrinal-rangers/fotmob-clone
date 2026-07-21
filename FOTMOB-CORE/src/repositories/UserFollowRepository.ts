import { BaseRepository } from "./BaseRepository";
import { UserFollow, FollowEntityType, Prisma } from "@prisma/client";

export class UserFollowRepository extends BaseRepository {
  async findByUser(userId: string): Promise<UserFollow[]> {
    return this.prisma.userFollow.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByUserAndType(
    userId: string,
    entityType: FollowEntityType
  ): Promise<UserFollow[]> {
    return this.prisma.userFollow.findMany({
      where: { userId, entityType },
      orderBy: { createdAt: "desc" },
    });
  }

  async findExisting(
    userId: string,
    entityType: FollowEntityType,
    entityId: string
  ): Promise<UserFollow | null> {
    return this.prisma.userFollow.findUnique({
      where: { userId_entityType_entityId: { userId, entityType, entityId } },
    });
  }

  async create(data: Prisma.UserFollowCreateInput): Promise<UserFollow> {
    return this.prisma.userFollow.create({ data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.userFollow.delete({ where: { id } });
  }

  async deleteByEntity(
    userId: string,
    entityType: FollowEntityType,
    entityId: string
  ): Promise<void> {
    await this.prisma.userFollow.delete({
      where: { userId_entityType_entityId: { userId, entityType, entityId } },
    });
  }
}
