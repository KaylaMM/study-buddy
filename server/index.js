import express from "express";
import authRoutes from "./routes/authRoutes.js";
import deckRoutes from "./routes/deckRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;
const HEROKU_URL = process.env.HEROKU_URL;

app.use(
  cors({
    origin: HEROKU_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
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
