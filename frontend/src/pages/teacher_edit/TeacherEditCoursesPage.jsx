import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CssBaseline,
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";

import { useAuth } from "@/context/AuthContext";
import { teacherAdminApi } from "@/features/teacher_admin/api/teacherAdminApi";
import TeacherSidebarNav from "@/features/teacher_edit/ui/TeacherSidebarNav";
import TopBar from "@/features/teacher_admin/ui/TopBar";
import CoursesGrid from "@/features/teacher_admin/ui/CoursesGrid";

import { useTeacherEditTopics } from "@/features/teacher_edit/model/useTeacherEditTopics";

export default function TeacherEditCoursesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const { user } = useAuth();
  const displayName =
    (user?.name && user.name.trim()) ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "Usuario";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const roleLabel =
    user?.role === "teacher_edit" ? "Docente" : user?.role || "";

  
  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await teacherAdminApi.listCourses();
      if (r?.error) enqueueSnackbar(r.error, { variant: "error" });

      const mine = (r?.items || []).filter((c) =>
        (c.teacher || "").toLowerCase().includes(displayName.toLowerCase())
      );

      setCourses(mine);
      setLoading(false);
    })();
  }, [enqueueSnackbar, displayName]);

  const handleGridEdit = (course) => {
    if (!course?.id) {
      enqueueSnackbar("Curso inválido", { variant: "warning" });
      return;
    }
    setSelectedCourseId(course.id);
  };

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || null,
    [courses, selectedCourseId]
  );

  const {
    topics,
    addTopic,
    editTopic,
    removeTopic,
    loading: topicsLoading,
    error: topicsError,
  } = useTeacherEditTopics(selectedCourseId ?? undefined);

  useEffect(() => {
    if (topicsError) {
      enqueueSnackbar(topicsError, { variant: "error" });
    }
  }, [topicsError, enqueueSnackbar]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
    } catch {}
    window.location.href = "/login";
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f7f8fa" }}>
      <CssBaseline />
      <TeacherSidebarNav onLogout={handleLogout} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar
          title="Mis Cursos"
          rightUser={{ initials, displayName, roleLabel }}
          actions={null}
        />

        <Box sx={{ p: 3, display: "grid", gridTemplateColumns: { md: "1fr 420px" }, gap: 3 }}>
          {/* Left: Courses */}
          <Paper elevation={0} sx={{ p: 2, border: "1px solid #eee" }}>
            <Stack spacing={2}>
              <Typography variant="h6">Cursos</Typography>

              {/* Optional search input (you had search state already) */}
              <TextField
                size="small"
                placeholder="Buscar curso…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Divider />

              <CoursesGrid
                courses={courses}
                search={search}
                filter="all"
                onEdit={handleGridEdit} // ← wire selection here
                loading={loading}
              />
            </Stack>
          </Paper>

          {/* Right: Topics manager */}
          <TopicsManager
            selectedCourse={selectedCourse}
            topics={topics}
            addTopic={addTopic}
            editTopic={editTopic}
            removeTopic={removeTopic}
            loading={!!selectedCourseId && topicsLoading}
            onClear={() => setSelectedCourseId(null)}
          />
        </Box>
      </Box>
    </Box>
  );
}


function TopicsManager({
  selectedCourse,
  topics,
  addTopic,
  editTopic,
  removeTopic,
  loading,
  onClear,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) {
      enqueueSnackbar("Ingresa un título ✍️", { variant: "info" });
      return;
    }
    try {
      await addTopic({ title });
      setNewTitle("");
      enqueueSnackbar("Tema agregado ✅", { variant: "success" });
    } catch (e) {
      enqueueSnackbar(e?.message || "Error al agregar tema", { variant: "error" });
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditingTitle(t.title || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveEdit = async () => {
    const title = editingTitle.trim();
    if (!title) {
      enqueueSnackbar("El título no puede estar vacío", { variant: "warning" });
      return;
    }
    try {
      await editTopic(editingId, { title });
      enqueueSnackbar("Tema actualizado ✨", { variant: "success" });
      cancelEdit();
    } catch (e) {
      enqueueSnackbar(e?.message || "Error al actualizar tema", { variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTopic(id);
      enqueueSnackbar("Tema eliminado 🗑️", { variant: "success" });
    } catch (e) {
      enqueueSnackbar(e?.message || "Error al eliminar tema", { variant: "error" });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #eee", minHeight: 360 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Temas del Curso</Typography>
          {selectedCourse ? (
            <Button size="small" onClick={onClear} startIcon={<CloseIcon />}>
              Cerrar
            </Button>
          ) : null}
        </Stack>

        {!selectedCourse ? (
          <Box sx={{ color: "text.secondary" }}>
            <Typography variant="body2">
              Selecciona <strong>Editar</strong> en un curso para administrar sus temas 📚
            </Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Cargando temas…</Typography>
          </Box>
        ) : (
          <>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Curso seleccionado:
              </Typography>
              <Typography variant="body1">
                <strong>{selectedCourse.title || `Curso #${selectedCourse.id}`}</strong>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                label="Nuevo tema"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Agregar
              </Button>
            </Stack>

            <Divider />

            {(!topics || topics.length === 0) ? (
              <Typography variant="body2" color="text.secondary">
                Aún no hay temas. ¡Agrega el primero! ✨
              </Typography>
            ) : (
              <List dense>
                {topics.map((t) => (
                  <ListItem key={t.id} disableGutters>
                    {editingId === t.id ? (
                      <>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="save" onClick={saveEdit}>
                            <SaveIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="cancel" onClick={cancelEdit}>
                            <CloseIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </>
                    ) : (
                      <>
                        <ListItemText primary={t.title} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="edit" onClick={() => startEdit(t)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(t.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </Stack>
    </Paper>
  );
}
