// src/features/admin/model/useAdminUsers.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api/adminApi.js";

export function useAdminUsers() {
  const qc = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminApi.getUsers,
    staleTime: 30_000,
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, currentStatus }) =>
      adminApi.setUserStatus({
        id,
        status: currentStatus === "active" ? "blocked" : "active",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const toggleRole = useMutation({
    mutationFn: ({ id, currentRole }) =>
      adminApi.setUserRole({
        id,
        role: currentRole === "admin" ? "student" : "admin",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  return { usersQuery, toggleStatus, toggleRole };
}
