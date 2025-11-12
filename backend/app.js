import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { queryMonitor } from "./src/middleware/query-monitor.middleware.js";
import adminRoutes from "./src/routes/admin.route.js";
import authRoutes from "./src/routes/auth.route.js";
import profileRoutes from "./src/routes/profile.route.js";
import roleRoutes from "./src/routes/role.route.js";
import teacherPermissionRoutes from "./src/routes/teacherPermission.route.js";
import courseRoutes from "./src/routes/course.route.js";
import teacherRoutes from "./src/routes/teacher.route.js";
import studentRoutes from "./src/routes/student.routes.js";
import topicRoutes from "./src/routes/topic.route.js"
import { errorHandler } from "./src/middleware/error.middleware.js";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 2999;

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(queryMonitor);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/roles", roleRoutes);

app.use("/api/teacher", teacherPermissionRoutes);

app.use("/api/course", courseRoutes);

app.use("/api/teacher", teacherRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/topic", topicRoutes)


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` emoji de cohetecito running on http://localhost:${PORT}`);
});

export default app;
