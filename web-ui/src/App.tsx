import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LeaguePage from "./pages/LeaguePage";
import MatchDetailPage from "./pages/MatchDetailPage";

export default function App() {
  const { admin, token, logout } = useAuth();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 style={{ margin: 0 }}>FotMob Clone</h1>
        </Link>
        <nav>
          {admin ? (
            <span>
              Welcome, {admin.name}
              {admin.picture && <img src={admin.picture} alt="" width={24} height={24} style={{ borderRadius: "50%", margin: "0 0.5rem", verticalAlign: "middle" }} />}
              <button onClick={logout} style={{ marginLeft: "0.5rem" }}>Logout</button>
            </span>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={token ? <DashboardPage /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/leagues/:id" element={<LeaguePage />} />
        <Route path="/matches/:id" element={<MatchDetailPage />} />
      </Routes>
    </div>
  );
}
