import { MatchRepository } from "../repositories/MatchRepository";
import { MatchEventRepository } from "../repositories/MatchEventRepository";
import { StandingRepository } from "../repositories/StandingRepository";
import { PlayerStatsRepository } from "../repositories/PlayerStatsRepository";
import { LeagueRepository } from "../repositories/LeagueRepository";
import { MatchStatus, EventType, Prisma } from "@prisma/client";

export class MatchService {
  private matchRepo = new MatchRepository();
  private eventRepo = new MatchEventRepository();
  private standingRepo = new StandingRepository();
  private playerStatsRepo = new PlayerStatsRepository();
  private leagueRepo = new LeagueRepository();

  async createMatch(data: {
    homeTeamId: string;
    awayTeamId: string;
    leagueId: string;
    round?: number;
    date: string;
  }) {
    return this.matchRepo.create({
      homeTeam: { connect: { id: data.homeTeamId } },
      awayTeam: { connect: { id: data.awayTeamId } },
      league: { connect: { id: data.leagueId } },
      round: data.round,
      date: new Date(data.date),
    });
  }

  async getMatch(id: string) {
    return this.matchRepo.findById(id);
  }

  async listMatches(filters?: {
    leagueId?: string;
    teamId?: string;
    status?: string;
  }) {
    return this.matchRepo.findAll(filters);
  }

  async getLiveMatches() {
    return this.matchRepo.findLive();
  }

  async updateMatchStatus(
    matchId: string,
    status: MatchStatus,
    finalHomeScore?: number,
    finalAwayScore?: number
  ) {
    const match = await this.matchRepo.findById(matchId);
    if (!match) throw new Error("Match not found");

    const updateData: any = { status };

    if (status === "FINISHED") {
      if (finalHomeScore !== undefined) updateData.homeScore = finalHomeScore;
      if (finalAwayScore !== undefined) updateData.awayScore = finalAwayScore;
      updateData.minute = 90;
    }

    if (status === "LIVE") {
      updateData.minute = 0;
    }

    const updated = await this.matchRepo.update(matchId, updateData);

    if (status === "FINISHED") {
      await this.recalculateStandings(match.leagueId);
    }

    return updated;
  }

  private async recalculateStandings(leagueId: string) {
    const league = await this.leagueRepo.findById(leagueId);
    if (!league) return;

    const season = league.season;
    const finishedMatches = await this.matchRepo.findAll({
      leagueId,
      status: "FINISHED",
    });

    const teamStats: Record<
      string,
      { played: number; wins: number; draws: number; losses: number; gf: number; ga: number; points: number }
    > = {};

    for (const match of finishedMatches) {
      if (match.homeScore === null || match.awayScore === null) continue;

      for (const teamId of [match.homeTeamId, match.awayTeamId]) {
        if (!teamStats[teamId]) {
          teamStats[teamId] = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 };
        }
      }

      const home = teamStats[match.homeTeamId];
      const away = teamStats[match.awayTeamId];

      home.played++;
      away.played++;
      home.gf += match.homeScore;
      home.ga += match.awayScore;
      away.gf += match.awayScore;
      away.ga += match.homeScore;

      if (match.homeScore > match.awayScore) {
        home.wins++;
        home.points += 3;
        away.losses++;
      } else if (match.homeScore < match.awayScore) {
        away.wins++;
        away.points += 3;
        home.losses++;
      } else {
        home.draws++;
        home.points += 1;
        away.draws++;
        away.points += 1;
      }
    }

    const sorted = Object.entries(teamStats)
      .map(([teamId, stats]) => ({
        teamId,
        ...stats,
        goalDifference: stats.gf - stats.ga,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.gf - a.gf;
      });

    for (let i = 0; i < sorted.length; i++) {
      const stats = sorted[i];
      await this.standingRepo.upsert(leagueId, stats.teamId, {
        league: { connect: { id: leagueId } },
        team: { connect: { id: stats.teamId } },
        season,
        position: i + 1,
        played: stats.played,
        wins: stats.wins,
        draws: stats.draws,
        losses: stats.losses,
        goalsFor: stats.gf,
        goalsAgainst: stats.ga,
        goalDifference: stats.goalDifference,
        points: stats.points,
      });
    }
  }

