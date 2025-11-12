import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./app/providers/ProtectedRoute.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// Public pages
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmail.jsx"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword.jsx"));

// Authenticated pages
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const EditProfile = lazy(() => import("./pages/EditProfile.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage.jsx"));
const TeacherAdminCoursesPage = lazy(() =>
  import("./pages/teacher_admin/TeacherAdminCoursesPage.jsx")
);

// 🆕 Docentes (lista)
const TeachersPage = lazy(() =>
  import("./pages/teacher_admin/TeachersPage.jsx")
);

// (opcional) Estudiantes cuando lo tengas
// const StudentsPage = lazy(() =>
//   import("./pages/teacher_admin/StudentsPage.jsx")
// );

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h2>404 - Página no encontrada</h2>
      <Link to="/login">Volver al inicio</Link>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div style={{ textAlign: "center", paddingTop: "3rem" }}>
                  <p>Cargando...</p>
                </div>
              }
            >
              <Routes>
                {/* Base redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/dashboard" element={<Navigate to="/profile" replace />} />

                {/* Protected student profile */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-profile"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin area */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Teacher Admin area */}
                <Route
                  path="/teacher-admin"
                  element={<Navigate to="/teacher-admin/courses" replace />}
                />

                <Route
                  path="/teacher-admin/courses"
                  element={
                    <ProtectedRoute roles={['admin_teacher']}>
                      <TeacherAdminCoursesPage />
                    </ProtectedRoute>
                  }
                />

                {/* RUTA: Docentes */}
                <Route
                  path="/teacher-admin/teachers"
                  element={
                    <ProtectedRoute roles={['admin_teacher']}>
                      <TeachersPage />
                    </ProtectedRoute>
                  }
                />

                {/* (opcional) Estudiantes */}
                {/* <Route
                  path="/teacher-admin/students"
                  element={
                    <ProtectedRoute roles={['admin_teacher']}>
                      <StudentsPage />
                    </ProtectedRoute>
                  }
                /> */}

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
