import { PrismaClient, PlayerPosition, NewsCategory, TransferType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Populating Barcelona & Real Madrid data...\n");

  const laliga = await prisma.league.findFirst({ where: { slug: "la-liga" } });
  if (!laliga) throw new Error("La Liga not found. Run seed first.");

  let barca = await prisma.team.findFirst({ where: { slug: "barcelona" } });
  let madrid = await prisma.team.findFirst({ where: { slug: "real-madrid" } });
  if (!barca || !madrid) throw new Error("Teams not found. Run seed first.");

  // ─── Clear existing data for these teams ──────────────────────────────────
  for (const teamId of [barca.id, madrid.id]) {
    await prisma.matchEvent.deleteMany({ where: { OR: [{ teamId }, { match: { homeTeamId: teamId } }, { match: { awayTeamId: teamId } }] } });
    await prisma.match.deleteMany({ where: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] } });
    await prisma.playerStats.deleteMany({ where: { teamId } });
    await prisma.standing.deleteMany({ where: { teamId } });
    await prisma.transfer.deleteMany({ where: { OR: [{ fromTeamId: teamId }, { toTeamId: teamId }] } });
    await prisma.player.deleteMany({ where: { teamId } });
  }

  // ─── Real Madrid squad ─────────────────────────────────────────────────────
  const madridPlayers = await Promise.all([
    prisma.player.create({ data: { name: "Thibaut Courtois", slug: "thibaut-courtois", position: PlayerPosition.GOALKEEPER, nationality: "Belgium", shirtNumber: 1, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Dani Carvajal", slug: "dani-carvajal", position: PlayerPosition.DEFENDER, nationality: "Spain", shirtNumber: 2, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Éder Militão", slug: "eder-militao", position: PlayerPosition.DEFENDER, nationality: "Brazil", shirtNumber: 3, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "David Alaba", slug: "david-alaba", position: PlayerPosition.DEFENDER, nationality: "Austria", shirtNumber: 4, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Jude Bellingham", slug: "jude-bellingham", position: PlayerPosition.MIDFIELDER, nationality: "England", shirtNumber: 5, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Eduardo Camavinga", slug: "eduardo-camavinga", position: PlayerPosition.MIDFIELDER, nationality: "France", shirtNumber: 6, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Vinícius Júnior", slug: "vinicius-junior", position: PlayerPosition.FORWARD, nationality: "Brazil", shirtNumber: 7, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Federico Valverde", slug: "federico-valverde", position: PlayerPosition.MIDFIELDER, nationality: "Uruguay", shirtNumber: 8, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Kylian Mbappé", slug: "kylian-mbappe", position: PlayerPosition.FORWARD, nationality: "France", shirtNumber: 9, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Luka Modrić", slug: "luka-modric", position: PlayerPosition.MIDFIELDER, nationality: "Croatia", shirtNumber: 10, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Rodrygo", slug: "rodrygo", position: PlayerPosition.FORWARD, nationality: "Brazil", shirtNumber: 11, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Antonio Rüdiger", slug: "antonio-rudiger", position: PlayerPosition.DEFENDER, nationality: "Germany", shirtNumber: 22, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Ferland Mendy", slug: "ferland-mendy", position: PlayerPosition.DEFENDER, nationality: "France", shirtNumber: 23, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Brahim Díaz", slug: "brahim-diaz", position: PlayerPosition.MIDFIELDER, nationality: "Morocco", shirtNumber: 21, teamId: madrid.id } }),
    prisma.player.create({ data: { name: "Andriy Lunin", slug: "andriy-lunin", position: PlayerPosition.GOALKEEPER, nationality: "Ukraine", shirtNumber: 13, teamId: madrid.id } }),
  ]);
  console.log(`  Real Madrid: ${madridPlayers.length} players`);

  // ─── Barcelona squad ──────────────────────────────────────────────────────
  const barcaPlayers = await Promise.all([
    prisma.player.create({ data: { name: "Marc-André ter Stegen", slug: "marc-andre-ter-stegen", position: PlayerPosition.GOALKEEPER, nationality: "Germany", shirtNumber: 1, teamId: barca.id } }),
    prisma.player.create({ data: { name: "João Cancelo", slug: "joao-cancelo", position: PlayerPosition.DEFENDER, nationality: "Portugal", shirtNumber: 2, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Alejandro Balde", slug: "alejandro-balde", position: PlayerPosition.DEFENDER, nationality: "Spain", shirtNumber: 3, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Ronald Araújo", slug: "ronald-araujo", position: PlayerPosition.DEFENDER, nationality: "Uruguay", shirtNumber: 4, teamId: barca.id } }),
    prisma.player.create({ data: { name: "İlkay Gündoğan", slug: "ilkay-gundogan", position: PlayerPosition.MIDFIELDER, nationality: "Germany", shirtNumber: 5, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Gavi", slug: "gavi", position: PlayerPosition.MIDFIELDER, nationality: "Spain", shirtNumber: 6, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Ferran Torres", slug: "ferran-torres", position: PlayerPosition.FORWARD, nationality: "Spain", shirtNumber: 7, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Pedri", slug: "pedri", position: PlayerPosition.MIDFIELDER, nationality: "Spain", shirtNumber: 8, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Robert Lewandowski", slug: "robert-lewandowski", position: PlayerPosition.FORWARD, nationality: "Poland", shirtNumber: 9, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Lamine Yamal", slug: "lamine-yamal", position: PlayerPosition.FORWARD, nationality: "Spain", shirtNumber: 19, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Raphinha", slug: "raphinha", position: PlayerPosition.FORWARD, nationality: "Brazil", shirtNumber: 11, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Andreas Christensen", slug: "andreas-christensen", position: PlayerPosition.DEFENDER, nationality: "Denmark", shirtNumber: 15, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Frenkie de Jong", slug: "frenkie-de-jong", position: PlayerPosition.MIDFIELDER, nationality: "Netherlands", shirtNumber: 21, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Jules Koundé", slug: "jules-kounde", position: PlayerPosition.DEFENDER, nationality: "France", shirtNumber: 23, teamId: barca.id } }),
    prisma.player.create({ data: { name: "Iñaki Peña", slug: "inaki-pena", position: PlayerPosition.GOALKEEPER, nationality: "Spain", shirtNumber: 13, teamId: barca.id } }),
  ]);
  console.log(`  Barcelona: ${barcaPlayers.length} players`);

  // ─── Helper: find player by name ──────────────────────────────────────────
  function findPlayer(roster: typeof madridPlayers, name: string) {
    const p = roster.find((x) => x.name === name);
    if (!p) throw new Error(`Player not found: ${name}`);
    return p;
  }

  // ─── El Clásico matches ────────────────────────────────────────────────────
  const now = new Date();
  const daysAgo = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return d; };
  const daysFromNow = (n: number) => { const d = new Date(now); d.setDate(d.getDate() + n); return d; };

  // Match 1: Real Madrid 4-1 Barcelona (finished)
  const match1 = await prisma.match.create({
    data: {
      homeTeamId: madrid.id,
      awayTeamId: barca.id,
      leagueId: laliga.id,
      date: daysAgo(14),
      status: "FINISHED",
      homeScore: 4,
      awayScore: 1,
      minute: 90,
      round: 8,
    },
  });

  await Promise.all([
    prisma.matchEvent.create({ data: { matchId: match1.id, teamId: madrid.id, playerId: findPlayer(madridPlayers, "Vinícius Júnior").id, type: "GOAL", minute: 7, detail: "Header from corner" } }),
    prisma.matchEvent.create({ data: { matchId: match1.id, teamId: barca.id, playerId: findPlayer(barcaPlayers, "Robert Lewandowski").id, type: "GOAL", minute: 23, detail: "Right-footed shot from centre of box" } }),
    prisma.matchEvent.create({ data: { matchId: match1.id, teamId: madrid.id, playerId: findPlayer(madridPlayers, "Jude Bellingham").id, type: "GOAL", minute: 45, detail: "Left-footed shot from outside the box" } }),
    prisma.matchEvent.create({ data: { matchId: match1.id, teamId: madrid.id, playerId: findPlayer(madridPlayers, "Kylian Mbappé").id, assistPlayerId: findPlayer(madridPlayers, "Vinícius Júnior").id, type: "GOAL", minute: 62, detail: "Right-footed shot from left side of box" } }),
    prisma.matchEvent.create({ data: { matchId: match1.id, teamId: madrid.id, playerId: findPlayer(madridPlayers, "Rodrygo").id, assistPlayerId: findPlayer(madridPlayers, "Jude Bellingham").id, type: "GOAL", minute: 78, detail: "Header from centre of box" } }),
    prisma.matchEvent.create({ data: { matchId: match1.id, teamId: madrid.id, playerId: findPlayer(madridPlayers, "Eduardo Camavinga").id, type: "YELLOW_CARD", minute: 55 } }),
    prisma.matchEvent.create({ data: { matchId: match1.id, teamId: barca.id, playerId: findPlayer(barcaPlayers, "Ronald Araújo").id, type: "YELLOW_CARD", minute: 70 } }),
  ]);
  console.log(`  Match 1: Real Madrid 4-1 Barcelona (finished)`);

  // Match 2: Barcelona 2-2 Real Madrid (finished)
  const match2 = await prisma.match.create({
    data: {
      homeTeamId: barca.id,
      awayTeamId: madrid.id,
      leagueId: laliga.id,
      date: daysAgo(7),
      status: "FINISHED",
      homeScore: 2,
      awayScore: 2,
      minute: 90,
      round: 15,
    },
  });

  await Promise.all([
    prisma.matchEvent.create({ data: { matchId: match2.id, teamId: barca.id, playerId: findPlayer(barcaPlayers, "Lamine Yamal").id, type: "GOAL", minute: 12, detail: "Left-footed shot from right side of box" } }),
    prisma.matchEvent.create({ data: { matchId: match2.id, teamId: madrid.id, playerId: findPlayer(madridPlayers, "Kylian Mbappé").id, type: "GOAL", minute: 28, detail: "Right-footed shot from centre of box" } }),
    prisma.matchEvent.create({ data: { matchId: match2.id, teamId: barca.id, playerId: findPlayer(barcaPlayers, "Pedri").id, assistPlayerId: findPlayer(barcaPlayers, "Lamine Yamal").id, type: "GOAL", minute: 55, detail: "Right-footed shot from left side of box" } }),
    prisma.matchEvent.create({ data: { matchId: match2.id, teamId: madrid.id, playerId: findPlayer(madridPlayers, "Vinícius Júnior").id, type: "PENALTY", minute: 81, detail: "Penalty kick" } }),
    prisma.matchEvent.create({ data: { matchId: match2.id, teamId: barca.id, playerId: findPlayer(barcaPlayers, "Gavi").id, type: "YELLOW_CARD", minute: 40 } }),
    prisma.matchEvent.create({ data: { matchId: match2.id, teamId: madrid.id, playerId: findPlayer(madridPlayers, "Antonio Rüdiger").id, type: "YELLOW_CARD", minute: 67 } }),
    prisma.matchEvent.create({ data: { matchId: match2.id, teamId: barca.id, playerId: findPlayer(barcaPlayers, "Ronald Araújo").id, type: "RED_CARD", minute: 85 } }),
  ]);
  console.log(`  Match 2: Barcelona 2-2 Real Madrid (finished)`);

  // Match 3: Real Madrid vs Barcelona (scheduled — future El Clásico)
  const match3 = await prisma.match.create({
    data: {
      homeTeamId: madrid.id,
      awayTeamId: barca.id,
      leagueId: laliga.id,
      date: daysFromNow(21),
      status: "SCHEDULED",
      round: 26,
    },
  });
  console.log(`  Match 3: Real Madrid vs Barcelona (scheduled — round 26)`);

  // ─── Standings ────────────────────────────────────────────────────────────
  // Based on the matches above + some extra results for context
  const standingsData = [
    { teamId: madrid.id, position: 1, played: 15, wins: 12, draws: 2, losses: 1, goalsFor: 38, goalsAgainst: 12, points: 38, form: "WWWWD" },
    { teamId: barca.id, position: 3, played: 15, wins: 10, draws: 3, losses: 2, goalsFor: 35, goalsAgainst: 15, points: 33, form: "WWDLW" },
  ];

  for (const s of standingsData) {
    await prisma.standing.upsert({
      where: { leagueId_teamId: { leagueId: laliga.id, teamId: s.teamId } },
      update: { ...s, goalDifference: s.goalsFor - s.goalsAgainst },
      create: { ...s, leagueId: laliga.id, season: laliga.season, goalDifference: s.goalsFor - s.goalsAgainst },
    });
  }
  console.log(`  Standings updated`);

  // ─── Player Stats ─────────────────────────────────────────────────────────
  const statsData: { playerId: string; goals: number; assists: number; appearances: number; minutesPlayed: number }[] = [
    // Real Madrid
    { playerId: findPlayer(madridPlayers, "Kylian Mbappé").id, goals: 12, assists: 3, appearances: 14, minutesPlayed: 1180 },
    { playerId: findPlayer(madridPlayers, "Vinícius Júnior").id, goals: 8, assists: 7, appearances: 15, minutesPlayed: 1250 },
    { playerId: findPlayer(madridPlayers, "Jude Bellingham").id, goals: 6, assists: 5, appearances: 14, minutesPlayed: 1200 },
    { playerId: findPlayer(madridPlayers, "Rodrygo").id, goals: 5, assists: 4, appearances: 15, minutesPlayed: 1100 },
    { playerId: findPlayer(madridPlayers, "Federico Valverde").id, goals: 3, assists: 2, appearances: 15, minutesPlayed: 1300 },
    { playerId: findPlayer(madridPlayers, "Luka Modrić").id, goals: 1, assists: 3, appearances: 12, minutesPlayed: 800 },
    { playerId: findPlayer(madridPlayers, "Dani Carvajal").id, goals: 1, assists: 2, appearances: 13, minutesPlayed: 1100 },
    { playerId: findPlayer(madridPlayers, "Brahim Díaz").id, goals: 2, assists: 1, appearances: 10, minutesPlayed: 500 },
    // Barcelona
    { playerId: findPlayer(barcaPlayers, "Robert Lewandowski").id, goals: 14, assists: 2, appearances: 15, minutesPlayed: 1250 },
    { playerId: findPlayer(barcaPlayers, "Lamine Yamal").id, goals: 5, assists: 8, appearances: 14, minutesPlayed: 1100 },
    { playerId: findPlayer(barcaPlayers, "Raphinha").id, goals: 4, assists: 5, appearances: 14, minutesPlayed: 1050 },
    { playerId: findPlayer(barcaPlayers, "Pedri").id, goals: 3, assists: 4, appearances: 12, minutesPlayed: 900 },
    { playerId: findPlayer(barcaPlayers, "Ferran Torres").id, goals: 3, assists: 2, appearances: 13, minutesPlayed: 700 },
    { playerId: findPlayer(barcaPlayers, "İlkay Gündoğan").id, goals: 2, assists: 3, appearances: 14, minutesPlayed: 1100 },
    { playerId: findPlayer(barcaPlayers, "Gavi").id, goals: 1, assists: 2, appearances: 11, minutesPlayed: 750 },
    { playerId: findPlayer(barcaPlayers, "Frenkie de Jong").id, goals: 1, assists: 1, appearances: 10, minutesPlayed: 800 },
    { playerId: findPlayer(barcaPlayers, "João Cancelo").id, goals: 2, assists: 3, appearances: 13, minutesPlayed: 1100 },
  ];

  for (const s of statsData) {
    const player = await prisma.player.findUnique({ where: { id: s.playerId }, include: { team: true } });
    if (!player?.teamId) continue;
    await prisma.playerStats.upsert({
      where: { playerId_leagueId_season: { playerId: s.playerId, leagueId: laliga.id, season: laliga.season } },
      update: { goals: s.goals, assists: s.assists, appearances: s.appearances, minutesPlayed: s.minutesPlayed, team: { connect: { id: player.teamId } } },
      create: { playerId: s.playerId, leagueId: laliga.id, teamId: player.teamId, season: laliga.season, goals: s.goals, assists: s.assists, appearances: s.appearances, minutesPlayed: s.minutesPlayed },
    });
  }
  console.log(`  Player stats updated`);

  // ─── News ──────────────────────────────────────────────────────────────────
  await prisma.news.create({
    data: {
      title: "Mbappé double helps Real Madrid thrash Barcelona in El Clásico",
      slug: "mbappe-double-el-clasico",
      content: "Kylian Mbappé scored twice as Real Madrid defeated Barcelona 4-1 at the Santiago Bernabéu in a dominant display...",
      excerpt: "French star stars in El Clásico rout",
      category: NewsCategory.MATCH_REPORT,
      leagueId: laliga.id,
      publishedAt: daysAgo(14),
    },
  });

  await prisma.news.create({
    data: {
      title: "Lamine Yamal shines as Barcelona hold Real Madrid in thrilling draw",
      slug: "lamine-yamal-shines-clasico-draw",
      content: "17-year-old Lamine Yamal scored and assisted as Barcelona came from behind twice to draw 2-2 with Real Madrid at Camp Nou...",
      excerpt: "Teenage sensation delivers in El Clásico",
      category: NewsCategory.MATCH_REPORT,
      leagueId: laliga.id,
      publishedAt: daysAgo(7),
    },
  });

  await prisma.news.create({
    data: {
      title: "Real Madrid lead La Liga after dominant start to season",
      slug: "real-madrid-lead-la-liga",
      content: "Real Madrid sit top of La Liga with 38 points from 15 games, powered by Mbappé's 12 goals and an impenetrable defence...",
      excerpt: "Los Blancos set the pace",
      category: NewsCategory.ANALYSIS,
      leagueId: laliga.id,
      publishedAt: daysAgo(3),
    },
  });

  console.log(`  News articles created`);

  // ─── Transfer ──────────────────────────────────────────────────────────────
  await prisma.transfer.create({
    data: {
      playerId: findPlayer(madridPlayers, "Kylian Mbappé").id,
      toTeamId: madrid.id,
      date: daysAgo(180),
      feeDisplay: "Free Transfer",
      type: TransferType.FREE_TRANSFER,
    },
  });

  await prisma.transfer.create({
    data: {
      playerId: findPlayer(barcaPlayers, "İlkay Gündoğan").id,
      toTeamId: barca.id,
      date: daysAgo(200),
      feeDisplay: "Free Transfer",
      type: TransferType.FREE_TRANSFER,
    },
  });

  console.log(`  Transfers created`);

  console.log("\n✓ Population complete!");
  console.log(`  Real Madrid: ${madridPlayers.length} players, 2 matches`);
  console.log(`  Barcelona:   ${barcaPlayers.length} players, 2 matches`);
  console.log(`  El Clásico matches: 2 finished, 1 scheduled`);
}

main()
  .catch((e) => {
    console.error("Population failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
