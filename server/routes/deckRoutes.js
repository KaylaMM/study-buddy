import express from "express";
import pool from "../db/db.js";
import jwtAuth from "../middleware/jwtAuth.js";

const router = express.Router();

router.get("/", jwtAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [decks] = await pool.query(
      "SELECT * FROM decks WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(decks);
  } catch (error) {
    console.error("Error fetching decks:", error);
    res.status(500).json({ message: "Error fetching decks" });
  }
});

router.get("/:id", jwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const [decks] = await pool.query(
      "SELECT * FROM decks WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (decks.length === 0) {
      return res.status(404).json({ message: "Deck not found" });
    }

    res.json(decks[0]);
  } catch (error) {
    console.error("Error fetching deck:", error);
    res.status(500).json({ message: "Error fetching deck" });
  }
});

router.post("/", jwtAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    const [result] = await pool.query(
      "INSERT INTO decks (user_id, title, description) VALUES (?, ?, ?)",
      [userId, title, description]
    );

    const [newDeck] = await pool.query("SELECT * FROM decks WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(newDeck[0]);
  } catch (error) {
    console.error("Error creating deck:", error);
    res.status(500).json({ message: "Error creating deck" });
  }
});

// Update a deck
router.put("/:id", jwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.userId;

    // First check if the deck exists and belongs to the user
    const [existingDeck] = await pool.query(
      "SELECT * FROM decks WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (existingDeck.length === 0) {
      return res.status(404).json({ message: "Deck not found" });
    }

    // Update the deck
    await pool.query(
      "UPDATE decks SET title = ?, description = ? WHERE id = ? AND user_id = ?",
      [title, description, id, userId]
    );

    // Get the updated deck
    const [updatedDeck] = await pool.query("SELECT * FROM decks WHERE id = ?", [
      id,
    ]);

    res.json(updatedDeck[0]);
  } catch (error) {
    console.error("Error updating deck:", error);
    res.status(500).json({ message: "Error updating deck" });
  }
});

// Delete a deck
router.delete("/:id", jwtAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // First check if the deck exists and belongs to the user
    const [existingDeck] = await pool.query(
      "SELECT * FROM decks WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (existingDeck.length === 0) {
      return res.status(404).json({ message: "Deck not found" });
    }

    // Delete the deck
    await pool.query("DELETE FROM decks WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);

    res.json({ message: "Deck deleted successfully" });
  } catch (error) {
    console.error("Error deleting deck:", error);
    res.status(500).json({ message: "Error deleting deck" });
  }
});

export default router;
