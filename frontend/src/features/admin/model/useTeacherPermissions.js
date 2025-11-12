// src/features/admin/model/useTeacherPermissions.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api/adminApi";

/**
 * Maneja los permisos de un docente:
 * - Lee permisos actuales
 * - Asigna / Revoca permisos individuales
 * - setPermissions(next) hace diff y asigna/revoca lo necesario
 */
export function useTeacherPermissions(teacherId) {
  const qc = useQueryClient();
  const QK = ["teacher", "permissions", teacherId];

  const currentQuery = useQuery({
    queryKey: QK,
    queryFn: () => adminApi.getTeacherPermissions(teacherId),
    enabled: !!teacherId,
    staleTime: 30_000,
  });

  const assign = useMutation({
    mutationFn: (permissions) =>
      adminApi.assignTeacherPermissions({ teacherId, permissions }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });

  const revoke = useMutation({
    mutationFn: (permissions) =>
      adminApi.revokeTeacherPermissions({ teacherId, permissions }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });

  /** Setea una lista final de permisos: hace diff contra los actuales */
  const setPermissions = async (nextList) => {
    const curr = currentQuery.data ?? [];
    const want = Array.from(new Set((nextList ?? []).map(String)));

    const toAssign = want.filter((p) => !curr.includes(p));
    const toRevoke = curr.filter((p) => !want.includes(p));

    // Ejecuta en el orden correcto
    if (toAssign.length) await assign.mutateAsync(toAssign);
    if (toRevoke.length) await revoke.mutateAsync(toRevoke);
  };

  return {
    currentQuery, // .data => string[]
    assign,
    revoke,
    setPermissions,
  };
}
