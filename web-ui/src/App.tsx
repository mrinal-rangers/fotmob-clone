import { Routes, Route } from "react-router-dom";
import { RootLayout } from "@/components/layout";
import { HomePage } from "@/pages/HomePage";
import { LeaguesPage } from "@/pages/LeaguesPage";
import { LeagueLayout, LeagueOverviewPage, LeagueTablePage, LeagueFixturesPage, LeagueStatsPage, LeagueTransfersPage, LeagueSeasonsPage, LeagueNewsPage } from "@/pages/league";
import { TeamLayout, TeamOverviewPage, TeamSquadPage, TeamFixturesPage, TeamTablePage } from "@/pages/team";
import { MatchDetailPage } from "@/pages/MatchDetailPage";
import { PlayerDetailPage } from "@/pages/PlayerDetailPage";
import { MatchesPage } from "@/pages/MatchesPage";
import { NewsPage } from "@/pages/NewsPage";
import { TransfersPage } from "@/pages/TransfersPage";
import { SearchPage } from "@/pages/SearchPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { PageError } from "@/components/shared/ErrorStates";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="leagues" element={<LeaguesPage />} />
        <Route path="leagues/:id" element={<LeagueLayout />}>
          <Route index element={<LeagueOverviewPage />} />
          <Route path="overview" element={<LeagueOverviewPage />} />
          <Route path="table" element={<LeagueTablePage />} />
          <Route path="fixtures" element={<LeagueFixturesPage />} />
          <Route path="stats" element={<LeagueStatsPage />} />
          <Route path="transfers" element={<LeagueTransfersPage />} />
          <Route path="seasons" element={<LeagueSeasonsPage />} />
          <Route path="news" element={<LeagueNewsPage />} />
        </Route>
        <Route path="teams/:id" element={<TeamLayout />}>
          <Route index element={<TeamOverviewPage />} />
          <Route path="overview" element={<TeamOverviewPage />} />
          <Route path="squad" element={<TeamSquadPage />} />
          <Route path="fixtures" element={<TeamFixturesPage />} />
          <Route path="table" element={<TeamTablePage />} />
        </Route>
        <Route path="matches" element={<MatchesPage />} />
        <Route path="matches/:id" element={<MatchDetailPage />} />
        <Route path="players/:id" element={<PlayerDetailPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="transfers" element={<TransfersPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<PageError title="Page Not Found" description="The page you're looking for doesn't exist." />} />
      </Route>
    </Routes>
  );
}
