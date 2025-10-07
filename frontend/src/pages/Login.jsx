import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      setMessage(`¡Bienvenido, ${result.user.firstName}!`);
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setMessage(result.error);
    }

    setLoading(false);
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
        <Typography variant="h4" mb={3} align="center" fontWeight="bold">
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Correo electrónico"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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

        <Typography mt={2} align="center" fontSize={14}>
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Regístrate aquí
          </Link>
        </Typography>

        {message && (
          <Typography
            mt={3}
            align="center"
            sx={{
              color: message.includes("¡") ? "green" : "red",
              fontWeight: 500,
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
