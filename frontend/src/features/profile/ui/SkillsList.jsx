import { Box, LinearProgress, Typography, Paper } from "@mui/material";
import SectionTitle from "./SectionTitle";

function Skill({ label, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{label}</Typography>
      <LinearProgress variant="determinate" value={value} sx={{ height: 10, borderRadius: 5 }} />
    </Box>
  );
}

export default function SkillsList({ title = "Tecnologías", skills = [] }) {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <SectionTitle>{title}</SectionTitle>
      {skills.map((s) => <Skill key={s.label} label={s.label} value={s.value} />)}
    </Paper>
  );
}
