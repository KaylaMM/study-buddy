import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error logging in" };
    }
  },

  async signup(username, email, password) {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error signing up" };
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  },
};

export default authService;
