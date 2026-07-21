import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { setTokenProvider } from "@/lib/api";
import { useEffect } from "react";
import { RootLayout } from "@/layouts/root-layout";
import { LoginPage } from "@/pages/LoginPage";
import { HomePage } from "@/pages/HomePage";
import { LeaguesPage } from "@/pages/LeaguesPage";
import { LeagueDetailPage } from "@/pages/LeagueDetailPage";
import { MatchDetailPage } from "@/pages/MatchDetailPage";
import { TeamDetailPage } from "@/pages/TeamDetailPage";
import { FollowingPage } from "@/pages/FollowingPage";
import { SettingsPage } from "@/pages/SettingsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  return <RootLayout>{children}</RootLayout>;
}

export default function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenProvider(() => getToken({ template: undefined }));
  }, [getToken]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/leagues" element={<ProtectedRoute><LeaguesPage /></ProtectedRoute>} />
      <Route path="/leagues/:id" element={<ProtectedRoute><LeagueDetailPage /></ProtectedRoute>} />
      <Route path="/matches/:id" element={<ProtectedRoute><MatchDetailPage /></ProtectedRoute>} />
      <Route path="/teams/:id" element={<ProtectedRoute><TeamDetailPage /></ProtectedRoute>} />
      <Route path="/following" element={<ProtectedRoute><FollowingPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    </Routes>
  );
}
