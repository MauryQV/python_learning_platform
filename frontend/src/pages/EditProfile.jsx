import { Box, Container, Paper, Stack, Typography, TextField, Button, MenuItem,} from "@mui/material";
import { COLORS } from "@/shared/config/colors";
import { useNavigate } from "react-router-dom";
import { useProfileModel } from "@/features/profile/model/useProfileModel";
import ProfileCard from "@/features/profile/ui/ProfileCard";
import SectionTitle from "@/features/profile/ui/SectionTitle";

export default function EditProfile() {
  const navigate = useNavigate();

  const {
    state: { initialUser, form, error, saving },
    actions: { onChange, onSubmit, onCancel },
  } = useProfileModel();

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving profile changes:", form);
  };

  const handleCancel = () => {
    onCancel?.();
    navigate("/profile"); 
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Banner */}
      <Box sx={{ bgcolor: COLORS.YELLOW, py: 2.5, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            LEARNING WITH PYTHON
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "360px 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* LEFT: Profile Card */}
          <ProfileCard
            name={form.name || initialUser.name || "Tu nombre"}
            role={initialUser.role || "student"}
            email={initialUser.email}
            bio={form.bio || initialUser.bio || ""}
            avatarUrl={initialUser.avatarUrl}
          />

          {/* RIGHT: Edit form */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <SectionTitle>Editar Perfil</SectionTitle>

            <form onSubmit={handleSave}>
              <Stack spacing={2.5} sx={{ mt: 2 }}>
                {/* Name */}
                <TextField
                  label="Nombre completo"
                  name="name"
                  value={form.name || ""}
                  onChange={onChange}
                  fullWidth
                />

                {/* Birthday */}
                <TextField
                  label="Fecha de nacimiento"
                  name="birthday"
                  type="date"
                  value={form.birthday || ""}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                {/* Gender */}
                <TextField
                  select
                  label="Género"
                  name="gender"
                  value={form.gender || ""}
                  onChange={onChange}
                  fullWidth
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                </TextField>

                {/* Profession */}
                <TextField
                  label="Profesión"
                  name="profession"
                  value={form.profession || ""}
                  onChange={onChange}
                  fullWidth
                />

                {/* Bio */}
                <TextField
                  label="Biografía"
                  name="bio"
                  multiline
                  rows={3}
                  value={form.bio || ""}
                  onChange={onChange}
                  fullWidth
                />

                {/* Buttons */}
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: COLORS.BLUE,
                      color: "#fff",
                      fontWeight: "bold",
                      "&:hover": { bgcolor: "#15a822ff" },
                    }}
                    disabled={saving}
                  >
                    Guardar cambios
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </Stack>

                {error && (
                  <Typography color="error" variant="body2">
                    {error.message || "Error al guardar los cambios"}
                  </Typography>
                )}
              </Stack>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
