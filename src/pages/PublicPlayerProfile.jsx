import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import { Skeleton } from "../components/ui/Skeleton";
import api from "../services/api";
import { getErrorMessage } from "../utils/errors";

function isValidVideoUrl(url) {
  if (!url) return false;
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(url);
}

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
          setError(getErrorMessage(requestError, "Failed to load player profile."));
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
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>

        {/* Profile Header Skeleton */}
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Skeleton width="7rem" height="7rem" rounded="rounded-full" />
            <div className="space-y-3 flex-1">
              <Skeleton width="60%" height="2rem" />
              <div className="flex gap-2">
                <Skeleton width="5rem" height="1.5rem" rounded="rounded-full" />
                <Skeleton width="5rem" height="1.5rem" rounded="rounded-full" />
              </div>
              <Skeleton width="40%" />
              <Skeleton width="80%" />
            </div>
          </div>
        </Card>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <Skeleton width="50%" className="mb-2" />
              <Skeleton width="3rem" height="2rem" />
            </Card>
          ))}
        </div>

        {/* Match History Skeleton */}
        <Card>
          <Skeleton width="40%" height="1.75rem" className="mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-md border border-gray-800 bg-black p-4">
                <Skeleton width="70%" className="mb-2" />
                <Skeleton width="40%" className="mb-2" />
                <Skeleton width="60%" />
              </div>
            ))}
          </div>
        </Card>
      </div>
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
          <Avatar url={profile.avatarUrl} name={profile.fullName} size={112} />
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
            {isValidVideoUrl(profile.highlightUrl) && (
              <a
                href={profile.highlightUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#16a34a] underline"
              >
                ▶ Watch highlight video
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
