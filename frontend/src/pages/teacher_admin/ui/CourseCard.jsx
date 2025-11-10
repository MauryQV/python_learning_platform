import { Box, Typography, Button, Chip } from "@mui/material";

export default function CourseCard({ course, onEdit }) {
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
        width: "100%",
      }}
    >
      {/* Top area */}
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

      {/* Middle content */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Typography
          sx={{
            fontWeight: 800,
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: 48,
          }}
        >
          {course.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          👤 {course.teacher}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          👥 {course.students} estudiantes&nbsp;&nbsp; ⏱ {course.duration}
        </Typography>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          height: 60,
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: "#f6d458", color: "#000", fontWeight: 700, ":hover": { bgcolor: "#eac94f" } }}
          onClick={() => onEdit?.(course)}  // 👈 triggers edit flow
        >
          Editar
        </Button>
        <Button variant="outlined" size="small">
          Ver
        </Button>
      </Box>
    </Box>
  );
}
