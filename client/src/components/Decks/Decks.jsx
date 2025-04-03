import React from "react";
import { useNavigate } from "react-router-dom";
import "./Decks.scss";

const Decks = ({
  decks,
  onEditDeck,
  onDeleteDeck,
  layout = "grid",
  showActions = true,
  onDeckClick,
}) => {
  const navigate = useNavigate();

  const handleDeckClick = (deckId) => {
    if (onDeckClick) {
      onDeckClick(deckId);
    } else {
      navigate(`/dashboard/decks/${deckId}`);
    }
  };

  const renderDeck = (deck) => (
    <div
      key={deck.id}
      className={`decks__deck-item decks__deck-item--${layout}`}
      onClick={() => handleDeckClick(deck.id)}
    >
      <div className="decks__deck-title">{deck.title}</div>

      {showActions && (
        <div className="decks__deck-actions">
          <i
            className="fas fa-pencil-alt decks__deck-icon decks__deck-icon--edit"
            onClick={(e) => {
              e.stopPropagation();
              onEditDeck(deck);
            }}
          />
          <i
            className="fas fa-trash-alt decks__deck-icon decks__deck-icon--delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteDeck(deck.id);
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className={`decks decks--${layout}`}>
      {decks.length > 0 ? (
        decks.map(renderDeck)
      ) : (
        <p className="decks__no-decks">
          No decks yet. Create your first deck to get started!
        </p>
      )}
    </div>
  );
};

export default Decks;
