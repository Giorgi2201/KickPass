import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import api from "../services/api";
import { COACH, PLAYER, SCOUT } from "../utils/roles";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [freshUser, setFreshUser] = useState(user);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [playerProfileMissing, setPlayerProfileMissing] = useState(false);
  const [coachMatchesCount, setCoachMatchesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = freshUser?.role || user?.role;

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const meResponse = await api.get("/auth/me");
        setFreshUser(meResponse.data);

        if (meResponse.data.role === PLAYER) {
          try {
            const profileResponse = await api.get("/players/profile/me");
            const profile = profileResponse.data;
            if (profile) {
              setPlayerProfile(profile);
              setPlayerProfileMissing(false);
            } else {
              setPlayerProfile(null);
              setPlayerProfileMissing(true);
            }
          } catch {
            setError("Failed to load player stats.");
          }
        }

        if (meResponse.data.role === COACH) {
          try {
            const matchesResponse = await api.get("/matches/my");
            setCoachMatchesCount(matchesResponse.data.length);
          } catch {
            setError("Failed to load coach stats.");
          }
        }
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const playerStats = useMemo(() => {
    if (!playerProfile) {
      return {
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0,
        avgRating: 0,
      };
    }

    const matchPlayers = Array.isArray(playerProfile.matchPlayers)
      ? playerProfile.matchPlayers
      : [];
    const totalMatches = matchPlayers.length;
    const totalGoals = matchPlayers.reduce(
      (sum, matchPlayer) => sum + (matchPlayer.goals || 0),
      0
    );
    const totalAssists = matchPlayers.reduce(
      (sum, matchPlayer) => sum + (matchPlayer.assists || 0),
      0
    );
    const avgRating = totalMatches
      ? (
          matchPlayers.reduce(
            (sum, matchPlayer) => sum + (matchPlayer.ratingOutOfTen || 0),
            0
          ) / totalMatches
        ).toFixed(1)
      : "0.0";

    return { totalMatches, totalGoals, totalAssists, avgRating };
  }, [playerProfile]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">
          Welcome back, {freshUser?.fullName || "KickPass User"}
        </h1>
        {role && <Badge label={role} color="green" />}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {role === PLAYER && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">My Profile</h2>
            <p className="mt-2 text-sm text-gray-300">Manage your player profile.</p>
            <Link to="/profile" className="mt-4 inline-block text-[#16a34a]">
              Go to profile
            </Link>
          </Card>

          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Find Scouts</h2>
            <p className="mt-2 text-sm text-gray-300">Browse scouts and opportunities.</p>
            <Link to="/scout" className="mt-4 inline-block text-[#16a34a]">
              Explore search
            </Link>
          </Card>

          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">My Stats</h2>
            {loading ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-md border border-gray-800 bg-black p-3">
                    <Skeleton width="60%" className="mb-1" />
                    <Skeleton width="2rem" height="1.5rem" />
                  </div>
                ))}
              </div>
            ) : playerProfileMissing ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-300">
                  Complete your profile to see stats
                </p>
                <Link to="/profile">
                  <Button variant="primary">Go to Profile</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-gray-800 bg-black p-3">
                  <p className="text-xs text-gray-400">Total Matches</p>
                  <p className="text-lg text-white">{playerStats.totalMatches}</p>
                </div>
                <div className="rounded-md border border-gray-800 bg-black p-3">
                  <p className="text-xs text-gray-400">Total Goals</p>
                  <p className="text-lg text-white">{playerStats.totalGoals}</p>
                </div>
                <div className="rounded-md border border-gray-800 bg-black p-3">
                  <p className="text-xs text-gray-400">Total Assists</p>
                  <p className="text-lg text-white">{playerStats.totalAssists}</p>
                </div>
                <div className="rounded-md border border-gray-800 bg-black p-3">
                  <p className="text-xs text-gray-400">Avg Rating</p>
                  <p className="text-lg text-white">{playerStats.avgRating}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {role === COACH && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Create Match</h2>
            <p className="mt-2 text-sm text-gray-300">
              Record a new match and assign player stats.
            </p>
            <Link to="/coach" className="mt-4 inline-block text-[#16a34a]">
              Open coach dashboard
            </Link>
          </Card>
          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">My Matches</h2>
            <p className="mt-2 text-sm text-gray-300">
              View, edit, and manage your created matches.
            </p>
            <Link to="/coach" className="mt-4 inline-block text-[#16a34a]">
              View matches
            </Link>
          </Card>
          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Stats</h2>
            <p className="mt-2 text-sm text-gray-400">Total matches created</p>
            {loading ? (
              <Skeleton width="4rem" height="2.5rem" className="mt-1" />
            ) : (
              <p className="mt-1 text-3xl font-bold text-white">{coachMatchesCount}</p>
            )}
          </Card>
        </div>
      )}

      {role === SCOUT && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Search Players</h2>
            <p className="mt-2 text-sm text-gray-300">
              Find players and view their complete public profiles.
            </p>
            <Link to="/scout" className="mt-4 inline-block text-[#16a34a]">
              Open scout search
            </Link>
          </Card>
          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Tip</h2>
            <p className="mt-2 text-sm text-gray-300">
              Use filters to narrow down players by position, age, and location
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
