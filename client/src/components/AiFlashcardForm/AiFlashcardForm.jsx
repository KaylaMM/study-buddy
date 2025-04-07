import React, { useState } from "react";
import "./AiFlashcardForm.scss";

const AIFlashcardForm = ({ onSubmit, onClose }) => {
  const [subject, setSubject] = useState("");
  const [cardCount, setCardCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ subject, cardCount });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-flashcard-form">
      <div className="ai-flashcard-form__content">
        <button className="ai-flashcard-form__close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>
        <h2 className="ai-flashcard-form__title">Generate Flashcards</h2>
        <form onSubmit={handleSubmit}>
          <div className="ai-flashcard-form__field">
            <label htmlFor="subject">Subject/Topic:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter a subject or topic"
              required
            />
          </div>
          <div className="ai-flashcard-form__field">
            <label htmlFor="cardCount">Number of Flashcards (max 12):</label>
            <input
              type="number"
              id="cardCount"
              value={cardCount}
              onChange={(e) =>
                setCardCount(
                  Math.min(12, Math.max(1, parseInt(e.target.value)))
                )
              }
              min="1"
              max="12"
              required
            />
          </div>
          <button
            type="submit"
            className="ai-flashcard-form__submit"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIFlashcardForm;
