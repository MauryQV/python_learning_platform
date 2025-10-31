import { Box, Container, Paper, Stack, Typography, TextField, Button, MenuItem, IconButton, Tooltip, Avatar,} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { COLORS } from "@/shared/config/colors";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useProfileModel } from "@/features/profile/model/useProfileModel";
import ProfileCard from "@/features/profile/ui/ProfileCard";
import SectionTitle from "@/features/profile/ui/SectionTitle";
import { profileApi } from "@/api/profile";
import { useAuth } from "@/context/AuthContext";

export default function EditProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const {
    state: { initialUser },
    actions: { fetchProfile },
  } = useProfileModel();

  const fallbackFullName = useMemo(() => {
    const n =
      initialUser?.name ??
      `${initialUser?.firstName ?? ""} ${initialUser?.lastName ?? ""}`;
    return (n || "").trim();
  }, [initialUser]);

  const [form, setForm] = useState({
    name: "",
    birthday: "",
    gender: "",
    profession: "",
    bio: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (!initialUser?.email) fetchProfile();
  }, []);

  useEffect(() => {
    if (!initialUser?.email) return;
    const birthdayISO = initialUser?.birthday
      ? new Date(initialUser.birthday).toISOString().slice(0, 10)
      : "";

    setForm({
      name: fallbackFullName || "",
      birthday: birthdayISO,
      gender: initialUser?.gender || "",
      profession: initialUser?.profession || "",
      bio: initialUser?.bio || "",
    });
  }, [initialUser, fallbackFullName]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    let profileImage = initialUser?.profileImage || "";
    try {
      if (avatarFile) {
        const up = await profileApi.uploadAvatar(avatarFile);
        profileImage = up?.url || profileImage;
      }

      const payload = {
        name: (form.name || fallbackFullName).trim(),
        birthday: form.birthday || "",
        gender: form.gender || "",
        profession: form.profession || "",
        bio: (form.bio || "").slice(0, 150),
        profileImage, // ✅ normalized key
      };

      await profileApi.update(payload);
      await fetchProfile();
      navigate("/profile");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <Box
        sx={{
          bgcolor: COLORS.YELLOW,
          py: 2.5,
          mb: 4,
          position: "relative",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            LEARNING WITH PYTHON
          </Typography>

          <Tooltip title="Cerrar sesión">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#000",
                bgcolor: "#fff",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
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
          {/* LEFT preview card */}
          <ProfileCard
            name={form.name || fallbackFullName || "Tu nombre"}
            role={initialUser?.role || "student"}
            email={initialUser?.email}
            bio={form.bio || ""}
            avatarUrl={avatarPreview || initialUser?.profileImage}
          />

          {/* RIGHT editable form */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <SectionTitle>Editar Perfil</SectionTitle>

            <Stack spacing={1} alignItems="center" sx={{ mb: 2, mt: 1 }}>
              <Avatar
                src={avatarPreview || initialUser?.profileImage || ""}
                alt={form.name || "Avatar"}
                sx={{ width: 112, height: 112 }}
              />
              <Button variant="outlined" component="label">
                Elegir foto
                <input hidden type="file" accept="image/*" onChange={onPickAvatar} />
              </Button>
              {!!avatarFile && (
                <Typography variant="caption" color="text.secondary">
                  {avatarFile.name} ({Math.round(avatarFile.size / 1024)} KB)
                </Typography>
              )}
            </Stack>

            <form onSubmit={handleSave}>
              <Stack spacing={2.5} sx={{ mt: 2 }}>
                <TextField
                  label="Nombre completo"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  fullWidth
                />

                <TextField
                  label="Fecha de nacimiento"
                  name="birthday"
                  type="date"
                  value={form.birthday}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                <TextField
                  select
                  label="Género"
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                  fullWidth
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                </TextField>

                <TextField
                  label="Profesión"
                  name="profession"
                  value={form.profession}
                  onChange={onChange}
                  fullWidth
                />

                <TextField
                  label="Biografía"
                  name="bio"
                  multiline
                  rows={3}
                  value={form.bio}
                  onChange={onChange}
                  fullWidth
                  inputProps={{ maxLength: 150 }}
                  helperText={`${form.bio.length}/150`}
                />

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
                  >
                    GUARDAR CAMBIOS
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => navigate("/profile")}
                  >
                    CANCELAR
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
