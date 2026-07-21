import { NewsRepository } from "../repositories/NewsRepository";
import { slugify } from "../utils/slugify";

export class NewsService {
  private newsRepo = new NewsRepository();

  async createArticle(data: {
    title: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    category?: string;
    leagueId?: string;
    publishedAt?: string;
  }) {
    const slug = slugify(data.title);
    const createData: any = { ...data, slug };
    if (data.leagueId) {
      createData.league = { connect: { id: data.leagueId } };
      delete createData.leagueId;
    }
    if (data.publishedAt) createData.publishedAt = new Date(data.publishedAt);
    return this.newsRepo.create(createData);
  }

  async getArticle(id: string) {
    return this.newsRepo.findById(id);
  }

  async listArticles(filters?: { category?: string; leagueId?: string }) {
    return this.newsRepo.findAll(filters);
  }
}
