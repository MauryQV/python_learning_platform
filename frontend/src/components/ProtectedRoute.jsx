// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Mientras carga el estado de autenticación
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta es solo para admin y el usuario NO lo es → redirige al Dashboard de usuario
  if (adminOnly && user?.role?.toLowerCase() !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Si el usuario es admin e intenta entrar al dashboard de usuario, puedes redirigirlo al admin
  if (!adminOnly && user?.role?.toLowerCase() === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Si cumple las condiciones, renderiza el contenido
  return children;
}

