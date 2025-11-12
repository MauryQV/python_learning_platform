import { Box, Container, Paper, Stack, Typography, TextField, Button, MenuItem, IconButton, Tooltip, Menu,} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { COLORS } from "@/shared/config/colors";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
        setUploading(true);
        const up = await profileApi.uploadAvatar(avatarFile);
        profileImage = up?.url || profileImage;
        setUploading(false);
      }

      // 2️⃣ Update other fields
      const payload = {
        name: (form.name || fallbackFullName).trim(),
        birthday: form.birthday || "",
        gender: form.gender || "",
        profession: form.profession || "",
        bio: (form.bio || "").slice(0, 150),
        profileImage,
      };

      await profileApi.update(payload);
      await fetchProfile();
      navigate("/profile");
    } catch (err) {
      setUploading(false);
      console.error("❌ Failed to update profile:", err);
      alert("No se pudo guardar los cambios.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);
  const hasPhoto = Boolean(avatarPreview || initialUser?.profileImage);

  const triggerUpload = () => fileInputRef.current?.click();

  const handleDeleteAvatar = async () => {
    try {
      await profileApi.deleteAvatar();
      setAvatarPreview("");
      setAvatarFile(null);
      await profileApi.update({ profileImage: "" });
      await fetchProfile();
    } catch (err) {
      console.error("❌ Error al eliminar la foto:", err);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* HEADER */}
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

      {/* MAIN CONTENT */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "360px 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* LEFT: Avatar + Card */}
          <Box sx={{ position: "relative" }}>
            <ProfileCard
              name={form.name || fallbackFullName || "Tu nombre"}
              role={initialUser?.role || "student"}
              email={initialUser?.email}
              bio={form.bio || ""}
              avatarUrl={avatarPreview || initialUser?.profileImage}
            />

            {/* hidden input for file */}
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                onPickAvatar(e);
                handleMenuClose();
              }}
            />

            {/* 📸 icon and menu */}
            <IconButton
              aria-label="Opciones de foto"
              onClick={handleMenuOpen}
              sx={{
                position: "absolute",
                top: 70,
                left: "calc(50% + 70px)",
                transform: "translate(-50%, -50%)",
                bgcolor: "#fff",
                border: `2px solid ${COLORS.YELLOW}`,
                boxShadow: 2,
                "&:hover": { bgcolor: "#f7f7f7" },
                width: 40,
                height: 40,
              }}
            >
              <PhotoCameraIcon />
            </IconButton>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={triggerUpload}>
                <UploadIcon sx={{ mr: 1 }} />
                Subir foto
              </MenuItem>

              {hasPhoto && (
                <MenuItem onClick={handleDeleteAvatar}>
                  <DeleteIcon sx={{ mr: 1 }} />
                  Borrar foto
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* RIGHT: Form */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <SectionTitle>Editar Perfil</SectionTitle>

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
                    disabled={uploading}
                    sx={{
                      bgcolor: COLORS.BLUE,
                      color: "#fff",
                      fontWeight: "bold",
                      "&:hover": { bgcolor: "#15a822ff" },
                    }}
                  >
                    {uploading ? "SUBIENDO..." : "GUARDAR CAMBIOS"}
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
