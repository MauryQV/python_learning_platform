import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import authRoutes from "./src/routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("HOLA MUNDO DESDE MI SERVIDOR HUMILDE EN EXPRESSSSSSSSSSSSSSSSSS");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

