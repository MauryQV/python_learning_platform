// src/features/admin/ui/AdminBanner.jsx
import { Box, Typography, Button } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const YELLOW = "#F6D458";

export default function AdminBanner() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        bgcolor: YELLOW,
        py: 2.5,
        mb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 2 }}>
        PANEL DE ADMINISTRACIÓN
      </Typography>
      <Button
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ fontWeight: 600, textTransform: "none", borderRadius: 2, px: 2.5 }}
      >
        Cerrar sesión
      </Button>
    </Box>
  );
}
