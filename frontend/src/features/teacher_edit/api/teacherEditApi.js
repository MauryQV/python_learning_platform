import { api } from "@/api/axiosInstance";


export async function getAssignedCourses() {
  const res = await api.get("/teacher_edit/courses");
  return res.data;
}

// eslint-disable-next-line no-unused-vars
export const getCourseDetails = async (id) => { 
  return undefined;
};


export async function getTopics() {
  const res = await api.get(`/topic/topics`);
  return res.data;
}


export async function createTopic(data) {
  const res = await api.post(`/topic/create-topic`, data);
  return res.data;
}

export async function updateTopic(topicId, data) {
  const res = await api.put(`/topic/update-topic/${topicId}`, data);
  return res.data;
}
