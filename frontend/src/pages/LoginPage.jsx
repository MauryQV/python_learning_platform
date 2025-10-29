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

  const handleGoogleIdToken = async (idToken) => {
    if (!idToken) return;
    const res = await loginWithGoogle(idToken);
    if (res?.success || localStorage.getItem("token")) {
      navigate("/profile");
    }
  };

  const handleLoginAndRedirect = async (e) => {
    await handleLogin(e);
    if (isSuccess || localStorage.getItem("token")) {
      navigate("/profile");
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
