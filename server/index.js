import express from "express";
import authRoutes from "./routes/authRoutes.js";
import deckRoutes from "./routes/deckRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: [
      "https://study-buddy-m1deu41n7-kaylamms-projects.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/decks", deckRoutes);
app.use("/api/flashcards", flashcardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
