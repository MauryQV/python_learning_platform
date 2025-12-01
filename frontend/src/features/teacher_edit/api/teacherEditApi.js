// frontend/src/features/teacher_edit/api/teacherEditApi.js
import { api } from "@/api/axiosInstance";

// Traer cursos ASIGNADOS al profesor (usando la nueva ruta del backend)

export const getAssignedCourses = async (teacherId) => {
  try {
    const response = await api.get(`/course/by-teacher/${teacherId}`);
    return response.data; // debe retornar array de cursos
  } catch (error) {
    console.error("❌ Error fetching teacher courses:", error);
    throw error;
  }
};



// Obtener tópicos
export async function getTopics() {
  const res = await api.get(`/topic/topics`);
  return res.data;
}

// Crear un tópico
export async function createTopic(data) {
  const res = await api.post(`/topic/create-topic`, data);
  return res.data;
}

// Actualizar un tópico
export async function updateTopic(topicId, data) {
  const res = await api.put(`/topic/update-topic/${topicId}`, data);
  return res.data;
}
export async function getCourseDetails(courseId) {
  try {
    const res = await api.get(`/course/${courseId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching course details:", err);
    throw err;
  }
}


