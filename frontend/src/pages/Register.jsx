import { useState } from "react";
import {Box, Button, Checkbox, Container, FormControlLabel, Grid, IconButton, InputAdornment, Link, TextField, Typography, Paper,} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordStrengthBar from "./PasswordStrengthBar.jsx";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";             
import { registerUser } from "../api/auth";                   

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accepted: false,
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
        form.firstName,
        form.lastName,
        form.email,
        form.password,
        form.confirmPassword
      );

      if (!res?.success) {
        setErrors((prev) => ({
          ...prev,
          submit: res?.message || "No se pudo registrar",
        }));
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setErrors((prev) => ({ ...prev, submit: error.message }));
        setSubmitting(false);
        return;
      }

      localStorage.setItem("pendingEmail", form.email);

      nav("/verify-email");
    } catch (err) {
      const msg =
        err?.message || err?.error || "No se pudo crear la cuenta. Intenta de nuevo.";
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crea tu cuenta
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Comienza a aprender Python con módulos interactivos
        </Typography>

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

            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errors.submit}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
              >
                {submitting ? "Creando..." : "Crear cuenta"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes cuenta?{" "}
                <Link component={RouterLink} to="/login">
                  Inicia Sesión
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
