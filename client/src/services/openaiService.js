const API_URL = "http://localhost:8080/api";

export const openaiService = {
  generateFlashcards: async (subject, count) => {
    try {
      const response = await fetch(`${API_URL}/flashcards/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subject,
          count: Math.min(12, Math.max(1, count)),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      return {
        deck: data.deck,
        flashcards: data.flashcards,
      };
    } catch (error) {
      console.error("Error generating flashcards:", error);
      throw error;
    }
  },

  generateDistractors: async (correctAnswer, context) => {
    try {
      const response = await fetch(
        `${API_URL}/flashcards/generate-distractors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            correctAnswer,
            context,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate distractors");
      }

      const data = await response.json();
      return data.distractors;
    } catch (error) {
      console.error("Error generating distractors:", error);
      return ["Incorrect Option 1", "Incorrect Option 2"];
    }
  },
};

export default openaiService;
