import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deckService } from "../../services/deckService";
import CreateDeckForm from "../../components/CreateDeckForm/CreateDeckForm";
import Deck from "../../components/Deck/Deck";
import "./DecksPage.scss";

const DecksPage = () => {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setIsLoading(true);
        const data = await deckService.getDecks();
        setDecks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching decks:", error);
        setDecks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const handleCreateDeck = async (deckData) => {
    try {
      const newDeck = await deckService.createDeck(deckData);
      if (newDeck && newDeck.id) {
        setDecks((prevDecks) => [...prevDecks, newDeck]);
        setIsCreatingDeck(false);
        navigate(`/dashboard/decks/${newDeck.id}`);
      }
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
      if (updatedDeck && updatedDeck.id) {
        setDecks((prevDecks) =>
          prevDecks.map((deck) =>
            deck.id === updatedDeck.id ? updatedDeck : deck
          )
        );
        setEditingDeck(null);
      }
    } catch (error) {
      console.error("Error updating deck:", error);
      throw new Error(error.response?.data?.message || "Failed to update deck");
    }
  };

  const handleDeckDelete = async (deckId) => {
    if (
      !deckId ||
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

  if (isLoading) {
    return (
      <div className="decks-page">
        <div className="decks-page__loading">Loading decks...</div>
      </div>
    );
  }

  return (
    <div className="decks-page">
      <div className="decks-page__header">
        <div className="decks-page__navigation">
          <div className="decks-page__breadcrumbs">
            <span onClick={() => navigate("/dashboard")}>Dashboard</span>
            <span>/</span>
            <span className="decks-page__current-page">Decks</span>
          </div>
        </div>
        <div className="decks-page__title-section">
          <h1 className="decks-page__title">Your Decks</h1>
        </div>
      </div>

      <div className="decks-page__decks-grid">
        <div
          className="decks-page__create-card"
          onClick={() => setIsCreatingDeck(true)}
        />
        {decks.length > 0 ? (
          decks.map(
            (deck) =>
              deck && (
                <Deck
                  key={deck.id}
                  deck={deck}
                  onEditDeck={setEditingDeck}
                  onDeleteDeck={handleDeckDelete}
                  layout="grid"
                  showActions={true}
                />
              )
          )
        ) : (
          <p className="decks-page__no-decks">
            No decks yet. Create your first deck to get started!
          </p>
        )}
      </div>

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
