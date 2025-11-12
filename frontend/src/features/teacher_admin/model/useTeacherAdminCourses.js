// PATH: frontend/src/features/teacher_admin/model/useTeacherAdminCourses.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherAdminApi } from "@/features/teacher_admin/api/teacherAdminApi";

/**
 * Hooks centralizados para Cursos (admin-teacher)
 */
export const useTeacherAdminCourses = () => {
  const qc = useQueryClient();

  /* --------- Queries --------- */
  const coursesQuery = useQuery({
    queryKey: ["ta", "courses"],
    queryFn: teacherAdminApi.listCourses,
    staleTime: 30_000,
    retry: false, // si 500, no spamear
  });

  const teachersQuery = useQuery({
    queryKey: ["ta", "teachers"],
    queryFn: teacherAdminApi.listTeachers,
    staleTime: 60_000,
    retry: false,
  });

  /* --------- Mutations --------- */
  const createCourse = useMutation({
    mutationFn: teacherAdminApi.createCourse,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["ta", "courses"] });
    },
  });

  const assignTeacher = useMutation({
    mutationFn: teacherAdminApi.assignTeacher,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["ta", "courses"] });
    },
  });

  const removeTeacher = useMutation({
    mutationFn: teacherAdminApi.removeTeacher,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["ta", "courses"] });
    },
  });

  // “update local” temporal para cambios sin endpoint (nombre/desc UI)
  const localUpdate = useMutation({
    mutationFn: async ({ id, patch }) => {
      const prev = qc.getQueryData(["ta", "courses"]) ?? [];
      const next = prev.map((c) => (c.id === id ? { ...c, ...patch } : c));
      qc.setQueryData(["ta", "courses"], next);
      return next.find((c) => c.id === id);
    },
  });

  return {
    coursesQuery,
    teachersQuery,
    createCourse,
    updateCourse: {
      assignTeacher,
      local: localUpdate,
    },
    deleteCourse: removeTeacher,
  };
};

