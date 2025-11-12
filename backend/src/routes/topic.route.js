import express from "express"
import { createTopicController } from "../controllers/topic.controller.js"

const router = express.Router();

router.post("/crear-curso", createTopicController);

export default router;
