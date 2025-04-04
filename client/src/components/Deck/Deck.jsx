import React from "react";
import { useNavigate } from "react-router-dom";
import "./Deck.scss";

const Deck = ({
  deck = {},
  onEditDeck,
  onDeleteDeck,
  layout = "grid",
  showActions = true,
  onDeckClick,
}) => {
  const navigate = useNavigate();

  if (!deck) {
    return null;
  }

  const handleDeckClick = () => {
    if (onDeckClick) {
      onDeckClick(deck.id);
    } else {
      navigate(`/dashboard/decks/${deck.id}`);
    }
  };

  return (
    <div className={`deck deck--${layout}`} onClick={handleDeckClick}>
      <div className="deck__title">{deck.title || "Untitled Deck"}</div>

      {showActions && deck.id && (
        <div className="deck__actions">
          <i
            className="fas fa-pencil-alt deck__icon deck__icon--edit"
            onClick={(e) => {
              e.stopPropagation();
              onEditDeck(deck);
            }}
          />
          <i
            className="fas fa-trash-alt deck__icon deck__icon--delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteDeck(deck.id);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Deck;
