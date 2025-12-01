import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { COLORS } from "@/shared/config/colors";
import { useProfileModel } from "@/features/profile/model/useProfileModel";
import ProfileCard from "@/features/profile/ui/ProfileCard";
import GoalsEditor from "@/features/profile/ui/GoalsEditor";
import SkillsList from "@/features/profile/ui/SkillsList";
import SectionTitle from "@/features/profile/ui/SectionTitle";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuth();

  const {
    state: { initialUser, goals, goalInput },
    actions: { setGoalInput, addGoal, removeGoal, onGoalKey, fetchProfile },
  } = useProfileModel();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fullName =
    initialUser?.name ||
    `${initialUser?.firstName ?? ""} ${initialUser?.lastName ?? ""}`.trim() ||
    "Tu nombre";

  const courses = initialUser?.courses || [];

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
          <ProfileCard
            name={fullName}
            role={user?.role || initialUser?.role || "student"}
            email={initialUser?.email}
            bio={initialUser?.bio || "Bio"}
            avatarUrl={initialUser?.profileImage}
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
                  {initialUser?.birthday
                    ? new Date(initialUser.birthday).toISOString().slice(0, 10)
                    : "No especificada"}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 500, mt: 2 }}>
                  Género:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {initialUser?.gender || "No especificado"}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 500, mt: 2 }}>
                  Profesión:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {initialUser?.profession || "No especificada"}
                </Typography>

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
                    {courses.map((course, idx) => (
                      <ListItem key={idx} disablePadding>
                        <ListItemText
                          primary={course.name}
                          secondary={course.description}
                        />
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

              <SkillsList
                title="Tecnologías"
                skills={
                  initialUser?.skills || [
                    { name: "Software", level: 80 },
                    { name: "Mobile App", level: 70 },
                    { name: "Full Stack", level: 90 },
                  ]
                }
              />
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
