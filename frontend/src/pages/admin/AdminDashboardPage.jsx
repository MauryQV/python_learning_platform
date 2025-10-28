// src/pages/admin/AdminDashboardPage.jsx
import { Box, Container } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import AdminBanner from "@/features/admin/ui/AdminBanner";
import AdminUsersTable from "@/features/admin/ui/AdminUsersTable";
import { useAdminUsers } from "@/features/admin/model/useAdminUsers";

export default function DashboardPage() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // ⬇️ ahora también traemos los roles del backend y el cambio de rol
  const { usersQuery, rolesQuery, toggleStatus, changeRole } = useAdminUsers();

  const handleRefresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <AdminBanner />
      <Container maxWidth="lg">
        <AdminUsersTable
          users={usersQuery.data ?? []}
          loading={usersQuery.isLoading || usersQuery.isFetching}
          allowedRoles={rolesQuery.data ?? []} // 👈 roles desde backend
          onRefresh={handleRefresh}
          // Espera (id, currentIsActive:boolean)
          onToggleStatus={(id, currentIsActive) =>
            toggleStatus.mutate(
              { id, currentIsActive },
              {
                onSuccess: () =>
                  enqueueSnackbar("Estado actualizado ✅", { variant: "success" }),
                onError: (e) =>
                  enqueueSnackbar(
                    `No se pudo actualizar el estado: ${e?.message ?? "Error"}`,
                    { variant: "error" }
                  ),
              }
            )
          }
          // Espera (id, nextRole:string)
          onChangeRole={(id, nextRole) =>
            changeRole.mutate(
              { id, nextRole },
              {
                onSuccess: () =>
                  enqueueSnackbar("Rol actualizado ✅", { variant: "success" }),
                onError: (e) =>
                  enqueueSnackbar(
                    `No se pudo cambiar el rol: ${e?.message ?? "Error"}`,
                    { variant: "error" }
                  ),
              }
            )
          }
        />
      </Container>
    </Box>
  );
}