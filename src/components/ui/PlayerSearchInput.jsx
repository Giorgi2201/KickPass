import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/errors";

function PlayerSearchInput({ onSelect, selectedPlayer }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      api
        .get("/players/search")
        .then((response) => {
          const filtered = response.data.filter((player) =>
            player.fullName.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredPlayers(filtered);
          setShowDropdown(true);
        })
        .catch((err) => {
          addToast(getErrorMessage(err, "Failed to load players"), "error");
          setFilteredPlayers([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setFilteredPlayers([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    if (selectedPlayer) {
      onSelect(null);
    }
  };

  const handleSelect = (player) => {
    onSelect(player);
    setSearchTerm(player.fullName);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onSelect(null);
    setSearchTerm("");
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="space-y-2">
      <label htmlFor="player-search-input" className="block text-sm font-medium text-gray-200">
        Search Player by Name
      </label>
      <div className="relative">
        <input
          id="player-search-input"
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Type to search..."
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
        />
        {selectedPlayer && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-green-900/40 px-2.5 py-1 text-xs font-medium text-green-300">
              <svg
                className="mr-1 h-3 w-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {selectedPlayer.fullName}
            </span>
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selected player"
              className="text-sm text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        )}
        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-700 bg-gray-900 shadow-lg">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-400">Loading...</div>
            ) : filteredPlayers.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                No players found
              </div>
            ) : (
              <ul className="max-h-48 overflow-auto py-1" role="listbox">
                {filteredPlayers.map((player) => (
                  <li
                    key={player.id}
                    role="option"
                    aria-selected={selectedPlayer?.id === player.id}
                    onClick={() => handleSelect(player)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(player);
                      }
                    }}
                    tabIndex={0}
                    className="cursor-pointer px-3 py-2 text-sm text-white hover:bg-gray-800"
                  >
                    {player.fullName} • {player.position} • {player.city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerSearchInput;
