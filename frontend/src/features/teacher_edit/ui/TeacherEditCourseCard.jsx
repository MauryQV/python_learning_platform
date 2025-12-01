// frontend/src/features/teacher_edit/ui/TeacherEditCourseCard.jsx
import { Box, Typography, Button, Chip } from "@mui/material";

export function TeacherEditCourseCard({ course, onView }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        height: 330,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 120,
          background: course.gradient,
          p: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Chip
          label={course.status === "active" ? "Activo" : "Borrador"}
          size="small"
          sx={{
            bgcolor: course.status === "active" ? "#D1FAE5" : "#FDE68A",
            color: course.status === "active" ? "#065F46" : "#92400E",
            fontWeight: 700,
          }}
        />
        <Typography fontSize={42}>{course.emoji}</Typography>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
          {course.title}
        </Typography>

        <Typography variant="caption">
          Código: <strong>{course.code}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          👤 {course.teacher || "Tú"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          👥 {course.students} estudiantes
        </Typography>
      </Box>

      <Box sx={{ p: 2, display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" onClick={() => onView(course.id)}>
          Ver
        </Button>
      </Box>
    </Box>
  );
}
