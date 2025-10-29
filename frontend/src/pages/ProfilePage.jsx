import { Box, Container, Paper, Stack, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { COLORS } from "@/shared/config/colors";
import { useProfileModel } from "@/features/profile/model/useProfileModel";
import ProfileCard from "@/features/profile/ui/ProfileCard";
import GoalsEditor from "@/features/profile/ui/GoalsEditor";
import SkillsList from "@/features/profile/ui/SkillsList";
import SectionTitle from "@/features/profile/ui/SectionTitle";


export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    state: { initialUser, goals, goalInput },
    actions: { setGoalInput, addGoal, removeGoal, onGoalKey },
  } = useProfileModel();

  const courses = initialUser.courses || [];

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
            name={initialUser.name || "Tu nombre"}
            role={initialUser.role || "student"}
            email={initialUser.email}
            bio={initialUser.bio || "Bio"}
            avatarUrl={initialUser.avatarUrl}
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
            {/* LEFT stack: Mi Perfil + Cursos */}
            <Stack spacing={3}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <SectionTitle>Mi Perfil</SectionTitle>

                <Typography variant="body1" sx={{ fontWeight: 500, mt: 2 }}>
                  Fecha de nacimiento:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {initialUser.birthday || "No especificada"}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 500, mt: 2 }}>
                  Género:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {initialUser.gender || "No especificado"}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 500, mt: 2 }}>
                  Profesión:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {initialUser.profession || "No especificada"}
                </Typography>

                {/* Editar Perfil Button */}
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    bgcolor: COLORS.BLUE,
                    color: "#fff",
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#15a822ff" },
                  }}
                  onClick={() => navigate("/edit-profile")}

                >
                  Editar Perfil
                </Button>
              </Paper>

              {/* Cursos Section */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <SectionTitle>Cursos</SectionTitle>
                {courses.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Aún no estás inscrito en ningún curso.
                  </Typography>
                ) : (
                  <List>
                    {courses.map((course, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemText primary={course.name} secondary={course.description} />
                      </ListItem>
                    ))}
                  </List>
                )}
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

              <SkillsList title="Tecnologías" skills={initialUser.skills} />
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
