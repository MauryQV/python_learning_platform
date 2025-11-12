// frontend/src/pages/teacher_admin/TeachersPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress } from "@mui/material";
import { teacherAdminApi } from "@/features/teacher_admin/api/teacherAdminApi";

export default function TeachersPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await teacherAdminApi.listTeachers();
      setTeachers(r.items || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return teachers;
    return teachers.filter(t =>
      (t.name || "").toLowerCase().includes(s) ||
      (t.email || "").toLowerCase().includes(s)
    );
  }, [q, teachers]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={800}>Docentes</Typography>

      <Paper sx={{ mt: 2, p: 2 }}>
        <TextField
          fullWidth size="small" placeholder="Buscar por nombre o correo…"
          value={q} onChange={e => setQ(e.target.value)}
        />

        {loading ? (
          <Box sx={{ py: 6, display:"grid", placeItems:"center" }}><CircularProgress /></Box>
        ) : (
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Rol</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.email}</TableCell>
                  <TableCell><Chip label="Teacher" size="small" color="primary" /></TableCell>
                </TableRow>
              ))}
              {!filtered.length && (
                <TableRow><TableCell colSpan={3}>Sin resultados</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
