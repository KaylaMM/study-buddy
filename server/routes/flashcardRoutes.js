import express from "express";
import pool from "../db/db.js";
import jwtAuth from "../middleware/jwtAuth.js";

const router = express.Router();

router.get("/decks/:deckId/flashcards", jwtAuth, async (req, res) => {
  try {
    const { deckId } = req.params;
    const [flashcards] = await pool.query(
      "SELECT * FROM flashcards WHERE deck_id = ?",
      [deckId]
    );
    res.json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    res.status(500).json({ message: "Error fetching flashcards" });
  }
});

router.get("/flashcards/:id", jwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const [flashcards] = await pool.query(
      "SELECT * FROM flashcards WHERE id = ?",
      [id]
    );

    if (flashcards.length === 0) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res.json(flashcards[0]);
  } catch (error) {
    console.error("Error fetching flashcard:", error);
    res.status(500).json({ message: "Error fetching flashcard" });
  }
});

router.post("/decks/:deckId/flashcards", jwtAuth, async (req, res) => {
  try {
    const { deckId } = req.params;
    const { front_content, back_content } = req.body;

    const [result] = await pool.query(
      "INSERT INTO flashcards (deck_id, front_content, back_content) VALUES (?, ?, ?)",
      [deckId, front_content, back_content]
    );

    const [newFlashcard] = await pool.query(
      "SELECT * FROM flashcards WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newFlashcard[0]);
  } catch (error) {
    console.error("Error creating flashcard:", error);
    res.status(500).json({ message: "Error creating flashcard" });
  }
});

router.put("/flashcards/:id", jwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { front_content, back_content } = req.body;

    const [result] = await pool.query(
      "UPDATE flashcards SET front_content = ?, back_content = ? WHERE id = ?",
      [front_content, back_content, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    const [updatedFlashcard] = await pool.query(
      "SELECT * FROM flashcards WHERE id = ?",
      [id]
    );

    res.json(updatedFlashcard[0]);
  } catch (error) {
    console.error("Error updating flashcard:", error);
    res.status(500).json({ message: "Error updating flashcard" });
  }
});

router.delete("/flashcards/:id", jwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM flashcards WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res.json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    res.status(500).json({ message: "Error deleting flashcard" });
  }
});

export default router;
