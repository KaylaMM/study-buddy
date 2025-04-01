import { useState } from "react";
import PropTypes from "prop-types";
import "./SignupForm.scss";

const SignupForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred during registration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <button
        className="signup-form__close"
        onClick={onClose}
        aria-label="Close signup form"
      >
        ×
      </button>
      <h2 className="signup-form__title">Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form__container">
        <div className="signup-form__group">
          <label htmlFor="username" className="signup-form__label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`signup-form__input ${
              errors.username ? "signup-form__input--error" : ""
            }`}
            placeholder="Choose a username"
          />
          {errors.username && (
            <span className="signup-form__error">{errors.username}</span>
          )}
        </div>

        <div className="signup-form__group">
          <label htmlFor="email" className="signup-form__label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`signup-form__input ${
              errors.email ? "signup-form__input--error" : ""
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="signup-form__error">{errors.email}</span>
          )}
        </div>

        <div className="signup-form__group">
          <label htmlFor="password" className="signup-form__label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`signup-form__input ${
              errors.password ? "signup-form__input--error" : ""
            }`}
            placeholder="Create a password"
          />
          {errors.password && (
            <span className="signup-form__error">{errors.password}</span>
          )}
        </div>

        <div className="signup-form__group">
          <label htmlFor="confirmPassword" className="signup-form__label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`signup-form__input ${
              errors.confirmPassword ? "signup-form__input--error" : ""
            }`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span className="signup-form__error">{errors.confirmPassword}</span>
          )}
        </div>

        {errors.submit && (
          <div className="signup-form__error signup-form__error--submit">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          className="signup-form__button"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

SignupForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SignupForm;
