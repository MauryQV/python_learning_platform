// /frontend/src/app/providers/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  roles = null,
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log("🔒 ProtectedRoute", {
    path: location.pathname,
    adminOnly,
    roles,
    userRole: user?.role,
    isAuthenticated,
  });

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
  if (!isAuthenticated) {
    console.log("❌ No autenticado");
    return <Navigate to="/login" replace />;
  }

  const role = String(user?.role || "").toLowerCase();

  // ============================================
  // 🔥 ADMIN ONLY
  // ============================================
  if (adminOnly === true && role !== "admin") {
    console.log("❌ No es admin");
    return <Navigate to="/profile" replace />;
  }

  // ============================================
  // 🔥 VALIDACIÓN DE ROLES ESPECÍFICOS
  // ============================================
  if (roles && !roles.includes(role)) {
    console.log("❌ Rol no permitido");
    return <Navigate to="/unauthorized" replace />;
  }

  // ============================================
  // 🔥 AUTO-REDIRECCIONES POR ROL
  // Solo aplica en rutas genéricas como /profile o /edit-profile
  // ============================================
  const isGenericRoute = ["/profile", "/edit-profile"].includes(
    location.pathname
  );

  if (isGenericRoute) {
    console.log("📍 Ruta genérica detectada, redirigiendo según rol");

    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "admin_teacher") {
      return <Navigate to="/teacher-admin/courses" replace />;
    }

    if (role === "teacher") {
      return <Navigate to="/teacher-edit/courses" replace />;
    }
  }

  // ============================================
  // ✔️ ACCESO PERMITIDO
  // ============================================
  console.log("✅ Acceso permitido");
  return children;
}
