import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:2999/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.token) {
        setMessage(`¡Bienvenido, ${response.data.user.firstName}!`);
        localStorage.setItem("token", response.data.token);

        // Espera un poco antes de redirigir
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage("Credenciales incorrectas o error al iniciar sesión.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setMessage("Error en el servidor o credenciales incorrectas.");
    } finally {
      setLoading(false);
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
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Iniciar Sesión"}
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