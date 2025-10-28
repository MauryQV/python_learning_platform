import { api } from "@/api/axiosInstance";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:2999";

export const profileApi = {
  me: async () => {
    const { data } = await api.get(`${BASE}/api/profile/me`);
    
    return data;
  },
  update: async (payload) => {
    
    const { data } = await api.patch(`${BASE}/api/profile`, payload);
    return data;
  },
};
