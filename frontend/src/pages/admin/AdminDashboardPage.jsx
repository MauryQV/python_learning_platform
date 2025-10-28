// src/pages/admin/AdminDashboardPage.jsx
import { Box, Container } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import AdminBanner from "@/features/admin/ui/AdminBanner";
import AdminUsersTable from "@/features/admin/ui/AdminUsersTable";
import { useAdminUsers } from "@/features/admin/model/useAdminUsers";

export default function DashboardPage() {
  const qc = useQueryClient();
  const { usersQuery, toggleRole, toggleStatus } = useAdminUsers();

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
          onRefresh={handleRefresh}
          onToggleRole={(id, currentRole) => toggleRole.mutate({ id, currentRole })}
          onToggleStatus={(id, currentStatus) => toggleStatus.mutate({ id, currentStatus })}
        />
      </Container>
    </Box>
  );
}

