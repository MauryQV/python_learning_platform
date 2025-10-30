import api from "@/api/axiosInstance";

export const profileApi = {
  me: async () => {
    const { data } = await api.get("/profile");
    return data;
  },
  update: async (payload) => {
    const { data } = await api.put("/profile", payload);
    return data;
  },
};