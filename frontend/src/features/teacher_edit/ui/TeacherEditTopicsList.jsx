import { Box, Typography } from "@mui/material";
import { TeacherEditTopicCard } from "@/features/teacher_edit/ui/TeacherEditTopicCard";

export function TeacherEditTopicsList({ topics, onEdit }) {
  if (!topics.length) {
    return (
      <Typography sx={{ mt: 4 }} variant="body1">
        Este curso aún no tiene tópicos.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        mt: 3,
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
      }}
    >
      {topics.map((topic) => (
        <TeacherEditTopicCard
          key={topic.topicId}
          topic={topic}
          onEdit={onEdit}
        />
      ))}
    </Box>
  );
}
