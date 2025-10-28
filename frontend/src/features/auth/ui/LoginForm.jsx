// src/features/auth/ui/LoginForm.jsx
import {TextField, Button, Typography, Box, CircularProgress,InputAdornment, IconButton, Divider} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SocialAuthButtons from "./SocialAuthButtons";

export default function LoginForm({
  email, password, showPw, loading, message, isSuccess,
  onEmailChange, onPasswordChange, onTogglePw,
  onSubmit, onGoogle, onMicrosoft,
}) {
  return (
    <Box sx={{ width: "90%", maxWidth: 700, p: 6, boxShadow: 8, borderRadius: 4, backgroundColor: "white" }}>
      <Typography variant="h4" mb={3} align="center" fontWeight="normal">
        Iniciar Sesión
      </Typography>

      <form onSubmit={onSubmit} noValidate>
        <TextField
          label="Correo electrónico"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
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
          onChange={(e) => onPasswordChange(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={onTogglePw} edge="end" aria-label="toggle password visibility">
                  {showPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography align="center" fontSize={14} mt={1}>
          <Link to="/reset-password" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "normal" }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </Typography>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Iniciar Sesión"}
        </Button>
      </form>

      <Box sx={{ my: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary">o continúa con</Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <SocialAuthButtons onGoogle={onGoogle} onMicrosoft={onMicrosoft} />
      </Box>

      <Typography mt={2} align="center" fontSize={14}>
        ¿No tienes cuenta?{" "}
        <Link to="/register" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "normal" }}>
          Regístrate aquí
        </Link>
      </Typography>

      {message && (
        <Typography mt={3} align="center" sx={{ color: isSuccess ? "green" : "red", fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
