# FootPulse Web UI — Architecture & Specification

> Based on fotmob.com reverse engineering. Auth is optional everywhere. No admin UI.
> Every API-dependent component handles its own error: 404 → per-component placeholder, never a broken page.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite + React 18 |
| Routing | react-router-dom v6 (file-based mental model via pages/) |
| Styling | Tailwind CSS v3 + CSS variables (light/dark) |
| UI Library | shadcn/ui (custom components built on Radix) |
| Auth | Clerk (`@clerk/clerk-react`) — optional, sign-in button in header |
| Data Fetching | TanStack React Query v5 |
| Icons | lucide-react |
| API Proxy | Vite dev server proxies `/api` → BFF `:4001` |

---

## Routing Table

| Route | Page Component | Auth Required | Sidebar |
|-------|---------------|---------------|---------|
| `/` | HomePage | No | Yes |
| `/leagues` | LeaguesPage | No | No |
| `/leagues/:id/overview` | LeagueOverviewPage | No | Yes |
| `/leagues/:id/table` | LeagueTablePage | No | No |
| `/leagues/:id/fixtures` | LeagueFixturesPage | No | No |
| `/leagues/:id/stats/players` | LeagueStatsPlayersPage | No | No |
| `/leagues/:id/stats/teams` | LeagueStatsTeamsPage | No | No |
| `/leagues/:id/transfers` | LeagueTransfersPage | No | No |
| `/leagues/:id/seasons` | LeagueSeasonsPage | No | No |
| `/leagues/:id/news` | LeagueNewsPage | No | No |
| `/matches/:id` | MatchDetailPage | No | Yes |
| `/teams/:id/overview` | TeamOverviewPage | No | Yes |
| `/teams/:id/squad` | TeamSquadPage | No | No |
| `/teams/:id/fixtures` | TeamFixturesPage | No | No |
| `/teams/:id/table` | TeamTablePage | No | No |
| `/teams/:id/transfers` | TeamTransfersPage | No | No |
| `/teams/:id/news` | TeamNewsPage | No | No |
| `/teams/:id/stats` | TeamStatsPage | No | No |
| `/players/:id` | PlayerPage | No | Yes |
| `/news` | NewsPage | No | No |
| `/transfers` | TransfersPage | No | No |
| `/following` | FollowingPage | Yes (prompt if logged out) | No |
| `/settings` | SettingsPage | Yes (prompt if logged out) | No |

### URL Patterns

```
/leagues/:id/overview               League overview (default)
/leagues/:id/table                  Standings
/leagues/:id/fixtures?group=by-date Fixtures with grouping
/leagues/:id/stats/players          Player stats
/leagues/:id/stats/teams            Team stats
/leagues/:id/transfers              Transfers
/leagues/:id/seasons                Season history
/leagues/:id/news                   News

/teams/:id/overview                 Team overview (default)
/teams/:id/squad                    Full squad
/teams/:id/fixtures                 Team matches
/teams/:id/table                    League position
/teams/:id/transfers                Team transfers
/teams/:id/news                     Team news
/teams/:id/stats                    Team stats

/matches/:id                        Match detail

/players/:id                        Player profile

/news                               News hub
/transfers                          Transfer center
/following                          User follows
/settings                           User preferences
```

All league/team pages support `?season=2026-2027`.

---

## Global Layout

```
+-------------------------------------------------------------------+
| HEADER (z-50, fixed top, bg-card border-b)                        |
| [Logo: 🦶 FootPulse] [Search input] [Leagues] [Transfers] [News]  |
| [Profile icon / Sign In button]                                   |
+-------------------------------------------------------------------+
|                                                                    |
| <main class="max-w-7xl mx-auto">                                   |
|   +----------------------------------------------------------+    |
|   |  <Outlet /> (page content, 2-column where needed)         |    |
|   |                                                           |    |
|   |  +--------------------+  +-----------------------------+  |    |
|   |  | Left column ~70%   |  | Sidebar ~30% (conditionally)|  |    |
|   |  |                    |  |                             |  |    |
|   |  | Page content       |  | - Trending News (3 items)   |  |    |
|   |  |                    |  | - Top Transfers (3 items)   |  |    |
|   |  |                    |  | - Lineup Builder promo      |  |    |
|   |  +--------------------+  +-----------------------------+  |    |
|   +----------------------------------------------------------+    |
|                                                                    |
+-------------------------------------------------------------------+
| FOOTER (bg-card border-t)                                          |
| 3-column grid: [Logo + About] [Links] [App Store / Google Play]   |
| Bottom bar: [Version] [Cookie policy] [Privacy] [FAQ] [Copyright] |
+-------------------------------------------------------------------+
| MOBILE BOTTOM NAV (fixed bottom, lg:hidden)                       |
| [Matches] [News] [Transfers] [Leagues] [Profile]                  |
+-------------------------------------------------------------------+
```

### Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 1024px | Single column, sidebar hidden, bottom nav visible |
| ≥ 1024px | 2-column (70/30), sidebar visible, header fully expanded |

---

## Page-by-Page Component Specification

---

### 1. HomePage `/`

**Layout**: 2-column (matches | sidebar)

**Components**:
```
<DateNavBar>
  ← scrollable pill buttons: [-3] [-2] [-1] [Today*] [+1] [+2] [+3] [+4] [+5]
  → onClick selects date, filters matches

<LeagueMatchGroup league={league}>
  <LeagueHeader logo name country />
  <MatchCard match /> × N
</LeagueMatchGroup>

<MatchCard>
  ┌──────────────────────────────────┐
  │ 15:30 / LIVE ● / FT             │
  │ Arsenal        2 - 1    Chelsea  │
  │ [crest]                [crest]   │
  └──────────────────────────────────┘
  States:
  - Upcoming: show kickoff time
  - LIVE: pulsing red dot + "LIVE", score editable
  - FT: "FT" badge, final score
  - Click → /matches/:id

<Sidebar>
  <TrendingNewsCard>          → 3 headlines, if no API → show "News unavailable"
  <TopTransfersCard>          → 3 transfers, if no API → show "Transfers unavailable"  
  <LineupBuilderPromo>        → Static promo image + link
</Sidebar>
```

**API calls**:
- `GET /api/matches` — all matches
- `GET /api/leagues` — for grouping headers
- News/transfers sidebar: **no API → render unavailable**

**Error handling**:
- API error on matches: "Unable to load matches" + retry button
- API error on sidebar: per-card "Unavailable" placeholder

---

### 2. LeaguesPage `/leagues`

**Layout**: Full width, no sidebar

```
<SearchBar placeholder="Search leagues..." />
<LeagueGrid>
  <LeagueCard league /> × N
</LeagueGrid>

<LeagueCard>
  ┌────────────────────┐
  │ [Initial/crest]    │
  │ Premier League     │
  │ England            │
  └────────────────────┘
  Click → /leagues/:id/overview
```

**API**: `GET /api/leagues`

**Error handling**: API error → "Unable to load leagues" + retry

---

### 3. LeagueOverviewPage `/leagues/:id/overview`

**Layout**: 2-column

```
<SeasonSelector seasons={["2026/2027", "2025/2026"]} />

<LeagueHeader>
  [Crest] [Name] [Country] [Season dropdown]

<LeagueTabNav>
  [Overview*] [Table] [Fixtures] [Stats] [Transfers] [Seasons] [News]
  → Sub-route navigation

<OverviewContent>
  ┌─ Column left (~65%) ───────────────────┐
  │ <MiniStandingsTable top={5}>           │
  │   # Team          P  W D L GD Pts Form │
  │   1 Arsenal       10 8 1 1 +20 25 WWDWW│
  │   2 Man City      10 7 2 1 +15 23 WWWDL│
  │   ...                                  │
  │   [Full Table →]                       │
  │ </MiniStandingsTable>                  │
  │                                         │
  │ <RecentMatchesList matches={5}>         │
  │   [Round X]                             │
  │   MatchCards...                         │
  │ </RecentMatchesList>                    │
  ├─ Column right (~35%) ──────────────────┤
  │ <TopPlayersCard>                       │
  │   Top Scorer  |  Top Assister | Top Rt'd│
  │   each: [Photo][Name][Stat]            │
  │ </TopPlayersCard>                      │
  │ <LatestNewsCard>                        │
  │   3 headlines (no API → unavailable)    │
  │ </LatestNewsCard>                       │
  └─────────────────────────────────────────┘
```

