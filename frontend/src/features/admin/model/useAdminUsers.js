// src/features/admin/model/useAdminUsers.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api/adminApi.js";

const QK_USERS = ["admin", "users"];
const QK_ROLES = ["admin", "roles"];

export function useAdminUsers() {
  const qc = useQueryClient();

  // Lista de usuarios (normalizados por mapUser en adminApi)
  const usersQuery = useQuery({
    queryKey: QK_USERS,
    queryFn: adminApi.getUsers,
    staleTime: 30_000,
  });

  // Lista de roles desde el backend (strings normalizados a lowercase)
  const rolesQuery = useQuery({
    queryKey: QK_ROLES,
    queryFn: adminApi.getRoles,
    staleTime: 5 * 60 * 1000,
  });

  // Cambiar estado: recibe el estado actual booleano y envía el invertido
  const toggleStatus = useMutation({
    // ⬇️ la UI te pasa { id, currentIsActive }, aquí lo invertimos
    mutationFn: ({ id, currentIsActive }) =>
      adminApi.setUserStatus({ id, nextActive: !currentIsActive }),
    onSuccess: () => {
      // Reconsultamos para mostrar exactamente lo que devuelve el backend
      qc.invalidateQueries({ queryKey: QK_USERS });
    },
  });

  // Cambiar rol primario a uno seleccionado del <Select />
  const changeRole = useMutation({
    // ⬇️ la UI te pasa { id, nextRole } directamente seleccionado
    mutationFn: ({ id, nextRole }) => adminApi.setUserRole({ id, role: nextRole }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK_USERS });
    },
  });

  return {
    usersQuery,     // .data => User[]
    rolesQuery,     // .data => string[] (roles permitidos)
    toggleStatus,   // mutate({ id, currentIsActive })
    changeRole,     // mutate({ id, nextRole })
  };
}