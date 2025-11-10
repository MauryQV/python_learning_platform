import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CoursesGrid from "./ui/CoursesGrid";
import CourseFilters from "./ui/CourseFilters";
import SearchBar from "./ui/SearchBar";
import CourseCreateDialog from "./ui/CourseCreateDialog"; 

const Sidebar = styled(Box)(({ theme }) => ({
  width: 256,
  background: "#20518dff",
  color: "#fff",
  padding: theme.spacing(2.5),
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },
}));

export default function TeacherAdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openCreate, setOpenCreate] = useState(false); 

  // mock teachers; replace with API later
  const teachers = [
    { id: 1, name: "Prof. María García" },
    { id: 2, name: "Prof. Juan Pérez" },
    { id: 3, name: "Prof. Ana Martínez" },
  ];

  const handleCreate = async (payload) => {
    // TODO: call your API (POST /cursos)
    // await api.courses.create(payload)
    console.log("Creating course:", payload);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f7f8fa" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar>
        <Typography variant="h6" fontWeight={800} sx={{ color: "#f6d458" }}>
          Learning with Python
        </Typography>

        <List sx={{ mt: 1 }}>
          <ListItemButton selected sx={{ borderRadius: 1 }}>
            <ListItemText primary="Cursos" />
          </ListItemButton>
          <ListItemButton sx={{ borderRadius: 1 }}>
            <ListItemText primary="Docentes" />
          </ListItemButton>
          <ListItemButton sx={{ borderRadius: 1 }}>
            <ListItemText primary="Estudiantes" />
          </ListItemButton>
        </List>
      </Sidebar>

      {/* Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            bgcolor: "#fff",
            borderBottom: "1px solid #e6e8eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 22, md: 28 } }}>
            Panel de Administración
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="contained"
              onClick={() => setOpenCreate(true)} 
              sx={{
                bgcolor: "#f6d458",
                color: "#000",
                fontWeight: 700,
                ":hover": { bgcolor: "#eac94f" },
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              + Crear Curso
            </Button>

            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1.2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#e5e7eb",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                }}
              >
                PA
              </Box>
              <Box sx={{ lineHeight: 1 }}>
                <Typography variant="body2" fontWeight={700}>
                  Prof. Admin
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Administrador
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Panel (search + filters) */}
        <Box sx={{ px: 3, py: 3 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e6e8eb",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(16,24,40,.06)",
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 1.5,
                alignItems: { md: "center" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <SearchBar search={search} setSearch={setSearch} />
              </Box>

              <Button
                variant="contained"
                onClick={() => setOpenCreate(true)} 
                sx={{
                  bgcolor: "#f6d458",
                  color: "#000",
                  fontWeight: 700,
                  ":hover": { bgcolor: "#eac94f" },
                  display: { xs: "inline-flex", md: "none" },
                }}
              >
                + Crear Curso
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />
          </Box>

          {/* Grid */}
          <Box sx={{ mt: 3 }}>
            <CoursesGrid search={search} filter={filterStatus} />
          </Box>
        </Box>
      </Box>

      {/* Dialog mount */}
      <CourseCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
        teachers={teachers}
      />
    </Box>
  );
}
