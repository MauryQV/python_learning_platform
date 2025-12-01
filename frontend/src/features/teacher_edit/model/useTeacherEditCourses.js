// frontend/src/features/teacher_edit/model/useTeacherEditCourses.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getAssignedCourses } from "@/features/teacher_edit/api/teacherEditApi";

//Hook para obtener cursos asignados al profesor
async function fetchAssignedCourses(userId) {
  return await getAssignedCourses(userId);
}

export function useTeacherEditCourses() {
  const { user } = useAuth();
  const userId = user?.id; // ← Asegurado por el login normalization

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["teacher-edit-courses", userId],
    queryFn: () => fetchAssignedCourses(userId),
    enabled: !!userId, // solo ejecuta si el usuario existe
  });

  return {
    courses: data || [],
    loading: isLoading,
    error,
  };
}

