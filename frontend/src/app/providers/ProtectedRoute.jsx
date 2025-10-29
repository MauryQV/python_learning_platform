// src/app/providers/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = String(user?.role || "").toLowerCase();

  if (adminOnly && role == "student") return <Navigate to="/profile" replace />;
  if (!adminOnly && role == "admin") return <Navigate to="/admin" replace />;

  return children;
}

