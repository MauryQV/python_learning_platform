import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { COLORS } from "@/shared/config/colors";
import { useProfileModel } from "@/features/profile/model/useProfileModel";
import ProfileCard from "@/features/profile/ui/ProfileCard";
import ProfileForm from "@/features/profile/ui/ProfileForm";
import GoalsEditor from "@/features/profile/ui/GoalsEditor";
import SkillsList from "@/features/profile/ui/SkillsList";
import SectionTitle from "@/features/profile/ui/SectionTitle";
import { Alert, CircularProgress } from "@mui/material"; 

export default function ProfilePage() {
  const {
    state: { initialUser, form, dirty, saving, error, goals, goalInput },
    actions: { setGoalInput, onChange, onCancel, onSubmit, addGoal, removeGoal, onGoalKey },
  } = useProfileModel();

  if (!initialUser) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: "grid", placeItems: "center" }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Cargando tu perfil…
          </Typography>
        </Stack>
      </Box>
    );
  }

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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {typeof error === "string" ? error : "Ocurrió un problema al cargar/guardar tu perfil."}
          </Alert>
        )}

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
            name={form?.name || initialUser?.name || "Tu nombre"}          
            role={initialUser?.role || "student"}                           
            email={initialUser?.email || "tu-email@ejemplo.com"}        
            bio={form?.bio || initialUser?.bio || "Bio"}                       
            avatarUrl={initialUser?.avatarUrl || undefined}                   
          />

          {/* RIGHT: two columns */}
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
              <ProfileForm
                form={form}
                error={error}
                dirty={dirty}
                saving={saving}
                onChange={onChange}
                onCancel={onCancel}
                onSubmit={onSubmit}
              />

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
                <GoalsEditor
                  goals={goals}
                  goalInput={goalInput}
                  setGoalInput={setGoalInput}
                  addGoal={addGoal}
                  removeGoal={removeGoal}
                  onGoalKey={onGoalKey}
                />
              </Paper>

              <SkillsList title="Tecnologías" skills={initialUser?.skills || []} /> {/* 🔧 CHANGED */}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
