// src/features/admin/ui/AdminUsersTable.jsx
import React, { memo } from "react";
import {
  Paper, Box, Typography, IconButton, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell,
  Chip, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

const YELLOW = "#F6D458";

/* ---------- Roles helpers ---------- */
const getAllRoles = (user) => {
  const r = user?.roles;
  if (Array.isArray(r)) {
    return r
      .map((it) =>
        typeof it === "string"
          ? it
          : it?.name || it?.role?.name || it?.Role?.name || it?.roleName || ""
      )
      .filter(Boolean)
      .map((x) => String(x).toLowerCase());
  }
  if (typeof user?.role === "string") return [user.role.toLowerCase()];
  return [];
};

const getPrimaryRole = (user) => {
  if (typeof user?.role === "string" && user.role) return user.role.toLowerCase();
  const roles = getAllRoles(user);
  if (roles.includes("admin")) return "admin";
  return roles[0] || "user";
};

const roleColor = (role) => {
  switch (String(role).toLowerCase()) {
    case "admin":
      return YELLOW;
    case "teacher":
    case "instructor":
      return "#B2FF59";
    case "moderator":
      return "#80DEEA";
    case "student":
    case "learner":
      return "#e0e0e0";
    default:
      return "#f1f1f1";
  }
};

const displayName = (u) => {
  const name = [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim();
  return name || "Sin nombre";
};

/* ---------------- UI ---------------- */
function AdminUsersTable({
  users,
  loading,
  onRefresh,
  onToggleStatus,     // (id, currentIsActive:boolean)
  onChangeRole,       // (id, nextRole:string)
  allowedRoles = [],
  loadingRoles = false,
  isUpdatingId = null
}) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Lista de Usuarios
        </Typography>
        <IconButton onClick={onRefresh} color="primary" aria-label="Refrescar">
          <RefreshIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f9f9f9" }}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Roles</strong></TableCell>
                <TableCell width={260}><strong>Cambiar rol</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => {
                  const id = user?.userId ?? user?.id ?? user?._id;
                  console.log("Usuario:", id, "→ status:", user.status, "statusNormalized:", user.statusNormalized, "isActive:", user.isActive);
                  const roles = getAllRoles(user);
                  const primaryRole = getPrimaryRole(user);

                  // 🔹 usa exactamente lo que trae el backend
                  const statusText = (user?.status ?? user?.statusNormalized ?? "")
                    .toString()
                    .trim()
                    .toLowerCase();
                  const active = statusText === "active" || user?.isActive === true;

                  const rowDisabled = isUpdatingId === id;

                  return (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{displayName(user)}</TableCell>
                      <TableCell>{user.email}</TableCell>

                      {/* roles */}
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                          {roles.length > 0 ? (
                            roles.map((r) => (
                              <Chip
                                key={`${id}-${r}`}
                                label={r.charAt(0).toUpperCase() + r.slice(1)}
                                sx={{ bgcolor: roleColor(r), fontWeight: 600 }}
                              />
                            ))
                          ) : (
                            <Chip label="(sin rol)" sx={{ bgcolor: "#f1f1f1" }} />
                          )}
                        </Box>
                      </TableCell>

                      {/* select para rol primario */}
                      <TableCell>
                        <FormControl fullWidth size="small" disabled={rowDisabled}>
                          <InputLabel id={`role-select-${id}`}>Rol</InputLabel>
                          <Select
                            labelId={`role-select-${id}`}
                            label="Rol"
                            value={primaryRole || ""}
                            onChange={(e) => onChangeRole(id, e.target.value)}
                            disabled={rowDisabled || loadingRoles || !(allowedRoles?.length)}
                            displayEmpty
                          >
                            {allowedRoles?.length ? (
                              allowedRoles.map((r) => (
                                <MenuItem key={r} value={r}>
                                  {r.charAt(0).toUpperCase() + r.slice(1)}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="" disabled>
                                {loadingRoles ? "Cargando roles..." : "Sin roles disponibles"}
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </TableCell>

                      {/* estado */}
                      <TableCell>
                        <Chip
                          label={active ? "Activo" : "Bloqueado"}
                          color={active ? "success" : "error"}
                          variant="outlined"
                        />
                      </TableCell>

                      {/* acción */}
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          color={active ? "error" : "success"}
                          onClick={() => onToggleStatus(id, active)}
                          disabled={rowDisabled}
                        >
                          {active ? "Bloquear" : "Activar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No hay usuarios registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default memo(AdminUsersTable);
