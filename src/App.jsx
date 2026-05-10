import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PlayerProfile from "./pages/PlayerProfile";
import CoachDashboard from "./pages/CoachDashboard";
import ScoutSearch from "./pages/ScoutSearch";
import PublicPlayerProfile from "./pages/PublicPlayerProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { COACH, PLAYER, SCOUT } from "./utils/roles";

function ErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <h1 className="mb-4 text-2xl font-semibold text-white">Something went wrong.</h1>
      <p className="mb-6 text-gray-400">Please refresh the page.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-md bg-[#16a34a] px-6 py-2 font-medium text-white hover:bg-green-600"
      >
        Refresh
      </button>
    </div>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <h1 className="text-4xl font-bold text-[#16a34a]">KickPass</h1>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Sentry.ErrorBoundary fallback={ErrorFallback}>
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
              <ProtectedRoute allowedRoles={[SCOUT]}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
