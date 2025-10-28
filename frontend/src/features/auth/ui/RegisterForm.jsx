import {
  Box, Button, Checkbox, Container, FormControlLabel, Grid,
  IconButton, InputAdornment, Link, TextField, Typography, Paper,
  Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import SocialAuthButtons from "@/features/auth/ui/SocialAuthButtons";
//import PasswordStrengthBar from "@/shared/ui/PasswordStrengthBar"; 

export default function RegisterForm({
  form, errors, submitting, showPw, showPw2, passwordStrength,
  onChange, setShowPw, setShowPw2, onSubmit,
  onGoogle, onMicrosoft,
}) {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Crea tu cuenta
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }} align="center">
          Comienza a aprender Python con módulos interactivos
        </Typography>

        <Box component="form" noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                fullWidth
                value={form.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
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
                onChange={(e) => onChange("lastName", e.target.value)}
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
                onChange={(e) => onChange("email", e.target.value)}
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
                onChange={(e) => onChange("password", e.target.value)}
                error={!!errors.password}
                helperText={errors.password || "Mínimo 8, mayúscula, minúscula y un número"}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw((s) => !s)} edge="end" aria-label="toggle password visibility">
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <PasswordStrengthBar password={passwordStrength} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={showPw2 ? "text" : "password"}
                label="Confirma contraseña"
                fullWidth
                value={form.confirmPassword}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw2((s) => !s)} edge="end" aria-label="toggle confirm password visibility">
                        {showPw2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={form.accepted} onChange={(e) => onChange("accepted", e.target.checked)} />}
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
                <Typography color="error" variant="body2" align="center">
                  {errors.submit}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 1 }}>
                <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ minWidth: 260, py: 1.2 }}>
                  {submitting ? "Creando..." : "CREAR CUENTA"}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", m: 0 }}>
                  ¿Ya tienes cuenta?{" "}
                  <Link component={RouterLink} to="/login">
                    Inicia Sesión
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ my: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary">o regístrate con</Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 2 }}>
            <SocialAuthButtons onGoogle={onGoogle} onMicrosoft={onMicrosoft} />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
