import express from "express"
import { permissionController } from "../controllers/permission.controller.js";

const router = express.Router();

router.get("/get-permissions",permissionController);

export default router;
