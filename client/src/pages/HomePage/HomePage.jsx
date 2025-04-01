import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";
import SignupForm from "../../components/SignupForm/SignupForm";
import authService from "../../services/authService";
import logo from "../../assets/images/study-buddy-cropped-transparent.png";
import "./HomePage.scss";

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      setError("");
      await authService.login(formData.email, formData.password);
      setShowLoginModal(false);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message || "Error logging in");
      console.error("Login error:", error);
    }
  };

  const handleSignup = async (formData) => {
    try {
      setError("");
      await authService.signup(
        formData.username,
        formData.email,
        formData.password
      );
      setShowSignupModal(false);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message || "Error signing up");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="home-page">
      <div className="home-page__content">
        <div className="home-page__logo">
          <h1 className="home-page__logo-text">welcome to</h1>
          <img
            className="home-page__logo-image"
            src={logo}
            alt="Study Buddy Logo"
          />
        </div>
        <div className="home-page__buttons">
          <button
            className="home-page__button home-page__button--login"
            onClick={() => setShowLoginModal(true)}
          >
            Login
          </button>
          <button
            className="home-page__button home-page__button--signup"
            onClick={() => setShowSignupModal(true)}
          >
            Sign Up
          </button>
        </div>
      </div>

      {showLoginModal && (
        <div className="modal">
          <div
            className="modal__overlay"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="modal__content">
            {error && <div className="modal__error">{error}</div>}
            <LoginForm
              onSubmit={handleLogin}
              onClose={() => setShowLoginModal(false)}
            />
          </div>
        </div>
      )}

      {showSignupModal && (
        <div className="modal">
          <div
            className="modal__overlay"
            onClick={() => setShowSignupModal(false)}
          />
          <div className="modal__content">
            {error && <div className="modal__error">{error}</div>}
            <SignupForm
              onSubmit={handleSignup}
              onClose={() => setShowSignupModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
