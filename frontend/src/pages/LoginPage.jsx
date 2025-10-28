// src/pages/LoginPage.jsx
import { Container } from "@mui/material";
import LoginForm from "@/features/auth/ui/LoginForm";
import { useLoginModel } from "@/features/auth/model/useLogin";

export default function LoginPage() {
  const {
    state: { email, password, showPw, loading, message, isSuccess },
    actions: { setEmail, setPassword, setShowPw, handleLogin, googleLogin, microsoftLogin },
  } = useLoginModel();

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex", justifyContent: "center", alignItems: "center",
        minHeight: "100vh", width: "100vw",
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
        onSubmit={handleLogin}
        onGoogle={() => googleLogin()}
        onMicrosoft={microsoftLogin}
      />
    </Container>
  );
}
