import { Container, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchProtectedData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2999/api/protected-route"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">
          Bienvenido, {user?.firstName} {user?.lastName}
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>

      <Button variant="contained" onClick={fetchProtectedData} sx={{ mb: 2 }}>
        Obtener Datos Protegidos
      </Button>

      {data && (
        <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2 }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Box>
      )}
    </Container>
  );
}
