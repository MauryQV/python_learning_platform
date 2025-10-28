// src/pages/LoginPage.jsx
import { Container } from "@mui/material";
import LoginForm from "@/features/auth/ui/LoginForm";
import { useLoginModel } from "@/features/auth/model/useLogin";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const {
    state: { email, password, showPw, loading, message, isSuccess },
    actions: { setEmail, setPassword, setShowPw, handleLogin, microsoftLogin },
  } = useLoginModel();

  const { loginWithGoogle } = useAuth();

  const handleGoogleIdToken = async (idToken) => {
    if (!idToken) return;
    await loginWithGoogle(idToken);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{
      display:"flex", justifyContent:"center", alignItems:"center",
      minHeight:"100vh", width:"100vw",
      background:"linear-gradient(to right, #f5f6fa, #eaeef3)",
    }}>
      <LoginForm
        email={email}
        password={password}
        showPw={showPw}
        loading={loading}
        message={message}
        isSuccess={isSuccess}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePw={() => setShowPw(s=>!s)}
        onSubmit={handleLogin}
        onMicrosoft={microsoftLogin}
        onGoogleIdToken={handleGoogleIdToken}  
      />
    </Container>
  );
}