**API calls**:
- `GET /api/leagues/:id`
- `GET /api/standings/:id` — for mini table
- `GET /api/matches?leagueId=:id` — recent matches
- Top players: **no dedicated API → derive from match events or show unavailable**
- News: **no API → show unavailable**

**Error handling**:
- League 404: "League not found" full page
- Standings error: mini table shows "Standings unavailable"
- Matches error: section shows "Fixtures unavailable"

---

### 4. LeagueTablePage `/leagues/:id/table`

**Layout**: Full width, no sidebar

```
<TableTypeTabs [Total*] [Home] [Away] />

<StandingsTable>
  ┌────────────────────────────────────────────────────────────┐
  │ #  Team             P   W   D   L   GF  GA  GD  Pts  Form │
  │ 1  [crest] Arsenal  10  8   1   1   30  10  +20  25   WWDWW│
  │ 2  [crest] Man City 10  7   2   1   25  10  +15  23   WWWDL│
  │ 3  [crest] Liverpool 10  6   3   1   22  8   +14  21   WDWWL│
  │ ...                                                         │
  │                                                             │
  │ Color zones:                                                │
  │ 🟦 1-4 = Champions League                                   │
  │ 🟧 5-6 = Europa League                                      │
  │ 🟥 18-20 = Relegation                                       │
  └─────────────────────────────────────────────────────────────┘
  <Legend>
```

**API**: `GET /api/standings/:id`

**Error handling**:
- No standings data → "No standings available for this season"

---

### 5. LeagueFixturesPage `/leagues/:id/fixtures?group=by-date`

```
<GroupToggle [By Date*] [By Round] [By Club] />
<TeamFilterDropdown />

<FixtureList>
  <RoundHeader label="Matchweek 10" />
  <MatchCard match /> × N

  <DateHeader label="2026-10-26" />  
  <MatchCard match /> × N
</FixtureList>
```

**API**: `GET /api/matches?leagueId=:id`

**Error handling**: "No fixtures available"

---

### 6. League Stats Pages

#### StatsPlayers `/leagues/:id/stats/players`

```
<StatCategoryTabs [Top Scorers*] [Most Assists] [Top Rating] [Clean Sheets] [Most Saves] />
<TeamFilterDropdown />

<StatsTable>
  # | Player | Team | Stat
</StatsTable>
```

**No API → component-level "Player stats unavailable"**

#### StatsTeams `/leagues/:id/stats/teams`

```
<StatCategoryTabs [Goals per match*] [Shots on target] [Possession] [Pass accuracy] />
<StatsTable>
  # | Team | Stat
</StatsTable>
```

**No API → "Team stats unavailable"**

---

### 7. LeagueTransfersPage `/leagues/:id/transfers`

```
<TransferFilter [All*] [In] [Out] />
<ClubSelector />

<TransferList>
  <TransferItem>
    [Photo] [Player Name] [Position]
    [From Club] → [To Club]
    [Fee] [Date]
  </TransferItem>
</TransferList>
```

**No API → "Transfer data unavailable"**

---

### 8. LeagueSeasonsPage `/leagues/:id/seasons`

```
<SeasonsHistoryTable>
  Season | Winner | Runner-up
  2025/26 | [crest] Man City | [crest] Arsenal
  2024/25 | [crest] Man City | [crest] Arsenal
  ...
</SeasonsHistoryTable>
```

**No API → "Season history unavailable"**

---

### 9. LeagueNewsPage `/leagues/:id/news`

```
<NewsCardGrid>
  <NewsCard>
    [Image] [Title]
    [Source] [Time ago] [Category]
    link: external or /news/:articleId
  </NewsCard>
</NewsCardGrid>
```

**No API → "News unavailable"**

---

### 10. MatchDetailPage `/matches/:id` (RICHEST PAGE)

**Layout**: 2-column

