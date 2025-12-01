import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

import { getCourseDetails } from "@/features/teacher_edit/api/teacherEditApi";
import { TeacherEditSidebarNav } from "@/features/teacher_edit/ui/TeacherEditSidebarNav";
import { TeacherEditTopBar } from "@/features/teacher_edit/ui/TeacherEditTopBar";

export default function TeacherEditCourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseDetails(courseId);
        setCourse(data || null);
      } catch (error) {
        console.error("Error obteniendo curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="page-layout">
        <TeacherEditSidebarNav />
        <main className="main-content">
          <TeacherEditTopBar />
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-layout">
        <TeacherEditSidebarNav />
        <main className="main-content">
          <TeacherEditTopBar />
          <Typography sx={{ p: 4 }}>No se encontró el curso.</Typography>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout" style={{ display: "flex" }}>
      <TeacherEditSidebarNav />

      <main className="main-content" style={{ flexGrow: 1 }}>
        <TeacherEditTopBar />

        <Box sx={{ p: 3 }}>
          {/* TÍTULO DEL CURSO */}
          <Typography variant="h4" fontWeight={800}>
            {course.name}
          </Typography>

          {/* CÓDIGO */}
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Código: <strong>{course.code}</strong>
          </Typography>

          {/* DOCENTE */}
          <Typography variant="body1" sx={{ mt: 1 }}>
            👤 <strong>{course.teacher?.name || "Tú"}</strong>
          </Typography>

          {/* ESTUDIANTES */}
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            👥 <strong>{course.numeroEstudiantes}</strong> estudiantes
          </Typography>

          {/* DURACIÓN */}
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            ⏳ Duración: <strong>{course.duration || "N/A"}</strong>
          </Typography>

          {/* ESTADO */}
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Estado:{" "}
            <strong style={{ color: course.status === "active" ? "green" : "gray" }}>
              {course.status === "active" ? "Activo" : "Inactivo"}
            </strong>
          </Typography>

          {/* BOTONES */}
          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/teacher-edit/course/${courseId}/topics`)}
            >
              Ver tópicos
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(`/teacher-edit/course/${courseId}/topics/create`)}
            >
              Crear tópico
            </Button>
          </Box>
        </Box>
      </main>
    </div>
  );
}
