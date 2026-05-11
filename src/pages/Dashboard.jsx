import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import api from "../services/api";
import { COACH, PLAYER, SCOUT } from "../utils/roles";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/errors";

function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [freshUser, setFreshUser] = useState(user);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [playerProfileMissing, setPlayerProfileMissing] = useState(false);
  const [coachMatchesCount, setCoachMatchesCount] = useState(0);
  const [uniquePlayersCount, setUniquePlayersCount] = useState(0);
  const [totalPlayersCount, setTotalPlayersCount] = useState(0);
  const [availablePlayersCount, setAvailablePlayersCount] = useState(0);
  const [positionBreakdown, setPositionBreakdown] = useState({});
  const [loading, setLoading] = useState(true);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
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
            const statsResponse = await api.get("/matches/my/stats");
            setCoachMatchesCount(statsResponse.data.totalMatches);
            setUniquePlayersCount(statsResponse.data.uniquePlayers);
          } catch {
            setError("Failed to load coach stats.");
          }
        }

        if (meResponse.data.role === SCOUT) {
          try {
            const playersResponse = await api.get("/players/search");
            const players = playersResponse.data;
            setTotalPlayersCount(players.length);
            setAvailablePlayersCount(players.length);

            const breakdown = players.reduce((acc, player) => {
              acc[player.position] = (acc[player.position] || 0) + 1;
              return acc;
            }, {});
            setPositionBreakdown(breakdown);
          } catch {
            setError("Failed to load scout stats.");
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

  const handleToggleAvailability = async () => {
    if (!playerProfile) return;

    setTogglingAvailability(true);
    try {
      await api.put("/players/profile", {
        position: playerProfile.position,
        dominantFoot: playerProfile.dominantFoot,
        age: playerProfile.age,
        city: playerProfile.city,
        country: playerProfile.country,
        bio: playerProfile.bio,
        highlightUrl: playerProfile.highlightUrl,
        avatarUrl: playerProfile.avatarUrl,
        isAvailable: !playerProfile.isAvailable,
      });

      setPlayerProfile((prev) =>
        prev
          ? {
              ...prev,
              isAvailable: !prev.isAvailable,
            }
          : prev
      );
    } catch (toggleError) {
      addToast(getErrorMessage(toggleError), "error");
    } finally {
      setTogglingAvailability(false);
    }
  };

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
            <h2 className="text-xl font-semibold text-white">My Visibility</h2>
            {loading ? (
              <div className="mt-3 space-y-3">
                <Skeleton width="10rem" height="1.75rem" />
                <Skeleton width="7rem" height="2.5rem" />
              </div>
            ) : playerProfileMissing ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-300">
                  Create your profile first to manage visibility.
                </p>
                <Link to="/profile" className="inline-block text-[#16a34a]">
                  Go to profile
                </Link>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {playerProfile?.isAvailable ? (
                  <Badge label="Open to Opportunities" color="green" />
                ) : (
                  <Badge label="Not Available" color="gray" />
                )}

                <p className="text-sm text-gray-300">
                  {playerProfile?.isAvailable
                    ? "Scouts can currently find your profile in search results."
                    : "Your profile is hidden from scout searches."}
                </p>

                <Button
                  variant={playerProfile?.isAvailable ? "danger" : "primary"}
                  onClick={handleToggleAvailability}
                  loading={togglingAvailability}
                >
                  {playerProfile?.isAvailable ? "Go Unavailable" : "Go Available"}
                </Button>
              </div>
            )}
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
            <h2 className="text-xl font-semibold text-white">Match Center</h2>
            <p className="mt-2 text-sm text-gray-300">
              Create matches, log player stats and manage your full match history.
            </p>
            <Link to="/coach" className="mt-4 inline-block text-[#16a34a]">
              Open Match Center
            </Link>
          </Card>

          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Total Matches</h2>
            <p className="mt-2 text-sm text-gray-400">Matches you have recorded on KickPass.</p>
            {loading ? (
              <Skeleton width="4rem" height="2.5rem" className="mt-1" />
            ) : (
              <p className="mt-1 text-4xl font-bold text-white">{coachMatchesCount}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">matches logged</p>
          </Card>

          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Players Coached</h2>
            <p className="mt-2 text-sm text-gray-400">
              Unique players that have appeared in your matches.
            </p>
            {loading ? (
              <Skeleton width="4rem" height="2.5rem" className="mt-1" />
            ) : (
              <p className="mt-1 text-4xl font-bold text-white">{uniquePlayersCount}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">unique players</p>
          </Card>
        </div>
      )}

      {role === SCOUT && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Find Players</h2>
            <p className="mt-2 text-sm text-gray-300">
              Search and filter through verified amateur players by position, age, location and
              more.
            </p>
            <Link to="/scout" className="mt-4 inline-block text-[#16a34a]">
              Open Player Search
            </Link>
          </Card>

          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Available Players</h2>
            <p className="mt-2 text-sm text-gray-300">Players currently open to opportunities.</p>
            {loading ? (
              <Skeleton width="4rem" height="2.5rem" className="mt-1" />
            ) : (
              <p className="mt-1 text-4xl font-bold text-white">{availablePlayersCount}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {loading
                ? "open to opportunities"
                : totalPlayersCount === 0
                  ? "No players registered yet"
                  : "open to opportunities"}
            </p>
          </Card>

          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Player Pool</h2>
            <p className="mt-2 text-sm text-gray-300">
              Breakdown of available players by position.
            </p>
            {loading ? (
              <div className="mt-3 space-y-2">
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="100%" height="1rem" />
              </div>
            ) : Object.keys(positionBreakdown).length === 0 ? (
              <p className="mt-3 text-sm text-gray-400">No players available yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {Object.entries(positionBreakdown).map(([pos, count]) => (
                  <div key={pos} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{pos}</span>
                    <Badge label={count.toString()} color="green" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="border-gray-800 transition hover:border-[#16a34a]">
            <h2 className="text-xl font-semibold text-white">Pro Tip</h2>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#16a34a]">✓</span>
                <span className="text-sm text-gray-300">Filter by position to find the right fit</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#16a34a]">✓</span>
                <span className="text-sm text-gray-300">Check match history for verified stats</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#16a34a]">✓</span>
                <span className="text-sm text-gray-300">Look for players with highlight reels</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
