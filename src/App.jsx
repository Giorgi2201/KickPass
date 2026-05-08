import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PlayerProfile from "./pages/PlayerProfile";
import CoachDashboard from "./pages/CoachDashboard";
import ScoutSearch from "./pages/ScoutSearch";
import PublicPlayerProfile from "./pages/PublicPlayerProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { COACH, PLAYER } from "./utils/roles";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[PLAYER]}>
                <Layout>
                  <PlayerProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach"
            element={
              <ProtectedRoute allowedRoles={[COACH]}>
                <Layout>
                  <CoachDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scout"
            element={
              <ProtectedRoute>
                <Layout>
                  <ScoutSearch />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/players/:id"
            element={
              <Layout>
                <PublicPlayerProfile />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
