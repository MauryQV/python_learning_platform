import { Container } from "@mui/material";
import LoginForm from "@/features/auth/ui/LoginForm";
import { useLoginModel } from "@/features/auth/model/useLogin";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const {
    state: { email, password, showPw, loading, message, isSuccess },
    actions: { setEmail, setPassword, setShowPw, handleLogin, microsoftLogin },
  } = useLoginModel();

  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    const normalized = (role || "").toLowerCase();

    switch (normalized) {
      case "admin":
        navigate("/admin", { replace: true });
        break;

      case "admin_teacher":
        navigate("/teacher-admin/courses", { replace: true });
        break;

      case "teacher":
        navigate("/dashboard", { replace: true });
        break;

      case "student":
        navigate("/profile", { replace: true });
        break;

      default:
        navigate("/profile", { replace: true });
        break;
    }
  };

  const handleGoogleIdToken = async (idToken) => {
    if (!idToken) return;

    const res = await loginWithGoogle(idToken);

    if (res?.success || localStorage.getItem("token")) {
      const userRole = res?.user?.role || localStorage.getItem("role");
      redirectByRole(userRole);
    }
  };

  const handleLoginAndRedirect = async (e) => {
    await handleLogin(e);

    if (isSuccess || localStorage.getItem("token")) {
      const userRole = localStorage.getItem("role");
      redirectByRole(userRole);
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #f5f6fa, #eaeef3)",
      }}
    >
      <LoginForm
        email={email}
        password={password}
        showPw={showPw}
        loading={loading}
        message={message}
        isSuccess={isSuccess}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePw={() => setShowPw((s) => !s)}
        onSubmit={handleLoginAndRedirect}
        onMicrosoft={microsoftLogin}
        onGoogleIdToken={handleGoogleIdToken}
      />
    </Container>
  );
}
