import { useEffect, useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { useSnackbar } from "notistack";
import { useAuth } from "@/context/AuthContext";
import { teacherAdminApi } from "@/features/teacher_admin/api/teacherAdminApi";
import TeacherSidebarNav from "@/features/teacher_edit/ui/TeacherSidebarNav";
import TopBar from "@/features/teacher_admin/ui/TopBar";
import CoursesGrid from "@/features/teacher_admin/ui/CoursesGrid";

export default function TeacherEditCoursesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { user } = useAuth();
  const displayName =
    (user?.name && user.name.trim()) ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "Usuario";
  const initials = displayName.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const roleLabel = user?.role === "teacher_edit" ? "Docente" : (user?.role || "");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await teacherAdminApi.listCourses();
      if (r.error) enqueueSnackbar(r.error, { variant: "error" });

      // 🔎 Filtra solo los cursos de este docente
      const mine = r.items.filter(c =>
        c.teacher?.toLowerCase().includes(displayName.toLowerCase())
      );

      setCourses(mine);
      setLoading(false);
    })();
  }, [enqueueSnackbar, displayName]);

  const handleLogout = () => {
    try { localStorage.removeItem("authToken"); } catch {}
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
        <Box sx={{ p: 3 }}>
          <CoursesGrid
            courses={courses}
            search={search}
            filter="all"
            onEdit={() => {}}
            loading={loading}
          />
        </Box>
      </Box>
    </Box>
  );
}
