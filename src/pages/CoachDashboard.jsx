import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PlayerSearchInput from "../components/ui/PlayerSearchInput";
import { SkeletonCard } from "../components/ui/Skeleton";
import api from "../services/api";
import { toISOStringLocal, toLocalDateString } from "../utils/dates";
import { getErrorMessage } from "../utils/errors";
import { useToast } from "../context/ToastContext";

const initialMatchForm = {
  homeTeam: "",
  awayTeam: "",
  homeScore: 0,
  awayScore: 0,
  matchDate: "",
  location: "",
};

const initialPlayerForm = {
  goals: 0,
  assists: 0,
  yellowCard: false,
  redCard: false,
  minutesPlayed: 90,
  ratingOutOfTen: 1,
};

function CoachDashboard() {
  const { addToast } = useToast();
  const [matchForm, setMatchForm] = useState(initialMatchForm);
  const [matches, setMatches] = useState([]);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const [matchDetails, setMatchDetails] = useState({});
  const [playerForms, setPlayerForms] = useState({});
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [addLoadingMatchId, setAddLoadingMatchId] = useState(null);
  const [deleteLoadingMatchId, setDeleteLoadingMatchId] = useState(null);
  const [listError, setListError] = useState("");

  const loadMatches = async () => {
    setListLoading(true);
    setListError("");
    try {
      const response = await api.get("/matches/my");
      setMatches(response.data);
    } catch (error) {
      addToast(getErrorMessage(error, "Failed to load matches."), "error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMatches();
  }, []);

  const handleMatchFormChange = (event) => {
    const { name, value } = event.target;
    setMatchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMatch = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    try {
      const payload = {
        ...matchForm,
        homeScore: Number(matchForm.homeScore),
        awayScore: Number(matchForm.awayScore),
        matchDate: toISOStringLocal(matchForm.matchDate),
      };
      const response = await api.post("/matches", payload);
      const created = response.data;
      setMatches((prev) => [
        { ...created, playerCount: 0 },
        ...prev,
      ]);
      setMatchForm(initialMatchForm);
      addToast("Match created successfully.", "success");
    } catch (error) {
      addToast(getErrorMessage(error, "Failed to create match."), "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const toggleMatchDetails = async (matchId) => {
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null);
      return;
    }

    setExpandedMatchId(matchId);

    try {
      const response = await api.get(`/matches/${matchId}`);
      setMatchDetails((prev) => ({ ...prev, [matchId]: response.data }));
      setPlayerForms((prev) => ({
        ...prev,
        [matchId]: prev[matchId] || initialPlayerForm,
      }));
    } catch (error) {
      addToast(getErrorMessage(error, "Failed to load match details."), "error");
    }
  };

  const handleDeleteMatch = async (matchId) => {
    const confirmDelete = window.confirm("Delete this match?");
    if (!confirmDelete) {
      return;
    }

    setDeleteLoadingMatchId(matchId);
    setListError("");
    try {
      await api.delete(`/matches/${matchId}`);
      setMatches((prev) => prev.filter((match) => match.id !== matchId));
      if (expandedMatchId === matchId) {
        setExpandedMatchId(null);
      }
    } catch (error) {
      addToast(getErrorMessage(error, "Failed to delete match."), "error");
    } finally {
      setDeleteLoadingMatchId(null);
    }
  };

  const handlePlayerFormChange = (matchId, event) => {
    const { name, value, type, checked } = event.target;
    setPlayerForms((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || initialPlayerForm),
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handlePlayerSelect = (matchId, player) => {
    setSelectedPlayers((prev) => ({ ...prev, [matchId]: player }));
  };

  const handleAddPlayer = async (event, matchId) => {
    event.preventDefault();
    const form = playerForms[matchId] || initialPlayerForm;
    const selectedPlayer = selectedPlayers[matchId];

    if (!selectedPlayer) {
      addToast("Please select a player", "error");
      return;
    }

    setAddLoadingMatchId(matchId);

    try {
      await api.post(`/matches/${matchId}/players`, {
        playerProfileId: selectedPlayer.id,
        goals: Number(form.goals),
        assists: Number(form.assists),
        yellowCard: Boolean(form.yellowCard),
        redCard: Boolean(form.redCard),
        minutesPlayed: Number(form.minutesPlayed),
        ratingOutOfTen: Number(form.ratingOutOfTen),
      });

      const detailResponse = await api.get(`/matches/${matchId}`);
      setMatchDetails((prev) => ({ ...prev, [matchId]: detailResponse.data }));
      setPlayerForms((prev) => ({
        ...prev,
        [matchId]: initialPlayerForm,
      }));
      setSelectedPlayers((prev) => ({ ...prev, [matchId]: null }));
      await loadMatches();
    } catch (error) {
      addToast(getErrorMessage(error, "Failed to add player."), "error");
    } finally {
      setAddLoadingMatchId(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h1 className="text-2xl font-semibold text-white">Create Match</h1>
        <form onSubmit={handleCreateMatch} className="mt-4 space-y-4">
          <Input
            label="Home Team"
            name="homeTeam"
            value={matchForm.homeTeam}
            onChange={handleMatchFormChange}
            required
          />
          <Input
            label="Away Team"
            name="awayTeam"
            value={matchForm.awayTeam}
            onChange={handleMatchFormChange}
            required
          />
          <Input
            label="Home Score"
            name="homeScore"
            type="number"
            min={0}
            value={matchForm.homeScore}
            onChange={handleMatchFormChange}
            required
          />
          <Input
            label="Away Score"
            name="awayScore"
            type="number"
            min={0}
            value={matchForm.awayScore}
            onChange={handleMatchFormChange}
            required
          />
          <Input
            label="Match Date"
            name="matchDate"
            type="date"
            value={matchForm.matchDate}
            onChange={handleMatchFormChange}
            required
          />
          <Input
            label="Location"
            name="location"
            value={matchForm.location}
            onChange={handleMatchFormChange}
          />

          <Button type="submit" variant="primary" loading={createLoading}>
            Create Match
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">My Matches</h2>
        {listLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
        {!listLoading && matches.length === 0 && (
          <Card>
            <p className="text-gray-300">No matches yet. Create your first one!</p>
          </Card>
        )}
        {listError && <p className="text-sm text-red-400">{listError}</p>}

        {matches.map((match) => (
          <Card key={match.id} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
              </h3>
              <p className="text-sm text-gray-300">
                {toLocalDateString(match.matchDate)}{" "}
                {match.location ? `• ${match.location}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge label={`${match.playerCount} players`} color="blue" />
              <Button variant="secondary" onClick={() => toggleMatchDetails(match.id)}>
                {expandedMatchId === match.id ? "Close" : "View / Add Players"}
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteMatch(match.id)}
                loading={deleteLoadingMatchId === match.id}
              >
                Delete
              </Button>
            </div>

            {expandedMatchId === match.id && (
              <div className="space-y-4 border-t border-gray-800 pt-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white">Players in Match</h4>
                  {(matchDetails[match.id]?.players || []).length === 0 ? (
                    <p className="text-sm text-gray-300">No players added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {matchDetails[match.id].players.map((player, index) => (
                        <div
                          key={`${player.fullName}-${index}`}
                          className="rounded-md border border-gray-800 bg-black p-3"
                        >
                          <p className="font-medium text-white">
                            {player.fullName} ({player.position})
                          </p>
                          <p className="text-sm text-gray-300">
                            G:{player.goals} A:{player.assists} •{" "}
                            {player.yellowCard ? "🟨" : "—"} {player.redCard ? "🟥" : "—"} •{" "}
                            {player.minutesPlayed} mins • Rating {player.rating}/10
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(event) => handleAddPlayer(event, match.id)}
                  className="space-y-3 rounded-md border border-gray-800 bg-black p-4"
                >
                  <h5 className="font-medium text-white">Add Player</h5>
                  <PlayerSearchInput
                    onSelect={(player) => handlePlayerSelect(match.id, player)}
                    selectedPlayer={selectedPlayers[match.id]}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Goals"
                      name="goals"
                      type="number"
                      min={0}
                      value={playerForms[match.id]?.goals ?? 0}
                      onChange={(event) => handlePlayerFormChange(match.id, event)}
                    />
                    <Input
                      label="Assists"
                      name="assists"
                      type="number"
                      min={0}
                      value={playerForms[match.id]?.assists ?? 0}
                      onChange={(event) => handlePlayerFormChange(match.id, event)}
                    />
                    <Input
                      label="Minutes Played"
                      name="minutesPlayed"
                      type="number"
                      min={0}
                      max={120}
                      value={playerForms[match.id]?.minutesPlayed ?? 90}
                      onChange={(event) => handlePlayerFormChange(match.id, event)}
                    />
                    <Input
                      label="Rating out of 10"
                      name="ratingOutOfTen"
                      type="number"
                      min={1}
                      max={10}
                      value={playerForms[match.id]?.ratingOutOfTen ?? 1}
                      onChange={(event) => handlePlayerFormChange(match.id, event)}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-200">
                      <input
                        type="checkbox"
                        name="yellowCard"
                        checked={Boolean(playerForms[match.id]?.yellowCard)}
                        onChange={(event) => handlePlayerFormChange(match.id, event)}
                        className="accent-[#16a34a]"
                      />
                      Yellow Card
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-200">
                      <input
                        type="checkbox"
                        name="redCard"
                        checked={Boolean(playerForms[match.id]?.redCard)}
                        onChange={(event) => handlePlayerFormChange(match.id, event)}
                        className="accent-[#16a34a]"
                      />
                      Red Card
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={addLoadingMatchId === match.id}
                  >
                    Add to Match
                  </Button>
                </form>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CoachDashboard;
