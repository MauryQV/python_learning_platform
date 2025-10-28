import express from "express"
import * as roleControllers from "../controllers/role.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/get-roles",roleControllers.getRolesController);

export default router;
