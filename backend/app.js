import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/routes/auth.route.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(morgan("dev"));
// CORS
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
