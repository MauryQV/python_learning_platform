// frontend/src/features/teacher_edit/ui/TeacherEditTopBar.jsx
import { Box, Typography } from "@mui/material";

export function TeacherEditTopBar() {
  return (
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
        Mis Cursos Asignados
      </Typography>
    </Box>
  );
}
