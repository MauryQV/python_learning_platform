import { Card, CardContent, Box, Typography, Chip, Stack, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";

export default function CourseCard({ course }) {
  const active = course.status === "active";
  const badge = active
    ? { label: "Activo",  sx: { bgcolor: "#e8f8f0", color: "#0a7f53" } }
    : { label: "Borrador", sx: { bgcolor: "#fff4e0", color: "#a36200" } };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e6e8eb", borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 8px rgba(16,24,40,.06)" }}>
      {/* Banner */}
      <Box sx={{ height: 130, position: "relative", background: course.gradient }}>
        <Box sx={{ position: "absolute", right: 12, top: 6, fontSize: 44 }}>{course.emoji}</Box>
        <Chip
          size="small"
          label={badge.label}
          sx={{ position: "absolute", left: 12, top: 10, px: 1.2, fontWeight: 600, ...badge.sx }}
        />
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={800}>{course.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>👤 {course.teacher}</Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }} color="text.secondary">
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <PeopleIcon fontSize="small" />
            <Typography variant="body2">{course.students} estudiantes</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">{course.duration}</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.2} sx={{ mt: 2 }}>
          <Button variant="contained" sx={{ bgcolor: "#f6d458", color: "#000", fontWeight: 700, ":hover": { bgcolor: "#eac94f" } }}>
            Editar
          </Button>
          <Button variant="outlined">Ver</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
