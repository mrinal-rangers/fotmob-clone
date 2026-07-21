import { PlayerRepository } from "../repositories/PlayerRepository";
import { TeamRepository } from "../repositories/TeamRepository";
import { LeagueRepository } from "../repositories/LeagueRepository";

export class SearchService {
  private playerRepo = new PlayerRepository();
  private teamRepo = new TeamRepository();
  private leagueRepo = new LeagueRepository();

  async search(query: string, type?: "players" | "teams" | "leagues") {
    const results: any = {};

    if (!type || type === "players") {
      results.players = await this.playerRepo.search(query);
    }
    if (!type || type === "teams") {
      results.teams = await this.teamRepo.search(query);
    }
    if (!type || type === "leagues") {
      results.leagues = await this.leagueRepo.search(query);
    }

    return results;
  }
}
