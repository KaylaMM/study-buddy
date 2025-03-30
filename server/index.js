import express from "express";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protected.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", flashcardRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
