import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar/Navbar";
import Deck from "../../components/Deck/Deck";
import { deckService } from "../../services/deckService";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [latestDecks, setLatestDecks] = useState([]);
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

  useEffect(() => {
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

    fetchLatestDecks();
  }, []);

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
    </div>
  );
};

export default DashboardPage;
