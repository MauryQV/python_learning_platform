// frontend/src/features/teacher_admin/ui/CoursesGrid.jsx
import { Box } from "@mui/material";
import CourseCard from "./CourseCard";

export default function CoursesGrid({
  courses = [],
  search = "",
  filter = "all",
  onEdit,
  onAssign, 
}) {
  const term = search.trim().toLowerCase();

  const filtered = courses
    .filter((c) =>
      term
        ? (c.title || "").toLowerCase().includes(term) ||
          (c.teacher || "").toLowerCase().includes(term) ||
          (c.status || "").toLowerCase().includes(term)
        : true
    )
    .filter((c) => (filter === "all" ? true : c.status === filter));

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
      {filtered.map((course) => (
        <Box key={course.id} sx={{ width: "100%" }}>
          {/*ahora pasamos onAssign a la tarjeta */}
          <CourseCard course={course} onEdit={onEdit} onAssign={onAssign} />
        </Box>
      ))}
    </Box>
  );
}

