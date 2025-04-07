import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import DecksPage from "./pages/DecksPage/DecksPage";
import SelectedDeckPage from "./pages/SelectedDeckPage/SelectedDeckPage";
import QuizPage from "./pages/QuizPage/QuizPage";
import ProgressPage from "./pages/ProgressPage/ProgressPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route path="decks" element={<DecksPage />} />
          <Route path="decks/:deckId" element={<SelectedDeckPage />} />
          <Route path="quiz/:deckId" element={<QuizPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
