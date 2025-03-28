import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_API_URL;

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post(
        `${serverURL}/api/auth/login`,
        formData
      );

      // const response = await fetch("http://localhost:8080/api/auth/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      //   credentials: "include",
      // });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      throw new Error(error.message || "Failed to login. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <LoginForm onSubmit={handleLogin} />
        <div className="auth-links">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="auth-link">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
