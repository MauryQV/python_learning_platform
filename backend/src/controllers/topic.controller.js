import { createTopicService } from "../services/topic.service.js";

export const createTopicController = async(req, res, next) => {
    const {title, description, order, courseId} = req.body;
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