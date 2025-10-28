// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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


const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmail.jsx"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword.jsx"));
const DashboardPage = lazy(() => import("./pages/DashBoard.jsx"));     
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage.jsx"));

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h2>404 - Página no encontrada</h2>
      <a href="/login">Volver al inicio</a>
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
                {/* Redirección base */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protegidas */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

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
