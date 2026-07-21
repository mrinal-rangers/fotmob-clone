import { BaseRepository } from "./BaseRepository";
import { User, Prisma } from "@prisma/client";

export class UserRepository extends BaseRepository {
  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { clerkId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async upsert(clerkId: string, data: Prisma.UserCreateInput): Promise<User> {
    const existing = await this.findByClerkId(clerkId);
    if (existing) {
      return this.update(existing.id, data);
    }
    return this.create(data);
  }
}
