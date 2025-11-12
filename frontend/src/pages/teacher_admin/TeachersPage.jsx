import { useEffect, useMemo, useState } from "react";
import {
  Box, Paper, Typography, TextField, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, CircularProgress, CssBaseline
} from "@mui/material";
import SidebarNav from "@/features/teacher_admin/ui/SidebarNav";
import TopBar from "@/features/teacher_admin/ui/TopBar";
import { useSnackbar } from "notistack";
import { teacherAdminApi } from "@/features/teacher_admin/api/teacherAdminApi";
import { useAuth } from "@/context/AuthContext";

export default function TeachersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);

  const { user } = useAuth();
  const displayName =
    (user?.name && user.name.trim()) ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user?.email ? user.email.split("@")[0] : "") || "Usuario";
  const initials = displayName.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0,2).toUpperCase();
  const roleLabel = user?.role === "admin_teacher" ? "Admin Profesor" : (user?.role || "");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await teacherAdminApi.listTeachers();
      if (r.error) enqueueSnackbar(r.error, { variant: "error" });
      setTeachers(r.items || []);
      setLoading(false);
    })();
  }, []); 

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return teachers;
    return teachers.filter(t =>
      (t.name || "").toLowerCase().includes(s) ||
      (t.email || "").toLowerCase().includes(s) ||
      (t.courses?.some(c => c.name.toLowerCase().includes(s)))
    );
  }, [q, teachers]);

  const handleLogout = () => {
    try { localStorage.removeItem("authToken"); } catch {}
    window.location.href = "/login";
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f7f8fa" }}>
      <CssBaseline />
      <SidebarNav onLogout={handleLogout} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar
          title="Docentes"
          rightUser={{ initials, displayName, roleLabel }}
          actions={null}
        />

        <Box sx={{ p: 3 }}>
          <Paper sx={{ mt: 0, p: 2 }}>
            <TextField
              fullWidth size="small"
              placeholder="Buscar por nombre, correo o curso…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />

            {loading ? (
              <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Cursos Asignados</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.email}</TableCell>
                      <TableCell>
                        <Chip label="Teacher" size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        {t.courses && t.courses.length > 0 ? (
                          t.courses.map(c => (
                            <Chip
                              key={c.id}
                              label={c.name}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5, bgcolor: "#fef9c3" }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin cursos asignados
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {!filtered.length && (
                    <TableRow>
                      <TableCell colSpan={4}>Sin resultados</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
