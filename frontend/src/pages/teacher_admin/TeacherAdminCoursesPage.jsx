import React, { useState } from "react";
import { Box, Button, CssBaseline, Divider, List, ListItemButton, ListItemText, Typography,} from "@mui/material";
import { styled } from "@mui/material/styles";
import CoursesGrid from "./ui/CoursesGrid";
import SearchBar from "./ui/SearchBar";
import CourseCreateDialog from "./ui/CourseCreateDialog";
import CourseEditDialog from "./ui/CourseEditDialog"; 
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

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

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openCreate, setOpenCreate] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [courses, setCourses] = useState([]);

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
    user?.role === "admin_teacher" ? "Admin Profesor" : user?.role || "";

  const teachers = [
    { id: 1, name: "Prof. María García" },
    { id: 2, name: "Prof. Juan Pérez" },
    { id: 3, name: "Prof. Ana Martínez" },
  ];

  const handleOpenEdit = (course) => {
    setSelectedCourse(course);
    setOpenEdit(true);
  };

  const handleSaveEdit = async (payload) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== payload.id) return c;
        return {
          ...c,
          title: payload.name,
          description: payload.description,
          teacherId: payload.teacherId,
          teacher:
            teachers.find((t) => t.id === payload.teacherId)?.name || c.teacher,
          status: payload.status,
          duration: `${payload.durationHours}h`,
          capacity: payload.capacity,
          emoji: payload.emoji ?? c.emoji,
          gradient: payload.gradient ?? c.gradient,
        };
      })
    );
  };

  const handleDeleteCourse = async (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreate = async (payload) => {
    const teacherName =
      teachers.find((t) => String(t.id) === String(payload.teacherId))?.name ||
      "Profesor";

    const newCourse = {
      id: Date.now(),
      title: payload.name,
      teacher: teacherName,
      students: 0,
      duration: `${payload.durationHours}h`,
      status: payload.status, // "active" | "draft"
      emoji: "📘",
      gradient: "linear-gradient(90deg,#a5d8ff,#c3f0ff)",
    };

    setCourses((prev) => [newCourse, ...prev]);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
    } catch {}
    window.location.href = "/login";
  };

  const isActive = (pattern) => location.pathname.includes(pattern);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f7f8fa" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar>
        <Typography variant="h6" fontWeight={800} sx={{ color: "#f6d458" }}>
          Learning with Python
        </Typography>

        <List sx={{ mt: 1 }}>
          {/* CURSOS */}
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

          {/* DOCENTES */}
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

          {/* ESTUDIANTES */}
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
            px: 3,
            py: 2.5,
            bgcolor: "#fff",
            borderBottom: "1px solid #e6e8eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ fontSize: { xs: 22, md: 28 } }}
          >
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

            {/* Logout header (mobile) */}
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

            {/* User block */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#e5e7eb",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                }}
              >
                {initials}
              </Box>
              <Box sx={{ lineHeight: 1 }}>
                <Typography variant="body2" fontWeight={700}>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {roleLabel}
                </Typography>
              </Box>
            </Box>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 1.5,
                alignItems: { md: "center" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                {/* 🔁 SearchBar now uses { value, onChange } */}
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
            {/* Grid renders empty state when there are no courses */}
            <CoursesGrid
              courses={courses}
              search={search}
              filter={filterStatus}
              onEdit={handleOpenEdit}
            />
          </Box>
        </Box>
      </Box>

      {/* Create Dialog mount */}
      <CourseCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
        teachers={teachers}
      />

      {/* Edit Dialog mount */}
      <CourseEditDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        course={selectedCourse}
        teachers={teachers}
        onSave={handleSaveEdit}
        onDelete={handleDeleteCourse}
      />
    </Box>
  );
}