```
<ScoreBanner>
  ┌────────────────────────────────────────────────────────┐
  │  World Cup · Quarter-final · Sat Jul 18, 2026          │
  │                                                        │
  │    [crest]              [crest]                        │
  │    France          6 - 4         England               │
  │    ★ MOTM: Declan Rice        Attendance: 65,000       │
  │                                                        │
  │    Stadium: Miami Stadium · Referee: John Smith        │
  └────────────────────────────────────────────────────────┘
  States: PRE / LIVE (pulsing red) / FT

<MatchTabNav>
  [Commentary*] [Lineups] [Stats] [Timeline] [H2H] [Table] [Overview]

<MatchContent>
  ┌─ Main column ──────────────────────────────────────────┐
  │ <CommentaryTab> (default)                               │
  │   3' ⚽ Goal! Declan Rice (England) 0-1                 │
  │   12' 🟨 Yellow card - Harry Kane                      │
  │   15' ⚽ Goal! Kylian Mbappé (France) 1-1              │
  │   45+3' ⚽ Goal! Bukayo Saka (England) 1-2             │
  │   ...                                                   │
  │ </CommentaryTab>                                        │
  │                                                         │
  │ <LineupsTab>                                            │
  │   France 4-3-3         England 4-2-3-1                 │
  │   Starting XI           Starting XI                     │
  │   1  Lloris             1  Pickford                     │
  │   5  Koundé            2  Walker                        │
  │   ...                                                   │
  │   Coach: Didier Deschamps  Coach: Gareth Southgate      │
  │ </LineupsTab>                                           │
  │                                                         │
  │ <StatsTab>                                              │
  │   Possession     58%  |  42%                            │
  │   Shots          14   |  9                              │
  │   Shots on target 8    |  5                             │
  │   ...                                                   │
  │ </StatsTab>                                             │
  │                                                         │
  │ <TimelineTab>                                           │
  │   ─────────────────────────────────────── 90+'         │
  │   ⚽ ● ●   🟨 ●   🔄 ●                                 │
  │   0'    15'    30'    45'    60'    75'    90'          │
  │ </TimelineTab>                                          │
  │                                                         │
  │ <H2HTab>                                                │
  │   Total: 12 matches  France: 4  Draws: 3  England: 5   │
  │   2024 England 2-1 France (Euro)                        │
  │   2023 France 1-1 England (Friendly)                    │
  │ </H2HTab>                                               │
  │                                                         │
  │ <TableTab>                                              │
  │   Related group/league table excerpt                    │
  │ </TableTab>                                             │
  ├─ Sidebar ───────────────────────────────────────────────┤
  │ <PlayerRatings>                                         │
  │   Top Players:                                          │
  │   🥇 Declan Rice   8.9                                  │
  │   🥈 Kylian Mbappé 8.2                                  │
  │ </PlayerRatings>                                        │
  │ <MatchFacts>                                            │
  │   Stadium, Attendance, Referee, Weather                 │
  │ </MatchFacts>                                           │
  └─────────────────────────────────────────────────────────┘
```

**API calls**:
- `GET /api/matches/:id` — match data + events
- Lineups → **no API → render "Lineups unavailable"**
- Stats → **no API → render "Match stats unavailable"**
- H2H → **no API → render "H2H unavailable"**
- Player ratings → **no API → render "Ratings unavailable"**
- Weather → **no API → render "Weather unavailable"**

**Error handling**:
- Match 404: "Match not found"
- Per-tab: each section independently handles its own error

---

### 11. TeamOverviewPage `/teams/:id/overview`

```
<TeamHeader [crest] [name] [league badge] [country] />
<TeamTabNav [Overview*] [Fixtures] [Squad] [Table] [Stats] [Transfers] [News] />

<OverviewContent>
  ┌─ Left ─────────────────────────────────────────────────┐
  │ <UpcomingMatches matches={3} />                         │
  │ <RecentResults matches={3} />                           │
  │ <TopPlayers players={5} />                              │
  ├─ Right ─────────────────────────────────────────────────┤
  │ <MiniTableHighlight />                                   │
  │ <TeamInfoCard founded stadium coach />                   │
  └─────────────────────────────────────────────────────────┘
```

**API**: `GET /api/teams/:id`, `GET /api/matches?leagueId=:id`

---

### 12. TeamSquadPage `/teams/:id/squad`

```
<CoachCard photo name nationality />
<SquadGroup position="Goalkeepers">
  [Shirt#] [Photo] [Name] [Age] [Nationality] → links to /players/:id
</SquadGroup>
<SquadGroup position="Defenders">...</SquadGroup>
<SquadGroup position="Midfielders">...</SquadGroup>
<SquadGroup position="Forwards">...</SquadGroup>
```

