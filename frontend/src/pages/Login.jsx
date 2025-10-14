import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result?.success) {
        setIsSuccess(true);
        const name = result?.user?.firstName || "de vuelta";
        setMessage(`¡Bienvenido, ${name}!`);
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setIsSuccess(false);
        setMessage(result?.error || "No se pudo iniciar sesión.");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Error inesperado al iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Lógica para iniciar sesión con Google
  };

  const handleMicrosoftLogin = () => {
    // Lógica para iniciar sesión con Microsoft
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
      <Box
        sx={{
          width: "90%",
          maxWidth: 700,
          p: 6,
          boxShadow: 8,
          borderRadius: 4,
          backgroundColor: "white",
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
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Iniciar Sesión"}
          </Button>
        </form>
         <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleGoogleLogin}
            sx={{ flex: 1, marginRight: 1 }}
          >
            Continuar con Google
          </Button>
          <Button
            variant="outlined"
            onClick={handleMicrosoftLogin}
            sx={{ flex: 1, marginLeft: 1 }}
          >
            Continuar con Microsoft
          </Button>
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
