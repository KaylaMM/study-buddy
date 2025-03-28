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

      const { data } = response;
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to login. Please try again."
      );
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