**API**: `GET /api/teams/:id` (with players array)

---

### 13. TeamFixturesPage `/teams/:id/fixtures`

```
<MonthGroup month="October 2026">
  MatchCards grouped by competition
</MonthGroup>
<MonthGroup month="September 2026">...</MonthGroup>
```

**API**: `GET /api/matches?teamId=:id` (need to add filter param)

---

### 14. TeamTablePage `/teams/:id/table`

Identical to League Table — but team's row is highlighted.

**API**: `GET /api/standings/:leagueId`

---

### 15. Team Transfers / News / Stats

Same as league versions — show "Unavailable" when no API.

---

### 16. PlayerPage `/players/:id`

```
<PlayerHeader>
  [Photo] [Name] [Age] [Nationality] [Position] [Team]
  [Height] [Preferred foot] [Transfer value]

<MainStatsCard>
  League: [name] Season: [year]
  Goals | Assists | Apps | Mins | Rating
  [stat]  [stat]    [stat] [stat] [stat]

<RecentMatchesSection>
  MatchCard × 5-10 with player stats (goals, mins, rating)

<CareerHistorySection>
  Club | Years | Apps | Goals
  Team A | 2020-2023 | 50 | 15
  Team B | 2023-     | 30 | 10

<TraitsSection>     ← no API → "Player traits unavailable"
  Percentile bars vs positional peers

<MarketValueSection> ← no API → "Market value history unavailable"
  Chart over time

<TrophiesSection>   ← no API → "Trophy history unavailable"
  List of honors
```

**API**: `GET /api/players/:id`

---

### 17. NewsPage `/news`

```
<NewsTabNav [For You] [Latest] />
<NewsCardGrid>
  <NewsCard>
    [Image 16:9] [Category tag] [Title]
    [Source] [Time ago]
  </NewsCard>
</NewsCardGrid>
```

**No API → "News feed unavailable"**

---

### 18. TransfersPage `/transfers`

```
<FilterBar>
  [League dropdown] [Team dropdown] [Date range]
<TopTransfersHighlight>
  3 biggest transfers with [Player] [From→To] [Fee]
<TransferList>
  All transfers with filters
```

**No API → "Transfer center unavailable"**

---

### 19. FollowingPage `/following`

```
if (loggedOut):
  <SignInPrompt icon iconText="Sign in to follow teams and leagues" />

if (loggedIn):
  <FollowingGrid>
    <FollowCard>
      [crest/initials] [Entity name] [Type tag] [Unfollow ✕]
    </FollowCard>
  </FollowingGrid>
```

**API**: `GET /api/users/me/follows`

---

### 20. SettingsPage `/settings`

```
if (loggedOut):
  <SignInPrompt />

if (loggedIn):
  <ProfileCard user avatar name email isAdmin />

  <AppearanceSection>
    [Theme: Light / Dark / System]
    [Language dropdown]
  </AppearanceSection>

  <PreferencesSection>
    [Unit system: Metric / Imperial]
    [Timezone selector]
  </PreferencesSection>
```

**API**: `PATCH /api/users/me/preferences`

---

## BFF API Endpoint Inventory

### Existing (from CORE)

| Method | Path | Page Usage |
|--------|------|-----------|
| `GET` | `/api/leagues` | Home, Leagues |
| `GET` | `/api/leagues/:id` | League pages |
| `GET` | `/api/teams` | Team index |
| `GET` | `/api/teams/:id` | Team pages (includes players) |
| `GET` | `/api/matches` | Home, Fixtures |
| `GET` | `/api/matches/:id` | Match detail (includes events) |
| `GET` | `/api/standings/:leagueId` | League table, mini standings |
| `POST` | `/api/matches/:id/events` | Goal recording (admin only, not used in UI) |
| `POST` | `/api/users/sync` | Clerk auth sync |
| `GET` | `/api/users/:id/follows` | Following page |
| `POST` | `/api/users/:id/follows` | Add follow |
| `DELETE` | `/api/users/:id/follows/:followId` | Remove follow |
| `PATCH` | `/api/users/:id/preferences` | Settings |
| `GET` | `/api/auth/me` | Current user (BFF endpoint) |

### Missing (will show "Unavailable")

