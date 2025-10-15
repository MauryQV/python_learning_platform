import { useState } from "react";
import {
  Box, Button, Checkbox, Container, FormControlLabel, Grid,
  IconButton, InputAdornment, Link, TextField, Typography, Paper,
  Tooltip, Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordStrengthBar from "./PasswordStrengthBar.jsx";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { registerUser } from "../api/auth";
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

export default function Register() {
  const nav = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    confirmPassword: "", accepted: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const emailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const pwValid = (p) =>
    /.{8,}/.test(p) && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p);

  const validate = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = "Obligatorio";
    if (!form.lastName.trim()) err.lastName = "Obligatorio";
    if (!emailValid(form.email)) err.email = "Email no válido";
    if (!pwValid(form.password)) err.password = "Min 8, mayúscula, minúscula, número";
    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Las contraseñas no coinciden";
    if (!form.accepted) err.accepted = "Debes aceptar los Términos y Condiciones";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onChange = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrors((prev) => ({ ...prev, submit: undefined }));

      const res = await registerUser(
        form.firstName, form.lastName, form.email, form.password, form.confirmPassword
      );

      if (!res?.success) {
        setErrors((prev) => ({ ...prev, submit: res?.message || "No se pudo registrar" }));
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });

      if (error) {
        setErrors((prev) => ({ ...prev, submit: error.message }));
        setSubmitting(false);
        return;
      }

      localStorage.setItem("pendingEmail", form.email);
      nav("/verify-email");
    } catch (err) {
      const msg = err?.message || err?.error || "No se pudo crear la cuenta. Intenta de nuevo.";
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const idToken = tokenResponse?.credential || tokenResponse?.access_token;
      if (!idToken) return;
      const res = await loginWithGoogle(idToken);
      if (res?.success) nav("/dashboard");
    },
    flow: "implicit",
  });

  const handleMicrosoftLogin = () => {
    window.location.href = "https://login.microsoftonline.com/";
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Crea tu cuenta
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }} align="center">
          Comienza a aprender Python con módulos interactivos
        </Typography>

        {/* ------ FORM ------ */}
        <Box component="form" noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                fullWidth
                value={form.firstName}
                onChange={onChange("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName}
                autoComplete="given-name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellidos"
                fullWidth
                value={form.lastName}
                onChange={onChange("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName}
                autoComplete="family-name"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
                label="Email"
                fullWidth
                value={form.email}
                onChange={onChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                autoComplete="email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={showPw ? "text" : "password"}
                label="Contraseña"
                fullWidth
                value={form.password}
                onChange={onChange("password")}
                error={!!errors.password}
                helperText={
                  errors.password ||
                  "Ingresa al menos 8 caracteres, mayúscula, minúscula y un número"
                }
                autoComplete="new-password"
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
              <PasswordStrengthBar password={form.password} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={showPw2 ? "text" : "password"}
                label="Confirma contraseña"
                fullWidth
                value={form.confirmPassword}
                onChange={onChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw2((s) => !s)}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                      >
                        {showPw2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.accepted}
                    onChange={onChange("accepted")}
                  />
                }
                label={
                  <Typography variant="body2">
                    Acepto los <Link href="#">Términos</Link> &{" "}
                    <Link href="#">Política de Privacidad</Link>.
                  </Typography>
                }
              />
              {errors.accepted && (
                <Typography variant="caption" color="error">
                  {errors.accepted}
                </Typography>
              )}
            </Grid>

            {/* Errors */}
            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2" align="center">
                  {errors.submit}
                </Typography>
              </Grid>
            )}

            {/* ------ Centered button ------ */}
            <Grid item xs={12}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{ minWidth: 260, py: 1.2 }}
                >
                  {submitting ? "Creando..." : "CREAR CUENTA"}
                </Button>
              </Box>
            </Grid>

            {/* ------ Centered login link ------ */}
            <Grid item xs={12}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", m: 0 }}
                >
                  ¿Ya tienes cuenta?{" "}
                  <Link component={RouterLink} to="/login">
                    Inicia Sesión
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* ------ Socials ------ */}
          <Box sx={{ my: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary">
              o regístrate con
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 2 }}>
              <Tooltip title="Continuar con Google">
                <IconButton
                  aria-label="Continuar con Google"
                  onClick={() => googleLogin()}
                  sx={{
                    width: 56, height: 56, borderRadius: "50%",
                    border: "1px solid", borderColor: "divider",
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
                    width: 56, height: 56, borderRadius: "50%",
                    border: "1px solid", borderColor: "divider",
                    backgroundColor: "background.paper",
                    "&:hover": { backgroundColor: "grey.50" },
                  }}
                >
                  <MicrosoftLogo />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
