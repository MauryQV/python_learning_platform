// frontend/src/pages/teacher_admin/TeacherAdminCoursesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Button, CssBaseline, Divider, List, ListItemButton, ListItemText, Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import CoursesGrid from "../../features/teacher_admin/ui/CoursesGrid";
import SearchBar from "../../features/teacher_admin/ui/SearchBar";
import CourseCreateDialog from "../../features/teacher_admin/ui/CourseCreateDialog";
import CourseEditDialog from "../../features/teacher_admin/ui/CourseEditDialog";
import AssignmentDialog from "../../features/teacher_admin/ui/AssignmentDialog"; // 👈 nuevo

import { useAuth } from "@/context/AuthContext";
import { teacherAdminApi } from "@/features/teacher_admin/api/teacherAdminApi";

const Sidebar = styled(Box)(({ theme }) => ({
  width: 256,
  background: "#20518dff",
  color: "#fff",
  padding: theme.spacing(2.5),
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },
}));

export default function TeacherAdminCoursesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // UI local
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Estado para asignación de docente
  const [assignOpen, setAssignOpen] = useState(false);
  const [courseToAssign, setCourseToAssign] = useState(null);

  // Datos
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const displayName =
    (user?.name && user.name.trim()) ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "Usuario";
  const initials = displayName.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0,2).toUpperCase();
  const roleLabel = user?.role === "admin_teacher" ? "Admin Profesor" : (user?.role || "");

  // ====== helpers ======
  const refreshData = async () => {
    const [c, t] = await Promise.all([
      teacherAdminApi.listCourses(),
      teacherAdminApi.listTeachers(),
    ]);

    if (c.error) enqueueSnackbar(`No se pudo cargar cursos: ${c.error}`, { variant: "error" });
    if (t.error) enqueueSnackbar(`No se pudo cargar docentes: ${t.error}`, { variant: "warning" });

    setCourses(c.items || []);
    setTeachers(t.items || []);
  };

  // ====== Carga inicial ======
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await refreshData();
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== Handlers ======
  const handleOpenEdit = (course) => {
    setSelectedCourse(course);
    setOpenEdit(true);
  };

  // abrir modal de asignación
  const handleOpenAssign = (course) => {
    setCourseToAssign(course);
    setAssignOpen(true);
  };

  // (demo visual) edición local
  const handleSaveEdit = async (payload) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === payload.id
          ? {
              ...c,
              title: payload.name,
              description: payload.description,
              teacher:
                teachers.find((t) => String(t.id) === String(payload.teacherId))?.name ||
                c.teacher,
              status: payload.status,
              duration: payload.durationHours ? `${payload.durationHours}h` : c.duration,
            }
          : c
      )
    );
    setOpenEdit(false);
    setSelectedCourse(null);
    enqueueSnackbar("Curso actualizado en la vista", { variant: "success" });
  };

  const handleDeleteCourse = async (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    enqueueSnackbar("Curso eliminado en la vista", { variant: "info" });
  };

  // Crear curso + asignar opcional
  const handleCreate = async (payloadFromDialog) => {
    try {
      const created = await teacherAdminApi.createCourse({
        name: payloadFromDialog.name,
        description: payloadFromDialog.description,
        startDate: payloadFromDialog.startDate,
        endDate: payloadFromDialog.endDate,
        code: payloadFromDialog.code,
      });

      const createdId =
        created?.id ??
        created?.courseId ??
        created?._raw?.course?.courseId ??
        created?._raw?.id;

      const teacherId =
        payloadFromDialog.teacherId ??
        payloadFromDialog.docenteId ??
        null;

      if (createdId && teacherId) {
        try {
          await teacherAdminApi.assignTeacherToCourse(createdId, teacherId);
        } catch (e) {
          console.warn("No se pudo asignar docente:", e);
          enqueueSnackbar("Curso creado, pero no se pudo asignar el docente", { variant: "warning" });
        }
      }

      await refreshData();
      setOpenCreate(false);
      const titleShown = created?.title || created?.name || "Curso";
      enqueueSnackbar(`"${titleShown}" creado`, { variant: "success" });
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Error";
      enqueueSnackbar(`No se pudo crear: ${msg}`, { variant: "error" });
    }
  };

  // Asignar desde el modal dedicado
  const handleAssign = async (courseId, teacherId) => {
    await teacherAdminApi.assignTeacherToCourse(courseId, teacherId);
    await refreshData();
    enqueueSnackbar("Docente asignado", { variant: "success" });
  };

  const handleLogout = () => {
    try { localStorage.removeItem("authToken"); } catch {}
    window.location.href = "/login";
  };
  const isActive = (pattern) => location.pathname.includes(pattern);

  // ====== Render ======
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f7f8fa" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar>
        <Typography variant="h6" fontWeight={800} sx={{ color: "#f6d458" }}>
          Learning with Python
        </Typography>

        <List sx={{ mt: 1 }}>
          <ListItemButton
            sx={{
              borderRadius: 1,
              bgcolor: isActive("courses") ? "#f6d458" : "transparent",
              color: isActive("courses") ? "#000" : "#fff",
              fontWeight: isActive("courses") ? 700 : 400,
              "&:hover": { bgcolor: "#f6d458", color: "#000" },
            }}
            onClick={() => navigate("/teacher-admin/courses")}
          >
            <ListItemText primary="Cursos" />
          </ListItemButton>
          <ListItemButton
            sx={{
              borderRadius: 1,
              bgcolor: isActive("teachers") ? "#f6d458" : "transparent",
              color: isActive("teachers") ? "#000" : "#fff",
              fontWeight: isActive("teachers") ? 700 : 400,
              "&:hover": { bgcolor: "#f6d458", color: "#000" },
            }}
            onClick={() => navigate("/teacher-admin/teachers")}
          >
            <ListItemText primary="Docentes" />
          </ListItemButton>
          <ListItemButton
            sx={{
              borderRadius: 1,
              bgcolor: isActive("students") ? "#f6d458" : "transparent",
              color: isActive("students") ? "#000" : "#fff",
              fontWeight: isActive("students") ? 700 : 400,
              "&:hover": { bgcolor: "#f6d458", color: "#000" },
            }}
            onClick={() => navigate("/teacher-admin/students")}
          >
            <ListItemText primary="Estudiantes" />
          </ListItemButton>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          onClick={handleLogout}
          fullWidth
          variant="outlined"
          sx={{
            mt: 1,
            borderColor: "rgba(255, 234, 74, 0.97)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              borderColor: "#fff",
              background: "rgba(255,255,255,.08)",
            },
          }}
        >
          Cerrar sesión
        </Button>
      </Sidebar>

      {/* Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            px: 3, py: 2.5,
            bgcolor: "#fff",
            borderBottom: "1px solid #e6e8eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 22, md: 28 } }}>
            Panel de Administración
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="contained"
              onClick={() => setOpenCreate(true)}
              sx={{
                bgcolor: "#f6d458",
                color: "#000",
                fontWeight: 700,
                ":hover": { bgcolor: "#eac94f" },
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              + Crear Curso
            </Button>

            <Button
              onClick={handleLogout}
              variant="text"
              sx={{
                display: { xs: "inline-flex", md: "none" },
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Box>

        {/* Search + Grid */}
        <Box sx={{ px: 3, py: 3 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e6e8eb",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(16,24,40,.06)",
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 1.5, alignItems: { md: "center" } }}>
              <Box sx={{ flex: 1 }}>
                <SearchBar value={search} onChange={setSearch} />
              </Box>

              <Button
                variant="contained"
                onClick={() => setOpenCreate(true)}
                sx={{
                  bgcolor: "#f6d458",
                  color: "#000",
                  fontWeight: 700,
                  ":hover": { bgcolor: "#eac94f" },
                  display: { xs: "inline-flex", md: "none" },
                }}
              >
                + Crear Curso
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />
          </Box>

          <Box sx={{ mt: 3 }}>
            <CoursesGrid
              loading={loading}
              courses={courses}
              search={search}
              filter={filterStatus}
              onEdit={handleOpenEdit}
              onAssign={handleOpenAssign}   
            />
          </Box>
        </Box>
      </Box>

      {/* Create Dialog */}
      <CourseCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
        teachers={teachers}
      />

      {/* Edit Dialog */}
      <CourseEditDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        course={selectedCourse}
        teachers={teachers}
        onSave={handleSaveEdit}
        onDelete={handleDeleteCourse}
      />

      {/* Assignment Dialog */}
      <AssignmentDialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        course={courseToAssign}
        teachers={teachers}
        onAssign={handleAssign}
      />
    </Box>
  );
}

