// src/features/admin/api/adminApi.js
import { api } from "@/api/axiosInstance";
import { mapUser } from "@/features/admin/lib/userMappers";

export const adminApi = {
  getUsers: async () => {
    const { data } = await api.get("/admin/users"); 
    const list = Array.isArray(data) ? data : Array.isArray(data?.users) ? data.users : [];
    return list.map(mapUser);
  },

  setUserStatus: async ({ id, nextActive }) => {
    const status = nextActive ? "active" : "blocked";
    const { data } = await api.patch(`/admin/users/${id}/status`, { status });
    const updated = data?.user ?? data ?? { userId: id, status };
    return mapUser(updated);
  },

  setUserRole: async ({ id, role }) => {
    const { data } = await api.patch(`/admin/users/${id}/role`, { role });
    const updated = data?.user ?? data ?? { userId: id, role };
    return mapUser(updated);
  },
};