  async recordEvent(data: {
    matchId: string;
    teamId: string;
    playerId?: string;
    assistPlayerId?: string;
    type: EventType;
    minute: number;
    extraMinute?: number;
    detail?: string;
  }) {
    const match = await this.matchRepo.findById(data.matchId);
    if (!match) throw new Error("Match not found");
    if (match.status === "FINISHED") throw new Error("Match is already finished");

    const matchWithLeague = match as any;
    const leagueSeason = matchWithLeague.league?.season || "2025/2026";

    return this.matchRepo.executeTransaction(async (tx: Prisma.TransactionClient) => {
      const event = await tx.matchEvent.create({
        data: {
          matchId: data.matchId,
          teamId: data.teamId,
          playerId: data.playerId,
          assistPlayerId: data.assistPlayerId,
          type: data.type,
          minute: data.minute,
          extraMinute: data.extraMinute,
          detail: data.detail,
        },
      });

      const isGoal =
        data.type === "GOAL" ||
        data.type === "OWN_GOAL" ||
        data.type === "PENALTY";

      if (isGoal) {
        const isOwnGoal = data.type === "OWN_GOAL";
        const isHomeTeam = match.homeTeamId === data.teamId;

        const scoreUpdate: any = { status: "LIVE", minute: data.minute };

        if (isHomeTeam) {
          if (isOwnGoal) {
            scoreUpdate.awayScore = { increment: 1 };
          } else {
            scoreUpdate.homeScore = { increment: 1 };
          }
        } else {
          if (isOwnGoal) {
            scoreUpdate.homeScore = { increment: 1 };
          } else {
            scoreUpdate.awayScore = { increment: 1 };
          }
        }

        await tx.match.update({
          where: { id: data.matchId },
          data: scoreUpdate,
        });

        if (data.playerId && !isOwnGoal) {
          const existingStats = await tx.playerStats.findUnique({
            where: {
              playerId_leagueId_season: {
                playerId: data.playerId,
                leagueId: match.leagueId,
                season: leagueSeason,
              },
            },
          });

          await tx.playerStats.upsert({
            where: {
              playerId_leagueId_season: {
                playerId: data.playerId,
                leagueId: match.leagueId,
                season: leagueSeason,
              },
            },
            update: {
              goals: { increment: 1 },
              appearances: existingStats ? undefined : 1,
            },
            create: {
              playerId: data.playerId,
              leagueId: match.leagueId,
              teamId: data.teamId,
              season: leagueSeason,
              goals: 1,
              appearances: 1,
            },
          });
        }

        if (data.assistPlayerId && !isOwnGoal) {
          const existingAssistStats = await tx.playerStats.findUnique({
            where: {
              playerId_leagueId_season: {
                playerId: data.assistPlayerId,
                leagueId: match.leagueId,
                season: leagueSeason,
              },
            },
          });

          await tx.playerStats.upsert({
            where: {
              playerId_leagueId_season: {
                playerId: data.assistPlayerId,
                leagueId: match.leagueId,
                season: leagueSeason,
              },
            },
            update: {
              assists: { increment: 1 },
              appearances: existingAssistStats ? undefined : 1,
            },
            create: {
              playerId: data.assistPlayerId,
              leagueId: match.leagueId,
              teamId: data.teamId,
              season: leagueSeason,
              assists: 1,
              appearances: 1,
            },
          });
        }

        const scoringTeamStanding = await tx.standing.findUnique({
          where: {
            leagueId_teamId: { leagueId: match.leagueId, teamId: data.teamId },
          },
        });

        const concedingTeamId =
          match.homeTeamId === data.teamId ? match.awayTeamId : match.homeTeamId;

        await tx.standing.upsert({
          where: {
            leagueId_teamId: { leagueId: match.leagueId, teamId: data.teamId },
          },
          update: {
            goalsFor: { increment: isOwnGoal ? 0 : 1 },
            goalsAgainst: { increment: isOwnGoal ? 1 : 0 },
            goalDifference: isOwnGoal ? { decrement: 1 } : { increment: 1 },
            played: scoringTeamStanding ? undefined : 1,
          },
          create: {
            leagueId: match.leagueId,
            teamId: data.teamId,
            season: leagueSeason,
            position: 99,
            goalsFor: isOwnGoal ? 0 : 1,
            goalsAgainst: isOwnGoal ? 1 : 0,
            goalDifference: isOwnGoal ? -1 : 1,
            played: 1,
          },
        });

        await tx.standing.upsert({
          where: {
            leagueId_teamId: { leagueId: match.leagueId, teamId: concedingTeamId },
          },
          update: {
            goalsFor: { increment: isOwnGoal ? 1 : 0 },
            goalsAgainst: { increment: isOwnGoal ? 0 : 1 },
            goalDifference: isOwnGoal ? { increment: 1 } : { decrement: 1 },
          },
          create: {
            leagueId: match.leagueId,
            teamId: concedingTeamId,
            season: leagueSeason,
            position: 99,
            goalsFor: isOwnGoal ? 1 : 0,
            goalsAgainst: isOwnGoal ? 0 : 1,
            goalDifference: isOwnGoal ? 1 : -1,
            played: 1,
          },
        });

        await this.standingRepo.recalculatePositions(match.leagueId);
      }

      if (data.type === "YELLOW_CARD" && data.playerId) {
        await tx.playerStats.upsert({
          where: {
            playerId_leagueId_season: {
              playerId: data.playerId,
              leagueId: match.leagueId,
              season: leagueSeason,
            },
          },
          update: { yellowCards: { increment: 1 } },
          create: {
            playerId: data.playerId,
            leagueId: match.leagueId,
            teamId: data.teamId,
            season: leagueSeason,
            yellowCards: 1,
          },
        });
      }

      if (data.type === "RED_CARD" && data.playerId) {
        await tx.playerStats.upsert({
          where: {
            playerId_leagueId_season: {
              playerId: data.playerId,
              leagueId: match.leagueId,
              season: leagueSeason,
            },
          },
          update: { redCards: { increment: 1 } },
          create: {
            playerId: data.playerId,
            leagueId: match.leagueId,
            teamId: data.teamId,
            season: leagueSeason,
            redCards: 1,
          },
        });
      }

      return event;
    });
  }

  async getMatchEvents(matchId: string) {
    return this.eventRepo.findByMatch(matchId);
  }
}
