import axios from "axios";

const API_URL = "/api";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const deckService = {
  getDecks: async () => {
    const response = await axiosInstance.get(`${API_URL}/decks`);
    return response.data;
  },

  getDeckById: async (id) => {
    const response = await axiosInstance.get(`${API_URL}/decks/${id}`);
    return response.data;
  },

  createDeck: async (deckData) => {
    const response = await axiosInstance.post(`${API_URL}/decks`, deckData);
    return response.data;
  },

  updateDeck: async (id, deckData) => {
    const response = await axiosInstance.put(
      `${API_URL}/decks/${id}`,
      deckData
    );
    return response.data;
  },

  deleteDeck: async (id) => {
    const response = await axiosInstance.delete(`${API_URL}/decks/${id}`);
    return response.data;
  },
};
