// frontend/src/features/teacher_edit/ui/TeacherEditCoursesGrid.jsx
import { Box } from "@mui/material";
import { TeacherEditCourseCard } from "@/features/teacher_edit/ui/TeacherEditCourseCard";

export function TeacherEditCoursesGrid({ courses, onViewCourse }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
      }}
    >
      {courses.map((course) => (
        <TeacherEditCourseCard
          key={course.id}
          course={course}
          onView={onViewCourse}
        />
      ))}
    </Box>
  );
}
