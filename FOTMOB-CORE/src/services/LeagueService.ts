import { LeagueRepository } from "../repositories/LeagueRepository";
import { StandingRepository } from "../repositories/StandingRepository";
import { slugify } from "../utils/slugify";

export class LeagueService {
  private leagueRepo = new LeagueRepository();
  private standingRepo = new StandingRepository();

  async createLeague(data: {
    name: string;
    logoUrl?: string;
    country: string;
    type: "LEAGUE" | "CUP";
    season: string;
  }) {
    const slug = slugify(data.name);
    return this.leagueRepo.create({ ...data, slug });
  }

  async getLeague(id: string) {
    return this.leagueRepo.findById(id);
  }

  async listLeagues() {
    return this.leagueRepo.findAll();
  }

  async getStandings(leagueId: string) {
    return this.standingRepo.findByLeague(leagueId);
  }
}
