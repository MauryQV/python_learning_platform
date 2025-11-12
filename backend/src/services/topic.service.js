import { createTopic, updateTopic, getAllTopics } from "../repositories/topic.repository.js";

export const createTopicService = async(title,description,order,courseId) => {

    const topic = await createTopic(title,description,order,courseId);
    return {
        message : "Topico",
        topic
    }

}

export const updateTopicService = async (topicId, topicData) => {
  const { title, description, order, courseId } = topicData;

  if (!title && !description && !order && !courseId) {
    throw new Error("Debe enviar al menos un campo para actualizar.");
  }

  const updatedTopic = await updateTopic(topicId, title, description, order, courseId);
  return {
    message: "Tópico actualizado correctamente.",
    topic: updatedTopic,
  };
};

export const getAllTopicsService = async () => {
  const topics = await getAllTopics();

  if (topics.length === 0) {
    return { message: "No hay tópicos registrados.", topics: [] };
  }

  // Transformamos un poco los datos para devolver algo limpio
  return {
    message: "Lista de tópicos",
    topics: topics.map((t) => ({
      id: t.topicId,
      title: t.title,
      description: t.description,
      order: t.order,
      course: t.course ? t.course.name : "Sin curso asignado",
    })),
  };
};