import { api } from "@/api/axiosInstance";

export const profileApi = {
  me: async () => {
    const { data } = await api.get("/api/profile");
    return data; 
  },

  update: async (payload) => {
    const { data } = await api.patch("/api/profile", payload);
    return data;
  },
};