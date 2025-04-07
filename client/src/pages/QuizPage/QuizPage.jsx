import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flashcardService } from "../../services/flashcardService";
import openaiService from "../../services/openaiService";
import LoadingBuddy from "../../components/LoadingBuddy/LoadingBuddy";
import Confetti from "react-confetti";
import "./QuizPage.scss";

const QuizPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await flashcardService.getFlashcardsByDeck(deckId);
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        navigate("/dashboard/decks");
      }
    };

    fetchFlashcards();
  }, [deckId, navigate]);

  useEffect(() => {
    const generateQuestion = async () => {
      if (flashcards.length > 0 && currentIndex < flashcards.length) {
        setIsLoading(true);
        const currentFlashcard = flashcards[currentIndex];

        try {
          const distractors = await openaiService.generateDistractors(
            currentFlashcard.backContent,
            currentFlashcard.frontContent
          );

          const allOptions = [
            currentFlashcard.backContent,
            ...distractors,
          ].sort(() => Math.random() - 0.5);

          setCurrentQuestion({
            question: currentFlashcard.frontContent,
            options: allOptions,
            correctAnswer: currentFlashcard.backContent,
          });
        } catch (error) {
          console.error("Error generating question:", error);
        }
        setIsLoading(false);
      }
    };

    generateQuestion();
  }, [flashcards, currentIndex]);

  useEffect(() => {
    if (isComplete) {
      const passed = calculatePercentage() >= 70;
      if (passed) {
        setShowConfetti(true);
      }
    }
  }, [isComplete]);

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const calculatePercentage = () => {
    return Math.round((score / flashcards.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="quiz-page">
        <div className="quiz-content">
          <LoadingBuddy />
        </div>
      </div>
    );
  }

  if (isComplete) {
    const passed = calculatePercentage() >= 70;

    return (
      <div className="quiz-page">
        {passed && showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={true}
            numberOfPieces={300}
            gravity={0.2}
            wind={0.05}
            run={true}
          />
        )}
        <div className="quiz-content">
          <div className="quiz-completion">
            <div className="completion-header">
              <LoadingBuddy className="buddy-icon" message="Nice work!" />
              <h1>Quiz Complete!</h1>
            </div>
            <div className="completion-stats">
              <div className="score">
                {score} out of {flashcards.length}
              </div>
              <div className="percentage">{calculatePercentage()}%</div>
            </div>
            <button
              className="back-button"
              onClick={() => navigate(`/dashboard/decks/${deckId}`)}
            >
              Back to Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-content">
        <div className="quiz-progress">
          Question {currentIndex + 1} of {flashcards.length}
        </div>
        <div className="quiz-card">
          <div className="quiz-card__question">
            <h2>{currentQuestion?.question}</h2>
          </div>
          <div className="quiz-card__options">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                className="quiz-card__option"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
