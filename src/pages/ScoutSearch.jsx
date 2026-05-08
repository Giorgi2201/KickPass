import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import api from "../services/api";

const initialFilters = {
  position: "",
  dominantFoot: "",
  city: "",
  country: "",
  minAge: "",
  maxAge: "",
};

function ScoutSearch() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlayers = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/players/search", { params });
      setPlayers(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load players.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value;
      }
    });
    await loadPlayers(params);
  };

  const handleClear = async () => {
    setFilters(initialFilters);
    await loadPlayers();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold text-white">Scout Search</h1>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="position" className="text-sm font-medium text-gray-200">
              Position
            </label>
            <select
              id="position"
              name="position"
              value={filters.position}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
            >
              <option value="">All</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="dominantFoot" className="text-sm font-medium text-gray-200">
              Dominant Foot
            </label>
            <select
              id="dominantFoot"
              name="dominantFoot"
              value={filters.dominantFoot}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
            >
              <option value="">All</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <Input
            label="City"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="City"
          />

          <Input
            label="Country"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            placeholder="Country"
          />

          <Input
            label="Min Age"
            name="minAge"
            type="number"
            value={filters.minAge}
            onChange={handleFilterChange}
          />

          <Input
            label="Max Age"
            name="maxAge"
            type="number"
            value={filters.maxAge}
            onChange={handleFilterChange}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleSearch} loading={loading}>
            Search
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={loading}>
            Clear
          </Button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </Card>

      {!loading && <p className="text-sm text-gray-300">Showing {players.length} players</p>}

      {loading ? (
        <Card>
          <p className="text-gray-300">Loading players...</p>
        </Card>
      ) : players.length === 0 ? (
        <Card>
          <p className="text-gray-300">No players found matching your search</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => (
            <Card key={player.id} className="space-y-3">
              <img
                src={player.avatarUrl || "https://placehold.co/100x100?text=%E2%9A%BD"}
                alt={player.fullName}
                className="h-20 w-20 rounded-full border border-gray-700 object-cover"
              />
              <h2 className="text-lg font-semibold text-white">{player.fullName}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge label={player.position} color="green" />
                <Badge label={player.dominantFoot} color="gray" />
              </div>
              <p className="text-sm text-gray-300">
                Age: {player.age} • {player.city}, {player.country}
              </p>
              <p className="text-sm text-gray-400">
                {player.bio
                  ? player.bio.length > 80
                    ? `${player.bio.slice(0, 80)}...`
                    : player.bio
                  : "No bio available"}
              </p>
              <Button variant="primary" onClick={() => navigate(`/players/${player.id}`)}>
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScoutSearch;
