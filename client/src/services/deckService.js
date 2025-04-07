import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/auth";

const deckService = {
  getDecks: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/decks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getDeck: async (deckId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/decks/${deckId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createDeck: async (deckData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/decks`, deckData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateDeck: async (deckId, deckData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/decks/${deckId}`, deckData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteDeck: async (deckId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/decks/${deckId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export { deckService };
