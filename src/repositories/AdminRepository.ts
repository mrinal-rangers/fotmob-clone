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

  async findAll(): Promise<Admin[]> {
    return this.prisma.admin.findMany();
  }

  async update(id: string, data: Prisma.AdminUpdateInput): Promise<Admin> {
    return this.prisma.admin.update({ where: { id }, data });
  }
}
