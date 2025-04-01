import { useState } from "react";
import PropTypes from "prop-types";
import { flashcardService } from "../../services/flashcardService";
import FlashcardForm from "../FlashcardForm/FlashcardForm";
import "./Flashcard.scss";

const Flashcard = ({
  deckId,
  onUpdate,
  onDelete,
  id,
  frontContent,
  backContent,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      setIsLoading(true);
      try {
        await flashcardService.deleteFlashcard(id);
        onDelete();
      } catch (error) {
        console.error("Error deleting flashcard:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isEditing) {
    return (
      <FlashcardForm
        deckId={deckId}
        onUpdate={() => {
          onUpdate();
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        id={id}
        initialData={{ frontContent, backContent }}
      />
    );
  }

  return (
    <div className="flashcard">
      <div
        className={`flashcard__content ${
          isFlipped ? "flashcard__content--flipped" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flashcard__front">
          <p>{frontContent}</p>
        </div>
        <div className="flashcard__back">
          <p>{backContent}</p>
        </div>
      </div>
      <div className="flashcard__actions">
        <i
          className="fas fa-pencil-alt flashcard__icon flashcard__icon--edit"
          onClick={() => setIsEditing(true)}
        />
        <i
          className="fas fa-trash-alt flashcard__icon flashcard__icon--delete"
          onClick={handleDelete}
          style={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        />
      </div>
    </div>
  );
};

Flashcard.propTypes = {
  deckId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  id: PropTypes.string,
  frontContent: PropTypes.string.isRequired,
  backContent: PropTypes.string.isRequired,
};

export default Flashcard;
