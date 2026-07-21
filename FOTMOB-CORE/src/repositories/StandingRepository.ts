import { BaseRepository } from "./BaseRepository";
import { Standing, Prisma } from "@prisma/client";

export class StandingRepository extends BaseRepository {
  async upsert(
    leagueId: string,
    teamId: string,
    data: Prisma.StandingCreateInput
  ): Promise<Standing> {
    const { league, team, ...updateFields } = data as any;
    return this.prisma.standing.upsert({
      where: { leagueId_teamId: { leagueId, teamId } },
      update: updateFields,
      create: data as any,
    });
  }

  async findByLeague(leagueId: string): Promise<Standing[]> {
    return this.prisma.standing.findMany({
      where: { leagueId },
      include: { team: true },
      orderBy: { position: "asc" },
    });
  }

  async findByTeamAndLeague(
    teamId: string,
    leagueId: string
  ): Promise<Standing | null> {
    return this.prisma.standing.findUnique({
      where: { leagueId_teamId: { leagueId, teamId } },
    });
  }

  async recalculatePositions(leagueId: string): Promise<void> {
    const standings = await this.prisma.standing.findMany({
      where: { leagueId },
      orderBy: [{ points: "desc" }, { goalDifference: "desc" }, { goalsFor: "desc" }],
    });

    for (let i = 0; i < standings.length; i++) {
      await this.prisma.standing.update({
        where: { id: standings[i].id },
        data: { position: i + 1 },
      });
    }
  }
}
