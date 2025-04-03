import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deckService } from "../../services/deckService";
import CreateDeckForm from "../../components/CreateDeckForm/CreateDeckForm";
import Decks from "../../components/Decks/Decks";
import "./DecksPage.scss";

const DecksPage = () => {
  const [decks, setDecks] = useState([]);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const data = await deckService.getDecks();
        setDecks(data);
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchDecks();
  }, []);

  const handleCreateDeck = async (deckData) => {
    try {
      const newDeck = await deckService.createDeck(deckData);
      setDecks((prevDecks) => [...prevDecks, newDeck]);
      setIsCreatingDeck(false);
      navigate(`/dashboard/decks/${newDeck.id}`);
    } catch (error) {
      console.error("Error creating deck:", error);
      throw new Error(error.response?.data?.message || "Failed to create deck");
    }
  };

  const handleDeckUpdate = async (deckData) => {
    try {
      const updatedDeck = await deckService.updateDeck(
        editingDeck.id,
        deckData
      );
      setDecks((prevDecks) =>
        prevDecks.map((deck) =>
          deck.id === updatedDeck.id ? updatedDeck : deck
        )
      );
      setEditingDeck(null);
    } catch (error) {
      console.error("Error updating deck:", error);
      throw new Error(error.response?.data?.message || "Failed to update deck");
    }
  };

  const handleDeckDelete = async (deckId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this deck? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deckService.deleteDeck(deckId);
      setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
    } catch (error) {
      console.error("Error deleting deck:", error);
      throw new Error(error.response?.data?.message || "Failed to delete deck");
    }
  };

  return (
    <div className="decks-page">
      <div className="decks-page__header">
        <h2>Your Decks</h2>
        <button
          type="button"
          className="decks-page__create-deck-btn"
          onClick={() => setIsCreatingDeck(true)}
        >
          Create New Deck
        </button>
      </div>

      <Decks
        decks={decks}
        onEditDeck={setEditingDeck}
        onDeleteDeck={handleDeckDelete}
        layout="grid"
      />

      {isCreatingDeck && (
        <CreateDeckForm
          onSubmit={handleCreateDeck}
          onCancel={() => setIsCreatingDeck(false)}
        />
      )}

      {editingDeck && (
        <CreateDeckForm
          initialData={{ title: editingDeck.title }}
          onSubmit={handleDeckUpdate}
          onCancel={() => setEditingDeck(null)}
        />
      )}
    </div>
  );
};

export default DecksPage;
