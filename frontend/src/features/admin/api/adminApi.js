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

  getRoles: async () => {
    const { data } = await api.get("/roles/get-roles");
    const roles = Array.isArray(data)
      ? data.map((r) => (typeof r === "string" ? r : r?.name)).filter(Boolean)
      : [];
    return roles.map((r) => String(r).toLowerCase());
  },

  /* ========= PERMISOS DE DOCENTE ========= */
  /** Obtiene permisos actuales del docente */
  getTeacherPermissions: async (teacherId) => {
    const { data } = await api.get(`/teacher/${teacherId}/permissions`);
    // backend: { message, permissions: ["teacher_editor", ...] }
    return data?.permissions || [];
  },

  /** Asigna uno o varios permisos al docente */
  assignTeacherPermissions: async ({ teacherId, permissions }) => {
    const { data } = await api.post(`/teacher/${teacherId}/permissions`, { permissions });
    // backend: { message, assigned, current }
    return data?.current || [];
  },

  /** Revoca uno o varios permisos del docente */
  revokeTeacherPermissions: async ({ teacherId, permissions }) => {
    // axios DELETE con body -> usar { data: { ... } }
    const { data } = await api.delete(`/teacher/${teacherId}/permissions`, {
      data: { permissions },
    });
    // backend: { message, revoked, current }
    return data?.current || [];
  },
};