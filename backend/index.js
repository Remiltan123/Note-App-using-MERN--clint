import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authService.js";
import notesRoutes from "./routes/notesService.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/notes", notesRoutes);

console.log("Connecting to MongoDB...");
connectDB();

app.listen(PORT, () => {
  console.log(`Server succesfully running at port ${PORT}`);
});
