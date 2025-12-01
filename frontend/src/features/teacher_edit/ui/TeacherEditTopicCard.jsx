import { Box, Typography, Button } from "@mui/material";

export function TeacherEditTopicCard({ topic, onEdit }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        p: 2.5,
        bgcolor: "#fff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
      }}
    >
      <Typography variant="h6" fontWeight={800}>
        {topic.title}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Orden: {topic.order}
      </Typography>

      <Typography variant="body2">
        {topic.description || "Sin descripción"}
      </Typography>

      <Box sx={{ mt: 1, display: "flex" }}>
        <Button variant="outlined" size="small" onClick={() => onEdit(topic)}>
          Editar
        </Button>
      </Box>
    </Box>
  );
}
