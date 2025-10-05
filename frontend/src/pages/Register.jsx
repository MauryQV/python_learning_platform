import { useState } from "react";
import {
  Box, Button, Checkbox, Container, FormControlLabel,
  Grid, IconButton, InputAdornment, Link, TextField, Typography, Paper
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordStrengthBar from "./PasswordStrengthBar.jsx";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "", accepted: false
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
    if (!form.firstName.trim()) err.firstName = "Required";
    if (!form.lastName.trim()) err.lastName = "Required";
    if (!emailValid(form.email)) err.email = "Invalid email";
    if (!pwValid(form.password)) err.password = "Min 8, upper, lower, number";
    if (form.password !== form.confirmPassword) err.confirmPassword = "Passwords do not match";
    if (!form.accepted) err.accepted = "You must accept Terms & Privacy";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onChange = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      nav("/verify-email");
    }, 700);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>Create your account</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Start learning Python with interactive modules 
        </Typography>

        <Box component="form" noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First name"
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
                label="Last name"
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
                label="Password"
                fullWidth
                value={form.password}
                onChange={onChange("password")}
                error={!!errors.password}
                helperText={errors.password || "Use at least 8 chars with upper/lower/number"}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw(s => !s)} edge="end">
                        {showPw ? <VisibilityOff/> : <Visibility/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <PasswordStrengthBar password={form.password} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={showPw2 ? "text" : "password"}
                label="Confirm password"
                fullWidth
                value={form.confirmPassword}
                onChange={onChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw2(s => !s)} edge="end">
                        {showPw2 ? <VisibilityOff/> : <Visibility/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox checked={form.accepted} onChange={onChange("accepted")} />
                }
                label={
                  <Typography variant="body2">
                    Acepto <Link href="#">Terms</Link> & <Link href="#">Privacy Policy</Link>.
                  </Typography>
                }
              />
              {errors.accepted && (
                <Typography variant="caption" color="error">{errors.accepted}</Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth type="submit" variant="contained" size="large"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create account"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Ya tienes cuenta? <Link href="#">Sign in</Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
