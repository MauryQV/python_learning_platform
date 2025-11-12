import { createTopic } from "../repositories/topic.repository.js";

export const createTopicService = async(title,description,order,courseId) => {

    const topic = await createTopic(title,description,order,courseId);
    return {
        message : "Topico",
        topic
    }

}