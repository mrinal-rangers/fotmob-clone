import { BaseRepository } from "./BaseRepository";
import { Admin, Prisma } from "@prisma/client";

export class AdminRepository extends BaseRepository {
  async create(data: Prisma.AdminCreateInput): Promise<Admin> {
    return this.prisma.admin.create({ data });
  }

  async findById(id: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { googleId } });
  }

  async upsertByEmail(
    email: string,
    data: { googleId?: string; name?: string; picture?: string; role?: string }
  ): Promise<Admin> {
    const existing = await this.findByEmail(email);
    if (existing) {
      return this.prisma.admin.update({
        where: { email },
        data: {
          googleId: data.googleId || existing.googleId,
          name: data.name || existing.name,
          picture: data.picture || existing.picture,
          role: (data.role || existing.role) as any,
          passwordHash: existing.passwordHash,
        },
      });
    }
    return this.prisma.admin.create({
      data: {
        email,
        googleId: data.googleId,
        name: data.name || email,
        picture: data.picture,
        role: (data.role as any) || "ADMIN",
      },
    });
  }

  async findAll(): Promise<Admin[]> {
    return this.prisma.admin.findMany();
  }

  async update(id: string, data: Prisma.AdminUpdateInput): Promise<Admin> {
    return this.prisma.admin.update({ where: { id }, data });
  }
}
