import { createTopicService, updateTopicService , getAllTopicsService } from "../services/topic.service.js";

export const createTopicController = async(req, res, next) => {
    const {title, description, order, courseId} = req.body;
    order = Number(order);
    courseId = Number(courseId);
try{
    const topic = await createTopicService(
        title,
        description,
        order,
        courseId
    )
    res.status(201).json(topic);
}
catch(error)
{
    next(error);
}
}



export const updateTopicController = async (req, res, next) => {
  try {
    const topicId = Number(req.params.topicId);
    const { title, description, order, courseId } = req.body;

    if (isNaN(topicId)) {
      return res.status(400).json({ message: "Invald topic id" });
    }

    const result = await updateTopicService(topicId, {
      title,
      description,
      order: order ? Number(order) : undefined,
      courseId: courseId ? Number(courseId) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllTopicsController = async (req, res, next) => {
  try {
    const result = await getAllTopicsService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};