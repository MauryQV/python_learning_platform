// frontend/src/features/teacher_edit/model/useTeacherEditCourses.js

import { useQuery } from "@tanstack/react-query";
import { getAssignedCourses } from "../api/teacherEditApi";

export function useTeacherEditCourses() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["teacher-edit-courses"],
    queryFn: getAssignedCourses,
  });

  return {
    courses: data || [],
    loading: isLoading,
    error,
  };
}
