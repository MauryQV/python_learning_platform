import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Sesión iniciada correctamente.");
      setTimeout(() => navigate("/"), 1500);
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
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Iniciar Sesión
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
            mt={2}
            align="center"
            sx={{ color: message.includes(":)") ? "green" : "red" }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
