import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.route.js";
import profileRoutes from "./src/routes/profile.route.js"; 
import adminRoutes from "./src/routes/admin.routes.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2999;
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(morgan("dev"));

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,               
}));

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
app.options(/.*/, cors());

// RUTAS EXISTENTES
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// RUTA ADMIN
app.use("/admin", adminRoutes);  // << esta línea permite PATCH /admin/users/:id/role

// Middleware de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

