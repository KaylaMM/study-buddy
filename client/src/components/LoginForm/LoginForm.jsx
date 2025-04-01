import { useState } from "react";
import PropTypes from "prop-types";
import "./LoginForm.scss";

const LoginForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

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
        submit: error.message || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form">
      <button
        type="button"
        className="login-form__close"
        onClick={onClose}
        aria-label="Close login form"
      >
        ×
      </button>
      <h2 className="login-form__title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form__container">
        <div className="login-form__group">
          <label htmlFor="email" className="login-form__label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`login-form__input ${
              errors.email ? "login-form__input--error" : ""
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="login-form__error">{errors.email}</span>
          )}
        </div>

        <div className="login-form__group">
          <label htmlFor="password" className="login-form__label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`login-form__input ${
              errors.password ? "login-form__input--error" : ""
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="login-form__error">{errors.password}</span>
          )}
        </div>

        {errors.submit && (
          <div className="login-form__error login-form__error--submit">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          className="login-form__button"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoginForm;
