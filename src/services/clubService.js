import api from "./api";

export const getMyClub = async () => {
  const response = await api.get("/clubs/my");
  return response.data;
};

export const createClub = async (data) => {
  const response = await api.post("/clubs", data);
  return response.data;
};

export const updateClub = async (data) => {
  const response = await api.put("/clubs/my", data);
  return response.data;
};

export const addSquadMember = async (playerProfileId) => {
  const response = await api.post("/clubs/my/squad", { playerProfileId });
  return response.data;
};

export const removeSquadMember = async (squadMemberId) => {
  await api.delete(`/clubs/my/squad/${squadMemberId}`);
};

export const deleteClub = async () => {
  await api.delete("/clubs/my");
};
