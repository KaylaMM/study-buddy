import express from "express";
import pool from "../db/db.js";
import jwtAuth from "../middleware/jwtAuth.js";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
  defaultHeaders: {
    "OpenAI-Organization": process.env.OPENAI_ORG_ID,
  },
  defaultQuery: { "api-version": "2023-05-15" },
});

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

router.get("/:id", jwtAuth, async (req, res) => {
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

router.put("/:id", jwtAuth, async (req, res) => {
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

router.delete("/:id", jwtAuth, async (req, res) => {
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

router.post("/generate", jwtAuth, async (req, res) => {
  try {
    const { subject, count } = req.body;
    const userId = req.user.userId;
    console.log("Received request with subject:", subject, "count:", count);

    if (!subject || !count || count < 1 || count > 12) {
      console.log("Invalid parameters:", { subject, count });
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    console.log(
      "OpenAI API Key:",
      process.env.OPENAI_API_KEY ? "Present" : "Missing"
    );

    const prompt = `Generate ${count} flashcards about ${subject}. Format your response as a JSON object with a 'flashcards' array. Each flashcard in the array should have 'front' and 'back' properties. Example format: {"flashcards":[{"front":"What is X?","back":"X is Y"}]}`;

    console.log("Sending request to OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a flashcard generator. You must return a JSON object with a 'flashcards' array containing flashcard objects. Each flashcard must have 'front' and 'back' properties.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    console.log("Received response from OpenAI");
    const response = completion.choices[0].message.content;
    console.log("OpenAI response:", response);

    let flashcards;
    try {
      const parsedResponse = JSON.parse(response);
      if (
        !parsedResponse.flashcards ||
        !Array.isArray(parsedResponse.flashcards)
      ) {
        console.error("Invalid response format:", parsedResponse);
        throw new Error("Response is not in the expected format");
      }
      flashcards = parsedResponse.flashcards;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    const [deckResult] = await pool.query(
      "INSERT INTO decks (user_id, title, description) VALUES (?, ?, ?)",
      [
        userId,
        `AI Generated: ${subject}`,
        `Automatically generated flashcards about ${subject}`,
      ]
    );
    const deckId = deckResult.insertId;

    const insertPromises = flashcards.map((flashcard) =>
      pool.query(
        "INSERT INTO flashcards (deck_id, front_content, back_content) VALUES (?, ?, ?)",
        [deckId, flashcard.front, flashcard.back]
      )
    );

    await Promise.all(insertPromises);

    const [newDeck] = await pool.query("SELECT * FROM decks WHERE id = ?", [
      deckId,
    ]);

    const [newFlashcards] = await pool.query(
      "SELECT * FROM flashcards WHERE deck_id = ?",
      [deckId]
    );

    res.status(201).json({
      deck: newDeck[0],
      flashcards: newFlashcards,
    });
  } catch (error) {
    console.error("Detailed error in flashcard generation:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    });
    res
      .status(500)
      .json({ message: "Error generating flashcards", error: error.message });
  }
});

export default router;
