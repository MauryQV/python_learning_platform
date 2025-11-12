import express from "express"
import { createTopicController, updateTopicController, getAllTopicsController } from "../controllers/topic.controller.js"

const router = express.Router();

router.post("/create-topic", createTopicController);

router.patch("/update-topic/:topicId", updateTopicController);

router.get("/topics", getAllTopicsController);



export default router;
