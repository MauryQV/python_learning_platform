import { useEffect, useState } from "react";
import {Box,Container,Typography,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Button,Chip,CircularProgress,} from "@mui/material";
import { Refresh as RefreshIcon, Logout as LogoutIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const YELLOW = "#F6D458";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:2999/api/admin/users");

      const data = res.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error("Formato inesperado de respuesta:", data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:2999/api/admin/users/${id}/status`, {
        status: currentStatus === "active" ? "blocked" : "active",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const toggleRole = async (id, currentRole) => {
    try {
      await axios.patch(`http://localhost:2999/api/admin/users/${id}/role`, {
        role: currentRole === "admin" ? "student" : "admin",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error al cambiar rol:", err);
    }
  };

  const handleLogout = () => {
    // Limpia cualquier dato local si existiera
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Banner */}
      <Box
        sx={{
          bgcolor: YELLOW,
          py: 2.5,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 2 }}>
          PANEL DE ADMINISTRACIÓN
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
          }}
        >
          Cerrar sesión
        </Button>
      </Box>

      <Container maxWidth="lg">
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Lista de Usuarios
            </Typography>
            <IconButton onClick={fetchUsers} color="primary">
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
                    <TableCell><strong>Rol</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.firstName || "Sin nombre"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role === "admin" ? "Admin" : "Student"}
                            sx={{
                              bgcolor:
                                user.role === "admin" ? YELLOW : "#e0e0e0",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              user.status === "active"
                                ? "Activo"
                                : "Bloqueado"
                            }
                            color={
                              user.status === "active" ? "success" : "error"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                            onClick={() => toggleRole(user.id, user.role)}
                          >
                            Cambiar Rol
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color={
                              user.status === "active" ? "error" : "success"
                            }
                            onClick={() =>
                              toggleStatus(user.id, user.status)
                            }
                          >
                            {user.status === "active"
                              ? "Bloquear"
                              : "Activar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay usuarios registrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

