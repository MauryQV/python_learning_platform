import React, { useState } from "react";
import {
  TextField, Button, Container, Typography, Box, CircularProgress,
  InputAdornment, IconButton, Tooltip, Divider
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

function GoogleLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083h-1.611v-.083H24v8h11.3c-1.635 4.657-6.05 8-11.3 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.844 1.156 7.957 3.043l5.657-5.657C33.978 6.114 29.28 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.342-.138-2.651-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.33 16.003 18.792 12 24 12c3.059 0 5.844 1.156 7.957 3.043l5.657-5.657C33.978 6.114 29.28 4 24 4 16.317 4 9.64 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.175 0 9.814-1.97 13.275-5.172l-6.124-5.178C29.065 35.932 26.655 37 24 37c-5.219 0-9.644-3.318-11.286-7.958l-6.54 5.035C9.466 39.64 16.212 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H24v8h11.3c-.78 2.22-2.201 4.092-4.149 5.468l6.124 5.178C39.048 35.79 44 30.667 44 24c0-1.342-.138-2.651-.389-3.917z"/>
    </svg>
  );
}

function MicrosoftLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 23 23" aria-hidden="true">
      <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
      <rect x="12.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
      <rect x="0" y="12.5" width="10.5" height="10.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); setIsSuccess(false); setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.success) {
        setIsSuccess(true);
        const name = result?.user?.firstName || "de vuelta";
        setMessage(`¡Bienvenido, ${name}!`);
        setTimeout(() => navigate("/dashboard"), 900);
      } else {
        setIsSuccess(false);
        setMessage(result?.error || "No se pudo iniciar sesión.");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage(err?.response?.data?.message || err?.message || "Error inesperado al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const idToken = tokenResponse?.credential || tokenResponse?.access_token;
      if (!idToken) {
        setIsSuccess(false);
        setMessage("No se recibió el token de Google.");
        return;
      }
      const res = await loginWithGoogle(idToken);
      if (res?.success) {
        setIsSuccess(true);
        setMessage("¡Bienvenido con Google!");
        setTimeout(() => navigate("/dashboard"), 700);
      } else {
        setIsSuccess(false);
        setMessage(res?.error || "No se pudo iniciar sesión con Google.");
      }
    },
    onError: () => {
      setIsSuccess(false);
      setMessage("Error con Google Login. Intenta de nuevo.");
    },
    flow: "implicit", 
  });

  const handleMicrosoftLogin = () => {
    window.location.href = "https://login.microsoftonline.com/";
  };

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
      <Box
        sx={{
          width: "90%", maxWidth: 700, p: 6, boxShadow: 8,
          borderRadius: 4, backgroundColor: "white",
        }}
      >
        <Typography variant="h4" mb={3} align="center" fontWeight="normal">
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleLogin} noValidate>
          <TextField
            label="Correo electrónico"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type={showPw ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPw((s) => !s)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography align="center" fontSize={14} mt={1}>
            <Link
              to="/reset-password"
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: "normal",
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        <Box sx={{ my: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            o continúa con
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <Tooltip title="Continuar con Google">
            <IconButton
              aria-label="Continuar con Google"
              onClick={() => googleLogin()}
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                "&:hover": { backgroundColor: "grey.50" },
              }}
            >
              <GoogleLogo />
            </IconButton>
          </Tooltip>

          <Tooltip title="Continuar con Microsoft">
            <IconButton
              aria-label="Continuar con Microsoft"
              onClick={handleMicrosoftLogin}
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                "&:hover": { backgroundColor: "grey.50" },
              }}
            >
              <MicrosoftLogo />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography mt={2} align="center" fontSize={14}>
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "normal",
            }}
          >
            Regístrate aquí
          </Link>
        </Typography>

        {message && (
          <Typography
            mt={3}
            align="center"
            sx={{ color: isSuccess ? "green" : "red", fontWeight: 500 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