| Data | UI Section |
|------|-----------|
| Player stats/recent matches | PlayerPage, League stats |
| Match lineups | MatchDetail — Lineups tab |
| Match stats (possession, shots) | MatchDetail — Stats tab |
| H2H history | MatchDetail — H2H tab |
| Player ratings | MatchDetail — Ratings sidebar |
| Player traits | PlayerPage — Traits |
| Market values | PlayerPage — Market value |
| Career history | PlayerPage — Career |
| Trophies | PlayerPage — Trophies |
| News articles | NewsPage, LeagueNews, TeamNews |
| Transfers | TransfersPage, LeagueTransfers, TeamTransfers |
| Season history | LeagueSeasons |
| Weather | MatchDetail — Info box |

---

## Component Error Handling Strategy

```typescript
// Every API-consuming component follows this pattern:

function LeagueStandingsSection({ leagueId }: { leagueId: string }) {
  const { data, isLoading, isError, error } = useStandings(leagueId);

  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (isError) return <UnavailableCard message="Standings not available" />;
  if (!data || data.length === 0) return <EmptyCard message="No standings data yet" />;

  return <StandingsTable data={data} />;
}
```

### Error Component Hierarchy

| Component | What it shows |
|-----------|--------------|
| `<PageError title="Not Found" description="..." action="Go Home" />` | Full page (used for 404 entities) |
| `<UnavailableCard message="..." />` | Greyed-out card with icon + message (used for individual sections) |
| `<EmptyCard message="..." />` | Friendly message + icon for empty states |
| `<Skeleton />` | Loading shimmer (per component, not full page) |

---

## Component Tree (File Structure)

```
src/
  main.tsx                    — ClerkProvider + QueryClientProvider + ThemeProvider + Router
  App.tsx                     — Route definitions
  index.css                   — Tailwind + CSS variables

  lib/
    api.ts                    — Fetch wrapper, all API functions
    utils.ts                  — cn(), formatDate(), getDateArr()

  types/
    api.ts                    — League, Team, Match, Player, Standing, Event, User, Follow

  providers/
    theme-provider.tsx         — useTheme() context

  layouts/
    root-layout.tsx            — Header + Sidebar + Footer + MobileNav + <Outlet />

  pages/
    HomePage.tsx
    LeaguesPage.tsx
    LeagueOverviewPage.tsx
    LeagueTablePage.tsx
    LeagueFixturesPage.tsx
    LeagueStatsPlayersPage.tsx
    LeagueStatsTeamsPage.tsx
    LeagueTransfersPage.tsx
    LeagueSeasonsPage.tsx
    LeagueNewsPage.tsx
    MatchDetailPage.tsx
    TeamOverviewPage.tsx
    TeamSquadPage.tsx
    TeamFixturesPage.tsx
    TeamTablePage.tsx
    TeamTransfersPage.tsx
    TeamNewsPage.tsx
    TeamStatsPage.tsx
    PlayerPage.tsx
    NewsPage.tsx
    TransfersPage.tsx
    FollowingPage.tsx
    SettingsPage.tsx

  components/
    shared/
      MatchCard.tsx
      StandingsTable.tsx
      DateNavBar.tsx
      LeagueTabNav.tsx
      TeamTabNav.tsx
      MatchTabNav.tsx
      SeasonSelector.tsx
      SearchBar.tsx
      Sidebar.tsx
      UnavailableCard.tsx
      EmptyCard.tsx
      PageError.tsx
      Skeleton.tsx
    home/
      LeagueMatchGroup.tsx
      TrendingNewsCard.tsx
      TopTransfersCard.tsx
    league/
      LeagueHeader.tsx
      MiniStandingsTable.tsx
      TopPlayersCard.tsx
      FixtureList.tsx
      StatsTable.tsx
      TransferList.tsx
    match/
      ScoreBanner.tsx
      CommentaryTimeline.tsx
      LineupDisplay.tsx
      StatBars.tsx
      H2HList.tsx
      PlayerRatings.tsx
      MatchFacts.tsx
    team/
      TeamHeader.tsx
      CoachCard.tsx
      SquadGroup.tsx
      TeamInfoCard.tsx
    player/
      PlayerHeader.tsx
      MainStatsCard.tsx
      RecentMatchesList.tsx
      CareerHistory.tsx
      TraitsRadar.tsx
