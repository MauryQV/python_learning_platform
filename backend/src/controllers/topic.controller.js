import {
  createTopicService,
  updateTopicService,
  getAllTopicsService,
} from "../services/topic.service.js";

export const createTopicController = async (req, res, next) => {
  try {
    const { title, description, order, courseId } = req.body;

    const numericOrder = Number(order);
    const numericCourseId = Number(courseId);

    const topic = await createTopicService(
      title,
      description,
      numericOrder,
      numericCourseId
    );

    res.status(201).json(topic);
  } catch (error) {
    next(error);
  }
};

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
