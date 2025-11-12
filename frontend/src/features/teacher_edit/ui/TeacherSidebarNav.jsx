import { Box, Button, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

const Root = styled(Box)(({ theme }) => ({
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

export default function TeacherSidebarNav({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (pattern) => location.pathname.includes(pattern);

  return (
    <Root>
      <Typography variant="h6" fontWeight={800} sx={{ color: "#f6d458" }}>
        Learning with Python
      </Typography>

      <List sx={{ mt: 1 }}>
        <ListItemButton
          sx={{
            borderRadius: 1,
            bgcolor: isActive("courses") ? "#f6d458" : "transparent",
            color: isActive("courses") ? "#000" : "#fff",
            fontWeight: isActive("courses") ? 700 : 400,
            "&:hover": { bgcolor: "#f6d458", color: "#000" },
          }}
          onClick={() => navigate("/teacher_edit/courses")}
        >
          <ListItemText primary="Cursos" />
        </ListItemButton>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Button
        onClick={onLogout}
        fullWidth
        variant="outlined"
        sx={{
          mt: 1,
          borderColor: "rgba(255, 234, 74, 0.97)",
          color: "#fff",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": { borderColor: "#fff", background: "rgba(255,255,255,.08)" },
        }}
      >
        Cerrar sesión
      </Button>
    </Root>
  );
}
