import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flashcard from "../components/Flashcard/Flashcard";
import CreateDeckForm from "../components/CreateDeckForm/CreateDeckForm";
import { flashcardService } from "../services/flashcardService";
import { deckService } from "../services/deckService";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const navigate = useNavigate();

  // Sample flashcard data for demonstration
  const sampleFlashcard = {
    id: "sample",
    front: "Sample Question",
    back: "Sample Answer",
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
        // Select the first deck by default if available
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
    navigate("/login");
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
      // Create the new deck
      const newDeck = await deckService.createDeck(deckData);

      // Update the decks state with the new deck
      setDecks((prevDecks) => [...prevDecks, newDeck]);

      // Select the newly created deck
      setSelectedDeck(newDeck);

      // Close the create deck form
      setIsCreatingDeck(false);

      // Fetch flashcards for the new deck
      const flashcards = await flashcardService.getFlashcardsByDeck(newDeck.id);
      setFlashcards(flashcards);
    } catch (error) {
      console.error("Error creating deck:", error);
      throw new Error(error.response?.data?.message || "Failed to create deck");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main className="dashboard-content">
        <p>Your email: {user.email}</p>

        <div className="decks-section">
          <div className="decks-header">
            <h2>Your Decks</h2>
            <button
              className="create-deck-button"
              onClick={() => setIsCreatingDeck(true)}
            >
              Create New Deck
            </button>
          </div>

          {isCreatingDeck ? (
            <CreateDeckForm
              onSubmit={handleCreateDeck}
              onCancel={() => setIsCreatingDeck(false)}
            />
          ) : (
            <div className="decks-list">
              {decks.map((deck) => (
                <button
                  key={deck.id}
                  className={`deck-button ${
                    selectedDeck?.id === deck.id ? "selected" : ""
                  }`}
                  onClick={() => handleDeckSelect(deck)}
                >
                  {deck.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flashcards-section">
          <h2>
            {selectedDeck
              ? `Flashcards in ${selectedDeck.title}`
              : "Create a deck to get started!"}
          </h2>
          <div className="flashcards-container">
            {selectedDeck &&
              (flashcards.length > 0 ? (
                flashcards.map((flashcard) => (
                  <Flashcard
                    key={flashcard.id}
                    id={flashcard.id}
                    deckId={selectedDeck.id}
                    onUpdate={handleFlashcardUpdate}
                    onDelete={() => handleFlashcardDelete(flashcard.id)}
                  />
                ))
              ) : (
                <div className="sample-flashcard-container">
                  <p className="sample-flashcard-text">
                    No flashcards yet. Here's an example:
                  </p>
                  <Flashcard
                    key={sampleFlashcard.id}
                    id={sampleFlashcard.id}
                    deckId={selectedDeck.id}
                    front={sampleFlashcard.front}
                    back={sampleFlashcard.back}
                    isSample={true}
                    onUpdate={handleFlashcardUpdate}
                    onDelete={() => {}}
                  />
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
