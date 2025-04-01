import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./CreateDeckForm.scss";
const CreateDeckForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
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
      if (!initialData) {
        setFormData({ title: "", description: "" });
      }
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred while creating the deck",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="deck-form-modal">
      <div className="deck-form-modal__overlay" onClick={onCancel} />
      <div className="deck-form-modal__container">
        <div className="deck-form">
          <h3 className="deck-form__title">
            {initialData ? "Edit Deck" : "Create New Deck"}
          </h3>
          <form onSubmit={handleSubmit} className="deck-form__form">
            <div className="deck-form__group">
              <label htmlFor="title" className="deck-form__label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`deck-form__input ${
                  errors.title ? "deck-form__input--error" : ""
                }`}
                placeholder="Enter deck title"
              />
              {errors.title && (
                <span className="deck-form__error">{errors.title}</span>
              )}
            </div>

            <div className="deck-form__group">
              <label htmlFor="description" className="deck-form__label">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="deck-form__textarea"
                placeholder="Enter deck description"
              />
            </div>

            {errors.submit && (
              <div className="deck-form__error deck-form__error--submit">
                {errors.submit}
              </div>
            )}

            <div className="deck-form__button-group">
              <button
                type="submit"
                className={`deck-form__button deck-form__button--submit ${
                  isLoading ? "deck-form__button--loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving..."
                  : initialData
                  ? "Save Changes"
                  : "Create Deck"}
              </button>
              <button
                type="button"
                className="deck-form__button deck-form__button--cancel"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

CreateDeckForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default CreateDeckForm;
