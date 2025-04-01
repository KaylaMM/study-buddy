import { useState } from "react";
import PropTypes from "prop-types";
import { flashcardService } from "../../services/flashcardService";

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
    <div className="flashcard-form">
      <h3>{id ? "Edit Flashcard" : "Create New Flashcard"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="frontContent">Front</label>
          <textarea
            id="frontContent"
            name="frontContent"
            value={formData.frontContent}
            onChange={handleChange}
            className={errors.frontContent ? "error" : ""}
            placeholder="Enter the front content"
          />
          {errors.frontContent && (
            <span className="error-message">{errors.frontContent}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="backContent">Back</label>
          <textarea
            id="backContent"
            name="backContent"
            value={formData.backContent}
            onChange={handleChange}
            className={errors.backContent ? "error" : ""}
            placeholder="Enter the back content"
          />
          {errors.backContent && (
            <span className="error-message">{errors.backContent}</span>
          )}
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="button-group">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
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
