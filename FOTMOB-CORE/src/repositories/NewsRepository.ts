import { BaseRepository } from "./BaseRepository";
import { News, Prisma } from "@prisma/client";

export class NewsRepository extends BaseRepository {
  async create(data: Prisma.NewsCreateInput): Promise<News> {
    return this.prisma.news.create({ data });
  }

  async findById(id: string): Promise<News | null> {
    return this.prisma.news.findUnique({
      where: { id },
      include: { league: true },
    });
  }

  async findBySlug(slug: string): Promise<News | null> {
    return this.prisma.news.findUnique({
      where: { slug },
      include: { league: true },
    });
  }

  async findAll(filters?: { category?: string; leagueId?: string }): Promise<News[]> {
    const where: Prisma.NewsWhereInput = {};
    if (filters?.category) where.category = filters.category as any;
    if (filters?.leagueId) where.leagueId = filters.leagueId;
    return this.prisma.news.findMany({
      where,
      include: { league: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });
  }

  async update(id: string, data: Prisma.NewsUpdateInput): Promise<News> {
    return this.prisma.news.update({ where: { id }, data });
  }

  async delete(id: string): Promise<News> {
    return this.prisma.news.delete({ where: { id } });
  }
}
