import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token found in localStorage");
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error(
        "Authentication failed. Token might be invalid or missing."
      );
    }
    return Promise.reject(error);
  }
);

export const flashcardService = {
  getFlashcardsByDeck: async (deckId) => {
    const response = await axiosInstance.get(
      `${API_URL}/flashcards/decks/${deckId}/flashcards`
    );
    return response.data.map((flashcard) => ({
      ...flashcard,
      frontContent: flashcard.front_content,
      backContent: flashcard.back_content,
    }));
  },

  getFlashcardById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/flashcards/${id}`);
    const flashcard = response.data;
    return {
      ...flashcard,
      frontContent: flashcard.front_content,
      backContent: flashcard.back_content,
    };
  },

  createFlashcard: async (deckId, flashcardData) => {
    const serverData = {
      front_content: flashcardData.frontContent,
      back_content: flashcardData.backContent,
    };
    const response = await axiosInstance.post(
      `${API_URL}/flashcards/decks/${deckId}/flashcards`,
      serverData
    );
    const flashcard = response.data;
    return {
      ...flashcard,
      frontContent: flashcard.front_content,
      backContent: flashcard.back_content,
    };
  },

  updateFlashcard: async (id, flashcardData) => {
    const serverData = {
      front_content: flashcardData.frontContent,
      back_content: flashcardData.backContent,
    };
    const response = await axiosInstance.put(
      `${API_URL}/flashcards/${id}`,
      serverData
    );
    const flashcard = response.data;
    return {
      ...flashcard,
      frontContent: flashcard.front_content,
      backContent: flashcard.back_content,
    };
  },

  deleteFlashcard: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}/flashcards/${id}`);
    return response.data;
  },
};
