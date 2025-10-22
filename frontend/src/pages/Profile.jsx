// src/pages/Profile.jsx
import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Button, Chip, Container, Divider, IconButton, LinearProgress, Paper, Stack, TextField, Typography,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const MAX_BIO = 300;
const YELLOW = "#F6D458";

export default function Profile() {
  const initialUser = useMemo(
    () => ({
      name: "",
      role: "Software Developer",
      email: "",
      bio: "Bio",
      avatarUrl:
        "",
    }),
    []
  );

  const [form, setForm] = useState({ name: "", bio: "" });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [goals, setGoals] = useState(["Texto"]);
  const [goalInput, setGoalInput] = useState("");

  useEffect(() => {
    setForm({ name: initialUser.name, bio: initialUser.bio || "" });
  }, [initialUser]);

  const onChange = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
    setError("");
  };

  const onCancel = () => {
    setForm({ name: initialUser.name, bio: initialUser.bio || "" });
    setDirty(false);
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "El nombre es obligatorio";
    if (form.bio.length > MAX_BIO) return `Máximo ${MAX_BIO} caracteres en la biografía`;
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setDirty(false);
    } catch (err) {
      setError(err.message || "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const addGoal = () => {
    const val = goalInput.trim();
    if (!val) return;
    if (goals.includes(val)) return;
    setGoals((g) => [...g, val]);
    setGoalInput("");
  };

  const removeGoal = (val) => setGoals((g) => g.filter((x) => x !== val));
  const onGoalKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGoal();
    }
  };

  const SectionTitle = ({ children }) => (
    <Box
      sx={{
        display: "inline-flex",
        px: 3,
        py: 1,
        bgcolor: YELLOW,
        borderRadius: 1,
        mb: 2,
        alignItems: "center",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {children}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Banner */}
      <Box sx={{ bgcolor: YELLOW, py: 2.5, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            LEARNING WITH PYTHON
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* ---- Two-column layout ---- */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "360px 1fr",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* LEFT: Profile Card */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              position: { lg: "sticky" },
              top: { lg: 24 },
              height: "fit-content",
            }}
          >
            <Box sx={{ display: "grid", placeItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  border: `10px solid ${YELLOW}`,
                  overflow: "hidden",
                }}
              >
                <Avatar
                  src={initialUser.avatarUrl}
                  alt={form.name}
                  sx={{ width: "100%", height: "100%" }}
                />
              </Box>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center" }}>
              {form.name || "Tu nombre"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mb: 2 }}>
              {initialUser.role}
            </Typography>

            <Box sx={{ display: "grid", placeItems: "center", my: 1 }}>
              <Chip label="“ ”" color="primary" variant="outlined" />
            </Box>

            <Typography variant="body2" sx={{ textAlign: "center", minHeight: 60, whiteSpace: "pre-wrap" }}>
              {form.bio || "Bio"}
            </Typography>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              {initialUser.email}
            </Typography>
          </Paper>

          {/* RIGHT: Two-column internal grid (no gaps) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            {/* LEFT stack: Mi Perfil + Acerca de mí */}
            <Stack spacing={3}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <SectionTitle>Mi Perfil</SectionTitle>
                <Box component="form" onSubmit={onSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label="Nombre completo"
                      fullWidth
                      value={form.name}
                      onChange={onChange("name")}
                      autoComplete="name"
                    />
                    <TextField
                      label="Biografía"
                      fullWidth
                      value={form.bio}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_BIO) onChange("bio")(e);
                      }}
                      multiline
                      minRows={4}
                      helperText={`${form.bio.length}/${MAX_BIO}`}
                    />

                    {error && (
                      <Typography color="error" variant="body2">
                        {error}
                      </Typography>
                    )}

                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      <Button variant="outlined" onClick={onCancel} disabled={saving || !dirty}>
                        Cancelar
                      </Button>
                      <Button type="submit" variant="contained" disabled={saving || !dirty}>
                        {saving ? "Guardando..." : "Guardar"}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <SectionTitle>Acerca de mí</SectionTitle>
                <Typography variant="body2" color="text.secondary">
                  About me
                </Typography>
              </Paper>
            </Stack>

            {/* RIGHT stack: Goals + Tecnologías */}
            <Stack spacing={3}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <SectionTitle>Goals</SectionTitle>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    label="Añadir objetivo"
                    fullWidth
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={onGoalKey}
                  />
                  <IconButton color="primary" aria-label="add goal" onClick={addGoal} sx={{ alignSelf: "center" }}>
                    <AddIcon />
                  </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {goals.map((g) => (
                    <Chip
                      key={g}
                      label={g}
                      onDelete={() => removeGoal(g)}
                      deleteIcon={<CloseIcon />}
                      sx={{ mb: 1 }}
                    />
                  ))}
                  {goals.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No hay objetivos. Agrega uno arriba.
                    </Typography>
                  )}
                </Stack>
              </Paper>

              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <SectionTitle>Tecnologías</SectionTitle>
                <Skill label="Software" value={80} />
                <Skill label="Mobile App" value={70} />
                <Skill label="Full Stack" value={90} />
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function Skill({ label, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{label}</Typography>
      <LinearProgress variant="determinate" value={value} sx={{ height: 10, borderRadius: 5 }} />
    </Box>
  );
}
