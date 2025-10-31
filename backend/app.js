import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./src/routes/admin.route.js";
import authRoutes from "./src/routes/auth.route.js";
import profileRoutes from "./src/routes/profile.route.js";
import roleRoutes from "./src/routes/role.route.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 2999;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

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

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => res.send("Backend running")); 
app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "SRIVEEEE" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/roles", roleRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Cohetecito 100% real no fake 🚀 http://localhost:${PORT}`);
});

export default app;
