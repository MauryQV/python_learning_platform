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

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = String(user?.role || "").toLowerCase();

  const roleRedirects = {
    admin: "/admin",
    admin_teacher: "/teacher-admin/courses",
    teacher_edit: "/teacher-edit/courses", 
    student: "/profile",
  };

  
  if (roles && !roles.includes(role)) {
    const fallback = roleRedirects[role] || "/unauthorized";
    return <Navigate to={fallback} replace />;
  }

  if (adminOnly && role !== "admin") {
    const fallback = roleRedirects[role] || "../TeacherEditCoursesPage";
    return <Navigate to={fallback} replace />;
  }

  if (!adminOnly && !roles) {
    const defaultDest = roleRedirects[role];
    if (defaultDest) {
      return <Navigate to={defaultDest} replace />;
    }
  }

  return children;
}
