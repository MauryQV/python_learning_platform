import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { TeacherEditSidebarNav } from "@/features/teacher_edit/ui/TeacherEditSidebarNav";
import { TeacherEditTopBar } from "@/features/teacher_edit/ui/TeacherEditTopBar";
import { TeacherEditCoursesGrid } from "@/features/teacher_edit/ui/TeacherEditCoursesGrid";

import { useTeacherEditCourses } from "@/features/teacher_edit/model/useTeacherEditCourses";

export default function TeacherEditCoursesPage() {
  const navigate = useNavigate();

  const { courses, loading } = useTeacherEditCourses();

  if (loading) {
    return (
      <div className="page-layout">
        <TeacherEditSidebarNav />
        <main className="main-content">
          <TeacherEditTopBar />
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout" style={{ display: "flex" }}>
      <TeacherEditSidebarNav />

      <main className="main-content" style={{ flexGrow: 1 }}>
        <TeacherEditTopBar />

        <Box sx={{ p: 3 }}>
          <TeacherEditCoursesGrid
            courses={courses}
            onViewCourse={(id) => navigate(`/teacher-edit/course/${id}`)}
          />
        </Box>
      </main>
    </div>
  );
}
