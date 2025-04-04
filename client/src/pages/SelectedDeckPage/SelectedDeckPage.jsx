import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flashcardService } from "../../services/flashcardService";
import { deckService } from "../../services/deckService";
import Flashcard from "../../components/Flashcard/Flashcard";
import FlashcardForm from "../../components/FlashcardForm/FlashcardForm";
import "./SelectedDeckPage.scss";

const SelectedDeckPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchDeckAndFlashcards = async () => {
      try {
        const [deckData, flashcardsData] = await Promise.all([
          deckService.getDeck(deckId),
          flashcardService.getFlashcardsByDeck(deckId),
        ]);
        setDeck(deckData);
        setFlashcards(flashcardsData);
      } catch (error) {
        console.error("Error fetching deck and flashcards:", error);
        navigate("/dashboard/decks");
      }
    };

    fetchDeckAndFlashcards();
  }, [deckId, navigate]);

  const handleFlashcardUpdate = async () => {
    try {
      const updatedFlashcards = await flashcardService.getFlashcardsByDeck(
        deckId
      );
      setFlashcards(updatedFlashcards);
    } catch (error) {
      console.error("Error updating flashcards:", error);
    }
  };

  const handleFlashcardDelete = (deletedId) => {
    setFlashcards(flashcards.filter((flashcard) => flashcard.id !== deletedId));
  };

  const handleCreateFlashcard = async (newFlashcard) => {
    setIsCreating(false);
    setFlashcards((prevFlashcards) => [...prevFlashcards, newFlashcard]);
  };

  if (!deck) {
    return <div>Loading...</div>;
  }

  return (
    <div className="selected-deck-page">
      <div className="selected-deck-page__header">
        <div className="selected-deck-page__navigation">
          <button
            className="selected-deck-page__back-btn"
            onClick={() => navigate("/dashboard/decks")}
          >
            Back to Decks
          </button>
          <div className="selected-deck-page__breadcrumbs">
            <span onClick={() => navigate("/dashboard")}>Dashboard</span>
            <span>/</span>
            <span onClick={() => navigate("/dashboard/decks")}>Decks</span>
            <span>/</span>
            <span className="selected-deck-page__current-deck">
              {deck.title}
            </span>
          </div>
        </div>
        <div className="selected-deck-page__title-section">
          <h1 className="selected-deck-page__title">{deck.title}</h1>
        </div>
      </div>

      <div className="selected-deck-page__content">
        {isCreating && (
          <div className="selected-deck-page__form-container">
            <FlashcardForm
              deckId={deckId}
              onUpdate={handleCreateFlashcard}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}
        <div className="selected-deck-page__flashcards">
          <div
            className="selected-deck-page__create-card"
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          />
          {flashcards.length > 0 ? (
            flashcards.map((flashcard) => (
              <Flashcard
                key={flashcard.id}
                id={flashcard.id}
                deckId={deckId}
                frontContent={flashcard.frontContent}
                backContent={flashcard.backContent}
                onUpdate={handleFlashcardUpdate}
                onDelete={handleFlashcardDelete}
                showControls={true}
              />
            ))
          ) : (
            <p className="selected-deck-page__empty-message">
              No flashcards in this deck yet. Add some to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedDeckPage;
