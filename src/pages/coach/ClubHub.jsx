import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { getMyClub, createClub, addSquadMember, removeSquadMember } from "../../services/clubService";
import api from "../../services/api";

function ClubHub() {
  const { addToast } = useToast();
  const [club, setClub] = useState(null);
  const [squad, setSquad] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", city: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const clubData = await getMyClub();
      setClub(clubData);
      if (clubData.squad) {
        setSquad(clubData.squad);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setClub(null);
        setSquad([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      const response = await createClub(formData);
      setClub(response);
      setSquad([]);
      addToast("Club created successfully!", "success");
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to create club", "error");
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      try {
        const response = await api.get("/players/search", { params: { name: query } });
        setSearchResults(response.data || []);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddPlayer = async (playerProfileId) => {
    try {
      await addSquadMember(playerProfileId);
      addToast("Player added to squad!", "success");
      await loadData();
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to add player", "error");
    }
  };

  const handleRemovePlayer = async (squadMemberId) => {
    try {
      await removeSquadMember(squadMemberId);
      addToast("Player removed from squad", "success");
      await loadData();
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to remove player", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Club</h2>
          <p className="text-gray-400 mb-6">You need to register your club before building a squad.</p>
          
          <form onSubmit={handleCreateClub} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Club Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
              <textarea 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none min-h-[100px]"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-[#16a34a] hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4">
              Create Club
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      {/* Club Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{club.name}</h2>
        <p className="text-gray-400">{club.city}</p>
        {club.description && <p className="text-gray-400 mt-2">{club.description}</p>}
      </div>

      {/* Player Search & Add */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Add Players to Squad</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search players by name..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto">
              {searchResults.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 border-b border-gray-700 last:border-0">
                  <div>
                    <p className="text-white font-medium">{player.fullName}</p>
                    <p className="text-gray-400 text-sm">{player.position} • {player.age} years</p>
                  </div>
                  <button
                    onClick={() => handleAddPlayer(player.id)}
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors"
                  >
                    Add to Squad
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Squad List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Squad ({squad.length})</h3>
        {squad.length === 0 ? (
          <p className="text-gray-400">Your squad is empty. Search for players above to add them.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {squad.map((member) => (
              <div key={member.squadMemberId} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{member.fullName}</p>
                  <p className="text-gray-400 text-sm">{member.position} • {member.age} years</p>
                </div>
                <button
                  onClick={() => handleRemovePlayer(member.squadMemberId)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-1 rounded-md transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubHub;
