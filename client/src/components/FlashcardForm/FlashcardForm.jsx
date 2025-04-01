import { useState } from "react";
import PropTypes from "prop-types";
import { flashcardService } from "../../services/flashcardService";
import "./FlashcardForm.scss";

const FlashcardForm = ({ deckId, onUpdate, onCancel, id, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      frontContent: "",
      backContent: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.frontContent) {
      newErrors.frontContent = "Front content is required";
    }

    if (!formData.backContent) {
      newErrors.backContent = "Back content is required";
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
      if (id) {
        // Update existing flashcard
        await flashcardService.updateFlashcard(id, formData);
      } else {
        // Create new flashcard
        await flashcardService.createFlashcard(deckId, formData);
      }
      onUpdate();
    } catch (error) {
      setErrors({
        submit: error.message || "An error occurred while saving the flashcard",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flashcard-form-modal">
      <div className="flashcard-form-modal__overlay" onClick={onCancel} />
      <div className="flashcard-form-modal__container">
        <div className="flashcard-form">
          <h3 className="flashcard-form__title">
            {id ? "Edit Flashcard" : "Create New Flashcard"}
          </h3>
          <form onSubmit={handleSubmit} className="flashcard-form__form">
            <div className="flashcard-form__group">
              <label htmlFor="frontContent" className="flashcard-form__label">
                Front
              </label>
              <textarea
                id="frontContent"
                name="frontContent"
                value={formData.frontContent}
                onChange={handleChange}
                className={`flashcard-form__textarea ${
                  errors.frontContent ? "flashcard-form__textarea--error" : ""
                }`}
                placeholder="Enter the question or front content"
              />
              {errors.frontContent && (
                <span className="flashcard-form__error">
                  {errors.frontContent}
                </span>
              )}
            </div>

            <div className="flashcard-form__group">
              <label htmlFor="backContent" className="flashcard-form__label">
                Back
              </label>
              <textarea
                id="backContent"
                name="backContent"
                value={formData.backContent}
                onChange={handleChange}
                className={`flashcard-form__textarea ${
                  errors.backContent ? "flashcard-form__textarea--error" : ""
                }`}
                placeholder="Enter the answer or back content"
              />
              {errors.backContent && (
                <span className="flashcard-form__error">
                  {errors.backContent}
                </span>
              )}
            </div>

            {errors.submit && (
              <div className="flashcard-form__error flashcard-form__error--submit">
                {errors.submit}
              </div>
            )}

            <div className="flashcard-form__button-group">
              <button
                type="submit"
                className={`flashcard-form__button flashcard-form__button--submit ${
                  isLoading ? "flashcard-form__button--loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="flashcard-form__button flashcard-form__button--cancel"
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

FlashcardForm.propTypes = {
  deckId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  id: PropTypes.string,
  initialData: PropTypes.shape({
    frontContent: PropTypes.string,
    backContent: PropTypes.string,
  }),
};

export default FlashcardForm;
