import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar/Navbar";
import Deck from "../../components/Deck/Deck";
import AiFlashcardForm from "../../components/AiFlashcardForm/AiFlashcardForm";
import { deckService } from "../../services/deckService";
import { openaiService } from "../../services/openaiService";
import buddyIcon from "../../assets/images/buddy-icon-transparent.png";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [latestDecks, setLatestDecks] = useState([]);
  const [showAIForm, setShowAIForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const fetchLatestDecks = async () => {
    try {
      const decks = await deckService.getDecks();
      const sortedDecks = decks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLatestDecks(sortedDecks.slice(0, 4));
    } catch (error) {
      console.error("Error fetching latest decks:", error);
    }
  };

  useEffect(() => {
    fetchLatestDecks();
  }, []);

  const handleAIFormSubmit = async ({ subject, cardCount }) => {
    try {
      const response = await openaiService.generateFlashcards(
        subject,
        cardCount
      );

      await fetchLatestDecks(); // Fetch latest decks after creating a new one
      setShowAIForm(false);
      navigate(`/dashboard/decks/${response.deck.id}`);
    } catch (error) {
      console.error("Error generating AI flashcards:", error);
      alert("Failed to generate flashcards. Please try again.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const isHomeRoute = location.pathname === "/dashboard";

  return (
    <div className="dashboard">
      <NavBar />
      <main className="dashboard__content">
        {isHomeRoute ? (
          <div className="dashboard__welcome">
            <h1 className="dashboard__welcome-title">
              Welcome back, {user.username}!
              <button
                className="dashboard__ai-buddy"
                onClick={() => setShowAIForm(true)}
              >
                <img src={buddyIcon} alt="AI Study Buddy" />
              </button>
            </h1>

            <section className="dashboard__latest-decks">
              <h2 className="dashboard__section-title">Latest Decks</h2>
              <div className="dashboard__decks-grid">
                {latestDecks.map((deck) => (
                  <Deck
                    key={deck.id}
                    deck={deck}
                    layout="grid"
                    showActions={false}
                  />
                ))}
              </div>
            </section>

            <div className="dashboard__actions">
              <button
                className="dashboard__action-btn"
                onClick={() => navigate("/dashboard/decks")}
              >
                View All Decks
              </button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {showAIForm && (
        <AiFlashcardForm
          onSubmit={handleAIFormSubmit}
          onClose={() => setShowAIForm(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
