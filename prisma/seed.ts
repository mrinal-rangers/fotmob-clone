import { PrismaClient, LeagueType, PlayerPosition, TransferType, NewsCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.matchEvent.deleteMany();
  await prisma.match.deleteMany();
  await prisma.playerStats.deleteMany();
  await prisma.standing.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.news.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  await prisma.league.deleteMany();
  await prisma.admin.deleteMany();

  const admin = await prisma.admin.create({
    data: {
      email: "admin@fotmob.com",
      passwordHash: await bcrypt.hash("admin123", 12),
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });
  console.log("  ✓ Admin created:", admin.email);

  const epl = await prisma.league.create({
    data: {
      name: "English Premier League",
      slug: "english-premier-league",
      country: "England",
      type: LeagueType.LEAGUE,
      season: "2025/2026",
    },
  });

  const laliga = await prisma.league.create({
    data: {
      name: "La Liga",
      slug: "la-liga",
      country: "Spain",
      type: LeagueType.LEAGUE,
      season: "2025/2026",
    },
  });

  const ucl = await prisma.league.create({
    data: {
      name: "UEFA Champions League",
      slug: "uefa-champions-league",
      country: "Europe",
      type: LeagueType.CUP,
      season: "2025/2026",
    },
  });
  console.log("  ✓ Leagues created");

  const teams = await Promise.all([
    prisma.team.create({ data: { name: "Manchester City", shortName: "MCI", slug: "manchester-city", country: "England", stadium: "Etihad Stadium" } }),
    prisma.team.create({ data: { name: "Arsenal", shortName: "ARS", slug: "arsenal", country: "England", stadium: "Emirates Stadium" } }),
    prisma.team.create({ data: { name: "Liverpool", shortName: "LIV", slug: "liverpool", country: "England", stadium: "Anfield" } }),
    prisma.team.create({ data: { name: "Chelsea", shortName: "CHE", slug: "chelsea", country: "England", stadium: "Stamford Bridge" } }),
    prisma.team.create({ data: { name: "Manchester United", shortName: "MUN", slug: "manchester-united", country: "England", stadium: "Old Trafford" } }),
    prisma.team.create({ data: { name: "Tottenham Hotspur", shortName: "TOT", slug: "tottenham-hotspur", country: "England", stadium: "Tottenham Hotspur Stadium" } }),
    prisma.team.create({ data: { name: "Real Madrid", shortName: "RMA", slug: "real-madrid", country: "Spain", stadium: "Santiago Bernabéu" } }),
    prisma.team.create({ data: { name: "Barcelona", shortName: "FCB", slug: "barcelona", country: "Spain", stadium: "Camp Nou" } }),
  ]);
  console.log("  ✓ Teams created");

  const players = await Promise.all([
    prisma.player.create({ data: { name: "Erling Haaland", slug: "erling-haaland", position: PlayerPosition.FORWARD, nationality: "Norway", shirtNumber: 9, teamId: teams[0].id } }),
    prisma.player.create({ data: { name: "Kevin De Bruyne", slug: "kevin-de-bruyne", position: PlayerPosition.MIDFIELDER, nationality: "Belgium", shirtNumber: 17, teamId: teams[0].id } }),
    prisma.player.create({ data: { name: "Phil Foden", slug: "phil-foden", position: PlayerPosition.MIDFIELDER, nationality: "England", shirtNumber: 47, teamId: teams[0].id } }),
    prisma.player.create({ data: { name: "Bukayo Saka", slug: "bukayo-saka", position: PlayerPosition.FORWARD, nationality: "England", shirtNumber: 7, teamId: teams[1].id } }),
    prisma.player.create({ data: { name: "Martin Ødegaard", slug: "martin-odegaard", position: PlayerPosition.MIDFIELDER, nationality: "Norway", shirtNumber: 8, teamId: teams[1].id } }),
    prisma.player.create({ data: { name: "Mohamed Salah", slug: "mohamed-salah", position: PlayerPosition.FORWARD, nationality: "Egypt", shirtNumber: 11, teamId: teams[2].id } }),
    prisma.player.create({ data: { name: "Virgil van Dijk", slug: "virgil-van-dijk", position: PlayerPosition.DEFENDER, nationality: "Netherlands", shirtNumber: 4, teamId: teams[2].id } }),
    prisma.player.create({ data: { name: "Cole Palmer", slug: "cole-palmer", position: PlayerPosition.MIDFIELDER, nationality: "England", shirtNumber: 20, teamId: teams[3].id } }),
    prisma.player.create({ data: { name: "Marcus Rashford", slug: "marcus-rashford", position: PlayerPosition.FORWARD, nationality: "England", shirtNumber: 10, teamId: teams[4].id } }),
    prisma.player.create({ data: { name: "Bruno Fernandes", slug: "bruno-fernandes", position: PlayerPosition.MIDFIELDER, nationality: "Portugal", shirtNumber: 8, teamId: teams[4].id } }),
    prisma.player.create({ data: { name: "Son Heung-min", slug: "son-heung-min", position: PlayerPosition.FORWARD, nationality: "South Korea", shirtNumber: 7, teamId: teams[5].id } }),
    prisma.player.create({ data: { name: "James Maddison", slug: "james-maddison", position: PlayerPosition.MIDFIELDER, nationality: "England", shirtNumber: 10, teamId: teams[5].id } }),
    prisma.player.create({ data: { name: "Vinícius Júnior", slug: "vinicius-junior", position: PlayerPosition.FORWARD, nationality: "Brazil", shirtNumber: 7, teamId: teams[6].id } }),
    prisma.player.create({ data: { name: "Jude Bellingham", slug: "jude-bellingham", position: PlayerPosition.MIDFIELDER, nationality: "England", shirtNumber: 5, teamId: teams[6].id } }),
    prisma.player.create({ data: { name: "Robert Lewandowski", slug: "robert-lewandowski", position: PlayerPosition.FORWARD, nationality: "Poland", shirtNumber: 9, teamId: teams[7].id } }),
    prisma.player.create({ data: { name: "Pedri", slug: "pedri", position: PlayerPosition.MIDFIELDER, nationality: "Spain", shirtNumber: 8, teamId: teams[7].id } }),
  ]);
  console.log("  ✓ Players created");

  const now = new Date();
  const pastDate = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d;
  };
  const futureDate = (daysFromNow: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };

  const matches = await Promise.all([
    prisma.match.create({ data: { homeTeamId: teams[0].id, awayTeamId: teams[1].id, leagueId: epl.id, date: pastDate(5), status: "FINISHED", homeScore: 3, awayScore: 1, minute: 90, round: 1 } }),
    prisma.match.create({ data: { homeTeamId: teams[2].id, awayTeamId: teams[3].id, leagueId: epl.id, date: pastDate(5), status: "FINISHED", homeScore: 2, awayScore: 2, minute: 90, round: 1 } }),
    prisma.match.create({ data: { homeTeamId: teams[4].id, awayTeamId: teams[5].id, leagueId: epl.id, date: pastDate(4), status: "FINISHED", homeScore: 0, awayScore: 2, minute: 90, round: 1 } }),
    prisma.match.create({ data: { homeTeamId: teams[0].id, awayTeamId: teams[2].id, leagueId: epl.id, date: pastDate(2), status: "FINISHED", homeScore: 1, awayScore: 1, minute: 90, round: 2 } }),
    prisma.match.create({ data: { homeTeamId: teams[1].id, awayTeamId: teams[4].id, leagueId: epl.id, date: pastDate(1), status: "SCHEDULED", round: 3 } }),
    prisma.match.create({ data: { homeTeamId: teams[3].id, awayTeamId: teams[0].id, leagueId: epl.id, date: futureDate(3), status: "SCHEDULED", round: 3 } }),
    prisma.match.create({ data: { homeTeamId: teams[6].id, awayTeamId: teams[7].id, leagueId: laliga.id, date: pastDate(3), status: "FINISHED", homeScore: 3, awayScore: 2, minute: 90, round: 1 } }),
  ]);
  console.log("  ✓ Matches created");

  const matchEvents = await Promise.all([
    // Man City 3-1 Arsenal
    prisma.matchEvent.create({ data: { matchId: matches[0].id, teamId: teams[0].id, playerId: players[0].id, type: "GOAL", minute: 12, detail: "Left-footed shot from centre of box" } }),
    prisma.matchEvent.create({ data: { matchId: matches[0].id, teamId: teams[0].id, playerId: players[1].id, type: "GOAL", minute: 34, detail: "Right-footed shot from outside the box" } }),
    prisma.matchEvent.create({ data: { matchId: matches[0].id, teamId: teams[1].id, playerId: players[3].id, type: "GOAL", minute: 45, detail: "Header from centre of box" } }),
    prisma.matchEvent.create({ data: { matchId: matches[0].id, teamId: teams[0].id, playerId: players[0].id, type: "PENALTY", minute: 78, detail: "Penalty kick" } }),
    // Liverpool 2-2 Chelsea
    prisma.matchEvent.create({ data: { matchId: matches[1].id, teamId: teams[2].id, playerId: players[5].id, assistPlayerId: players[0].id, type: "GOAL", minute: 15, detail: "Left-footed shot" } }),
    prisma.matchEvent.create({ data: { matchId: matches[1].id, teamId: teams[3].id, playerId: players[7].id, type: "GOAL", minute: 32, detail: "Left-footed shot" } }),
    prisma.matchEvent.create({ data: { matchId: matches[1].id, teamId: teams[2].id, playerId: players[5].id, type: "GOAL", minute: 55, detail: "Right-footed shot" } }),
    prisma.matchEvent.create({ data: { matchId: matches[1].id, teamId: teams[3].id, playerId: players[7].id, type: "PENALTY", minute: 82, detail: "Penalty kick" } }),
    // Man United 0-2 Tottenham
    prisma.matchEvent.create({ data: { matchId: matches[2].id, teamId: teams[5].id, playerId: players[10].id, type: "GOAL", minute: 23 } }),
    prisma.matchEvent.create({ data: { matchId: matches[2].id, teamId: teams[5].id, playerId: players[11].id, type: "GOAL", minute: 67 } }),
    // Man City 1-1 Liverpool
    prisma.matchEvent.create({ data: { matchId: matches[3].id, teamId: teams[0].id, playerId: players[2].id, type: "GOAL", minute: 41 } }),
    prisma.matchEvent.create({ data: { matchId: matches[3].id, teamId: teams[2].id, playerId: players[5].id, type: "GOAL", minute: 63 } }),
  ]);
  console.log("  ✓ Match events created");

  const standings = await Promise.all([
    prisma.standing.create({ data: { leagueId: epl.id, teamId: teams[0].id, season: "2025/2026", position: 1, played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 4, form: "WD" } }),
    prisma.standing.create({ data: { leagueId: epl.id, teamId: teams[2].id, season: "2025/2026", position: 2, played: 2, wins: 0, draws: 2, losses: 0, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 2, form: "DD" } }),
    prisma.standing.create({ data: { leagueId: epl.id, teamId: teams[5].id, season: "2025/2026", position: 3, played: 1, wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 0, goalDifference: 2, points: 3, form: "W" } }),
    prisma.standing.create({ data: { leagueId: epl.id, teamId: teams[3].id, season: "2025/2026", position: 4, played: 1, wins: 0, draws: 1, losses: 0, goalsFor: 2, goalsAgainst: 2, goalDifference: 0, points: 1, form: "D" } }),
    prisma.standing.create({ data: { leagueId: epl.id, teamId: teams[1].id, season: "2025/2026", position: 5, played: 1, wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 3, goalDifference: -2, points: 0, form: "L" } }),
    prisma.standing.create({ data: { leagueId: epl.id, teamId: teams[4].id, season: "2025/2026", position: 6, played: 1, wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 2, goalDifference: -2, points: 0, form: "L" } }),
    prisma.standing.create({ data: { leagueId: laliga.id, teamId: teams[6].id, season: "2025/2026", position: 1, played: 1, wins: 1, draws: 0, losses: 0, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 3, form: "W" } }),
    prisma.standing.create({ data: { leagueId: laliga.id, teamId: teams[7].id, season: "2025/2026", position: 2, played: 1, wins: 0, draws: 0, losses: 1, goalsFor: 2, goalsAgainst: 3, goalDifference: -1, points: 0, form: "L" } }),
  ]);
  console.log("  ✓ Standings created");

  const playerStats = await Promise.all([
    prisma.playerStats.create({ data: { playerId: players[0].id, leagueId: epl.id, teamId: teams[0].id, season: "2025/2026", goals: 2, assists: 0, appearances: 2, minutesPlayed: 180 } }),
    prisma.playerStats.create({ data: { playerId: players[1].id, leagueId: epl.id, teamId: teams[0].id, season: "2025/2026", goals: 1, assists: 0, appearances: 2, minutesPlayed: 180 } }),
    prisma.playerStats.create({ data: { playerId: players[5].id, leagueId: epl.id, teamId: teams[2].id, season: "2025/2026", goals: 3, assists: 0, appearances: 2, minutesPlayed: 180 } }),
    prisma.playerStats.create({ data: { playerId: players[7].id, leagueId: epl.id, teamId: teams[3].id, season: "2025/2026", goals: 2, assists: 0, appearances: 1, minutesPlayed: 90 } }),
    prisma.playerStats.create({ data: { playerId: players[10].id, leagueId: epl.id, teamId: teams[5].id, season: "2025/2026", goals: 1, assists: 0, appearances: 1, minutesPlayed: 90 } }),
    prisma.playerStats.create({ data: { playerId: players[11].id, leagueId: epl.id, teamId: teams[5].id, season: "2025/2026", goals: 1, assists: 0, appearances: 1, minutesPlayed: 90 } }),
    prisma.playerStats.create({ data: { playerId: players[2].id, leagueId: epl.id, teamId: teams[0].id, season: "2025/2026", goals: 1, assists: 0, appearances: 2, minutesPlayed: 120 } }),
    prisma.playerStats.create({ data: { playerId: players[3].id, leagueId: epl.id, teamId: teams[1].id, season: "2025/2026", goals: 1, assists: 0, appearances: 1, minutesPlayed: 90 } }),
    prisma.playerStats.create({ data: { playerId: players[12].id, leagueId: laliga.id, teamId: teams[6].id, season: "2025/2026", goals: 1, assists: 0, appearances: 1, minutesPlayed: 90 } }),
    prisma.playerStats.create({ data: { playerId: players[14].id, leagueId: laliga.id, teamId: teams[7].id, season: "2025/2026", goals: 1, assists: 0, appearances: 1, minutesPlayed: 90 } }),
    prisma.playerStats.create({ data: { playerId: players[13].id, leagueId: laliga.id, teamId: teams[6].id, season: "2025/2026", goals: 1, assists: 1, appearances: 1, minutesPlayed: 90 } }),
  ]);
  console.log("  ✓ Player stats created");

  const transfers = await Promise.all([
    prisma.transfer.create({ data: { playerId: players[7].id, fromTeamId: teams[0].id, toTeamId: teams[3].id, date: pastDate(60), fee: 45.0, feeDisplay: "€45M", type: TransferType.PERMANENT } }),
    prisma.transfer.create({ data: { playerId: players[11].id, fromTeamId: teams[3].id, toTeamId: teams[5].id, date: pastDate(45), fee: 40.0, feeDisplay: "€40M", type: TransferType.PERMANENT } }),
    prisma.transfer.create({ data: { playerId: players[13].id, fromTeamId: teams[3].id, toTeamId: teams[6].id, date: pastDate(90), fee: 103.0, feeDisplay: "€103M", type: TransferType.PERMANENT } }),
  ]);
  console.log("  ✓ Transfers created");

  const news = await Promise.all([
    prisma.news.create({ data: { title: "Haaland scores brace in derby win", slug: "haaland-brace-derby-win", content: "Erling Haaland scored twice as Manchester City defeated Arsenal 3-1 at the Etihad...", excerpt: "Manchester City maintain perfect start", category: NewsCategory.MATCH_REPORT, leagueId: epl.id, publishedAt: pastDate(5) } }),
    prisma.news.create({ data: { title: "Real Madrid complete Bellingham signing", slug: "real-madrid-bellingham-signing", content: "Real Madrid have announced the signing of Jude Bellingham from Borussia Dortmund...", excerpt: "English midfielder joins Los Blancos", category: NewsCategory.TRANSFERS, publishedAt: pastDate(90) } }),
    prisma.news.create({ data: { title: "Liverpool and Chelsea play out thrilling draw", slug: "liverpool-chelsea-thrilling-draw", content: "Mohamed Salah scored twice but Cole Palmer's penalty earned Chelsea a point at Anfield...", excerpt: "Seven-goal thriller at Anfield", category: NewsCategory.MATCH_REPORT, leagueId: epl.id, publishedAt: pastDate(5) } }),
    prisma.news.create({ data: { title: "Palmer: I want to establish myself at Chelsea", slug: "palmer-establish-chelsea", content: "Cole Palmer has expressed his desire to become a key player for Chelsea after his summer move...", excerpt: "England midfielder on his Chelsea ambitions", category: NewsCategory.OFFICIAL, publishedAt: pastDate(30) } }),
    prisma.news.create({ data: { title: "Barcelona confident of Olmo deal", slug: "barcelona-olmo-deal-rumor", content: "Barcelona are reportedly confident of reaching an agreement to sign Dani Olmo...", excerpt: "Catalan giants push for summer signing", category: NewsCategory.RUMOR, leagueId: laliga.id, publishedAt: pastDate(10) } }),
    prisma.news.create({ data: { title: "Premier League season preview 2025/26", slug: "premier-league-preview-2025-26", content: "The new Premier League season is upon us. Here is our comprehensive preview...", excerpt: "Everything you need to know", category: NewsCategory.ANALYSIS, leagueId: epl.id, publishedAt: pastDate(7) } }),
  ]);
  console.log("  ✓ News created");

  console.log("\n✓ Seed completed successfully!");
  console.log("\nAdmin login:");
  console.log("  Email:    admin@fotmob.com");
  console.log("  Password: admin123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
