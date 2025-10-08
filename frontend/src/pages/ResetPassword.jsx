import { useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { supabase } from "../lib/supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMessage("Las contraseñas no coinciden");
    if (password.length < 8) return setMessage("Contraseña demasiado corta");
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else setMessage("Contraseña actualizada exitosamente");
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>Restablecer contraseña</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Ingresa tu nueva contraseña.
        </Typography>
        <Box component="form" onSubmit={handleReset}>
          <TextField
            fullWidth
            type="password"
            label="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
          {message && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
