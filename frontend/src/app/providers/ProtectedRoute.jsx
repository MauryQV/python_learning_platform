// /frontend/src/app/providers/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false, roles = null }) {
  const { isAuthenticated, user, loading } = useAuth();

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

  // No autenticado → login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = String(user?.role || "").toLowerCase();

  // ============================================
  // 🔥 ADMIN ONLY
  // ============================================
  if (adminOnly === true && role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  // ============================================
  // 🔥 VALIDACIÓN DE ROLES ESPECÍFICOS
  // (ejemplo: roles={["teacher"]})
  // ============================================
  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ============================================
  // 🔥 AUTO-REDIRECCIONES POR ROL (muy importante)
  // ============================================

  // Si es admin → redirige a dashboard admin (si está en rutas sin roles)
  if (!roles && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Si es admin_teacher → redirige a dashboard teacher-admin
  if (!roles && role === "admin_teacher") {
    return <Navigate to="/teacher-admin/courses" replace />;
  }

  // ⭐⭐⭐ SOLUCIÓN AL PROBLEMA ⭐⭐⭐
  // Si es teacher y entra a rutas públicas (profile, home, etc.)
  // lo mandamos DIRECTO a su dashboard teacher-edit
  if (!roles && role === "teacher") {
    return <Navigate to="/teacher-edit/courses" replace />;
  }

  // ============================================
  // ✔️ ACCESO PERMITIDO
  // ============================================
  return children;
}

