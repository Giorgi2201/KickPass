import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import api from "../services/api";

function PublicPlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      setNotFound(false);
      try {
        const response = await api.get(`/players/${id}`);
        setProfile(response.data);
      } catch (requestError) {
        if (requestError.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(requestError.response?.data?.message || "Failed to load player profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const matchHistory = useMemo(() => {
    if (!profile) {
      return [];
    }
    if (Array.isArray(profile.matchPlayers)) {
      return profile.matchPlayers;
    }
    if (Array.isArray(profile.matchHistory)) {
      return profile.matchHistory;
    }
    return [];
  }, [profile]);

  if (loading) {
    return (
      <Card>
        <p className="text-gray-300">Loading player profile...</p>
      </Card>
    );
  }

  if (notFound) {
    return (
      <Card>
        <h1 className="text-2xl font-semibold text-white">Player not found</h1>
        <p className="mt-2 text-gray-300">
          The player profile you are looking for does not exist.
        </p>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <p className="text-red-400">{error || "Unable to display player profile."}</p>
      </Card>
    );
  }

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(10, Number(rating) || 0));
    return "★".repeat(safeRating) + "☆".repeat(10 - safeRating);
  };

  return (
    <div className="space-y-6">
      <Button variant="secondary" onClick={() => navigate(-1)}>
        Back
      </Button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <img
            src={profile.avatarUrl || "https://placehold.co/140x140?text=%E2%9A%BD"}
            alt={profile.fullName}
            className="h-28 w-28 rounded-full border border-gray-700 object-cover"
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-white">{profile.fullName}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge label={profile.position} color="green" />
              <Badge label={profile.dominantFoot} color="gray" />
            </div>
            <p className="text-sm text-gray-300">
              {profile.city}, {profile.country}
            </p>
            {profile.bio && <p className="text-sm text-gray-300">{profile.bio}</p>}
            {profile.highlightUrl && (
              <a
                href={profile.highlightUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#16a34a] underline"
              >
                Watch highlight video
              </a>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-gray-400">Total Matches</p>
          <p className="text-2xl font-semibold text-white">{profile.totalMatchesPlayed || 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400">Total Goals</p>
          <p className="text-2xl font-semibold text-white">{profile.totalGoals || 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400">Total Assists</p>
          <p className="text-2xl font-semibold text-white">{profile.totalAssists || 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400">Average Rating</p>
          <p className="text-2xl font-semibold text-white">
            {Number(profile.averageRating || 0).toFixed(1)}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold text-white">Match History</h2>
        {matchHistory.length === 0 ? (
          <p className="mt-3 text-sm text-gray-300">No match history available yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {matchHistory.map((entry, index) => {
              const match = entry.match || entry;
              return (
                <div key={`${match.id || index}`} className="rounded-md border border-gray-800 bg-black p-4">
                  <h3 className="font-semibold text-white">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {match.matchDate ? new Date(match.matchDate).toLocaleDateString() : "Date unknown"}
                    {" • "}
                    {typeof match.homeScore !== "undefined" && typeof match.awayScore !== "undefined"
                      ? `${match.homeScore} - ${match.awayScore}`
                      : "Score unavailable"}
                  </p>
                  <p className="mt-2 text-sm text-gray-300">
                    Goals: {entry.goals ?? 0} • Assists: {entry.assists ?? 0} • Cards:{" "}
                    {entry.yellowCard ? "🟨" : "—"} {entry.redCard ? "🟥" : "—"} • Minutes:{" "}
                    {entry.minutesPlayed ?? 0}
                  </p>
                  <p className="text-sm text-yellow-300">
                    {renderStars(entry.ratingOutOfTen ?? entry.rating ?? 0)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

export default PublicPlayerProfile;
