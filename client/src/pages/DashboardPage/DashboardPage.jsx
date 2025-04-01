import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flashcard from "../../components/Flashcard/Flashcard";
import CreateDeckForm from "../../components/CreateDeckForm/CreateDeckForm";
import FlashcardForm from "../../components/FlashcardForm/FlashcardForm";
import { flashcardService } from "../../services/flashcardService";
import { deckService } from "../../services/deckService";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [isCreatingFlashcard, setIsCreatingFlashcard] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const navigate = useNavigate();

  const sampleFlashcard = {
    id: 0,
    frontContent: "Sample Question",
    backContent: "Sample Answer",
    deckId: null,
    isSample: true,
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const data = await deckService.getDecks();
        setDecks(data);
        if (data.length > 0) {
          setSelectedDeck(data[0]);
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchDecks();
  }, []);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!selectedDeck) return;

      try {
        const data = await flashcardService.getFlashcardsByDeck(
          selectedDeck.id
        );
        setFlashcards(data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchFlashcards();
  }, [selectedDeck]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleFlashcardUpdate = async () => {
    if (!selectedDeck) return;

    try {
      const updatedFlashcards = await flashcardService.getFlashcardsByDeck(
        selectedDeck.id
      );
      setFlashcards(updatedFlashcards);
    } catch (error) {
      console.error("Error updating flashcards:", error);
    }
  };

  const handleFlashcardDelete = (deletedId) => {
    setFlashcards(flashcards.filter((flashcard) => flashcard.id !== deletedId));
  };

  const handleDeckSelect = (deck) => {
    setSelectedDeck(deck);
  };

  const handleCreateDeck = async (deckData) => {
    try {
      const newDeck = await deckService.createDeck(deckData);
      setDecks((prevDecks) => [...prevDecks, newDeck]);
      setSelectedDeck(newDeck);
      setIsCreatingDeck(false);
      setFlashcards([]);
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
      if (selectedDeck?.id === updatedDeck.id) {
        setSelectedDeck(updatedDeck);
      }
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
      if (selectedDeck?.id === deckId) {
        setSelectedDeck(null);
        setFlashcards([]);
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
      throw new Error(error.response?.data?.message || "Failed to delete deck");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Welcome, {user.username}!</h1>
        <button onClick={handleLogout} className="dashboard__logout-btn">
          Logout
        </button>
      </header>
      <main className="dashboard__content">
        <p>Your email: {user.email}</p>

        <div className="dashboard__decks">
          <div className="dashboard__decks-header">
            <h2>Your Decks</h2>
            <button
              type="button"
              className="dashboard__create-deck-btn"
              onClick={() => {
                setIsCreatingDeck(true);
              }}
            >
              Create New Deck
            </button>
          </div>

          <div className="dashboard__decks-list">
            {decks.map((deck) => (
              <div key={deck.id} className="dashboard__deck-item">
                {editingDeck?.id === deck.id ? (
                  <CreateDeckForm
                    initialData={{ title: deck.title }}
                    onSubmit={handleDeckUpdate}
                    onCancel={() => setEditingDeck(null)}
                  />
                ) : (
                  <>
                    <button
                      className={`dashboard__deck-btn ${
                        selectedDeck?.id === deck.id
                          ? "dashboard__deck-btn--selected"
                          : ""
                      }`}
                      onClick={() => handleDeckSelect(deck)}
                    >
                      {deck.title}
                    </button>
                    <div className="dashboard__deck-actions">
                      <button
                        className="dashboard__deck-btn dashboard__deck-btn--edit"
                        onClick={() => setEditingDeck(deck)}
                      >
                        Edit
                      </button>
                      <button
                        className="dashboard__deck-btn dashboard__deck-btn--delete"
                        onClick={() => handleDeckDelete(deck.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {isCreatingDeck && (
            <CreateDeckForm
              onSubmit={handleCreateDeck}
              onCancel={() => setIsCreatingDeck(false)}
            />
          )}
        </div>

        <div className="dashboard__flashcards">
          <div className="dashboard__flashcards-header">
            <h2>
              {selectedDeck
                ? `Flashcards in ${selectedDeck.title}`
                : "Create a deck to get started!"}
            </h2>
            {selectedDeck && (
              <button
                type="button"
                className="dashboard__create-flashcard-btn"
                onClick={() => setIsCreatingFlashcard(true)}
              >
                Create New Flashcard
              </button>
            )}
          </div>
          <div className="dashboard__flashcards-container">
            {selectedDeck &&
              (flashcards.length > 0 ? (
                flashcards.map((flashcard) => (
                  <Flashcard
                    key={flashcard.id}
                    id={flashcard.id}
                    deckId={selectedDeck.id}
                    frontContent={flashcard.frontContent}
                    backContent={flashcard.backContent}
                    onUpdate={handleFlashcardUpdate}
                    onDelete={() => handleFlashcardDelete(flashcard.id)}
                  />
                ))
              ) : (
                <div className="dashboard__sample-flashcard">
                  <p className="dashboard__sample-flashcard-text">
                    No flashcards yet. Here's an example:
                  </p>
                  <Flashcard
                    key="sample"
                    id={0}
                    deckId={selectedDeck.id}
                    frontContent={sampleFlashcard.frontContent}
                    backContent={sampleFlashcard.backContent}
                    isSample={true}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              ))}
          </div>

          {selectedDeck && isCreatingFlashcard && (
            <FlashcardForm
              deckId={selectedDeck.id}
              onUpdate={() => {
                handleFlashcardUpdate();
                setIsCreatingFlashcard(false);
              }}
              onCancel={() => setIsCreatingFlashcard(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
