// src/pages/admin/AdminDashboardPage.jsx
import { Box, Container } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import AdminBanner from "@/features/admin/ui/AdminBanner";
import AdminUsersTable from "@/features/admin/ui/AdminUsersTable";
import { useAdminUsers } from "@/features/admin/model/useAdminUsers";

export default function DashboardPage() {
  console.log("Componente renderizado");
  console.log("🟣 AdminDashboardPage RENDERIZANDO");

  const qc = useQueryClient();
  console.log("🟣 QueryClient OK");

  const { enqueueSnackbar } = useSnackbar();
  console.log("🟣 useSnackbar OK");

  const { usersQuery, rolesQuery, toggleStatus, changeRole } = useAdminUsers();
  console.log("🟣 useAdminUsers OK", {
    usersData: usersQuery.data,
    usersLoading: usersQuery.isLoading,
    rolesData: rolesQuery.data,
  });
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <AdminBanner />
      <Container maxWidth="lg">
        <AdminUsersTable
          users={usersQuery.data ?? []}
          loading={usersQuery.isLoading || usersQuery.isFetching}
          allowedRoles={rolesQuery.data ?? []}
          onToggleStatus={(id, currentIsActive) =>
            toggleStatus.mutate(
              { id, currentIsActive },
              {
                onSuccess: () =>
                  enqueueSnackbar("Estado actualizado", { variant: "success" }),
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
                  enqueueSnackbar("Rol actualizado", { variant: "success" }),
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
