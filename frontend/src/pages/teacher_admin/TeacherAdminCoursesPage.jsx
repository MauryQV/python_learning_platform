import React, { useEffect, useState } from "react";
import { Box, Button, CssBaseline, Divider } from "@mui/material";
import { useSnackbar } from "notistack";

import SidebarNav from "@/features/teacher_admin/ui/SidebarNav";
import TopBar from "@/features/teacher_admin/ui/TopBar";

import CoursesGrid from "@/features/teacher_admin/ui/CoursesGrid";
import SearchBar from "@/features/teacher_admin/ui/SearchBar";
import CourseCreateDialog from "@/features/teacher_admin/ui/CourseCreateDialog";
import CourseEditDialog from "@/features/teacher_admin/ui/CourseEditDialog";
import AssignmentDialog from "@/features/teacher_admin/ui/AssignmentDialog";

import { useAuth } from "@/context/AuthContext";
import { teacherAdminApi } from "@/features/teacher_admin/api/teacherAdminApi";


export default function TeacherAdminCoursesPage() {
  const { enqueueSnackbar } = useSnackbar();

  // UI
  const [search, setSearch] = useState("");
  const [filterStatus] = useState("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
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
    (user?.email ? user.email.split("@")[0] : "") || "Usuario";
  const initials = displayName.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0,2).toUpperCase();
  const roleLabel = user?.role === "admin_teacher" ? "Admin Profesor" : (user?.role || "");

  // helpers
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await refreshData();
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []); // eslint-disable-line

  // handlers
  const handleOpenEdit = (course) => { setSelectedCourse(course); setOpenEdit(true); };
  const handleOpenAssign = (course) => { setCourseToAssign(course); setAssignOpen(true); };

  const handleSaveEdit = async (payload) => {
    setCourses(prev => prev.map(c => c.id === payload.id ? {
      ...c,
      title: payload.name,
      description: payload.description,
      teacher: teachers.find(t => String(t.id) === String(payload.teacherId))?.name || c.teacher,
      status: payload.status,
      duration: payload.durationHours ? `${payload.durationHours}h` : c.duration,
    } : c));
    setOpenEdit(false);
    setSelectedCourse(null);
    enqueueSnackbar("Curso actualizado en la vista", { variant: "success" });
  };

  const handleCreate = async (p) => {
    try {
      const created = await teacherAdminApi.createCourse({
        name: p.name, description: p.description, startDate: p.startDate, endDate: p.endDate, code: p.code,
      });
      const createdId = created?.id ?? created?.courseId ?? created?._raw?.course?.courseId ?? created?._raw?.id;
      const teacherId = p.teacherId ?? p.docenteId ?? null;
      if (createdId && teacherId) {
        try { await teacherAdminApi.assignTeacherToCourse(createdId, teacherId); }
        catch (e) {
          console.warn("No se pudo asignar docente:", e);
          enqueueSnackbar("Curso creado, pero no se pudo asignar el docente", { variant: "warning" });
        }
      }
      await refreshData();
      setOpenCreate(false);
      enqueueSnackbar(`"${created?.title || created?.name || "Curso"}" creado`, { variant: "success" });
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Error";
      enqueueSnackbar(`No se pudo crear: ${msg}`, { variant: "error" });
    }
  };

  const handleAssign = async (courseId, teacherId) => {
    await teacherAdminApi.assignTeacherToCourse(courseId, teacherId);
    await refreshData();
    enqueueSnackbar("Docente asignado", { variant: "success" });
  };

  const handleLogout = () => { try { localStorage.removeItem("authToken"); } catch {} window.location.href = "/login"; };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f7f8fa" }}>
      <CssBaseline />

      {/* Sidebar compartido */}
      <SidebarNav onLogout={handleLogout} />

      {/* Contenido */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar compartido */}
        <TopBar
          title="Panel de Administración"
          rightUser={{ initials, displayName, roleLabel }}
          actions={
            <Button
              variant="contained"
              onClick={() => setOpenCreate(true)}
              sx={{ bgcolor: "#f6d458", color: "#000", fontWeight: 700, ":hover": { bgcolor: "#eac94f" }, display: { xs: "none", sm: "inline-flex" } }}
            >
              + Crear Curso
            </Button>
          }
        />

        {/* Caja blanca con buscador */}
        <Box sx={{ px: 3, py: 3 }}>
          <Box sx={{
            bgcolor: "#fff", border: "1px solid #e6e8eb", borderRadius: 2,
            boxShadow: "0 2px 8px rgba(16,24,40,.06)", p: { xs: 2, md: 2.5 },
          }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 1.5, alignItems: { md: "center" } }}>
              <Box sx={{ flex: 1 }}>
                <SearchBar value={search} onChange={setSearch} />
              </Box>
              <Button
                variant="contained"
                onClick={() => setOpenCreate(true)}
                sx={{ bgcolor: "#f6d458", color: "#000", fontWeight: 700, ":hover": { bgcolor: "#eac94f" }, display: { xs: "inline-flex", md: "none" } }}
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
              filter={"all"}
              onEdit={handleOpenEdit}
              onAssign={handleOpenAssign}
            />
          </Box>
        </Box>
      </Box>

      {/* Modales */}
      <CourseCreateDialog open={openCreate} onClose={() => setOpenCreate(false)} onCreate={handleCreate} teachers={teachers} />
      <CourseEditDialog open={openEdit} onClose={() => setOpenEdit(false)} course={selectedCourse} teachers={teachers} onSave={handleSaveEdit} onDelete={() => {}} />
      <AssignmentDialog open={assignOpen} onClose={() => setAssignOpen(false)} course={courseToAssign} teachers={teachers} onAssign={handleAssign} />
    </Box>
  );
}
