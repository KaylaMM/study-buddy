import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_API_URL;

  const handleRegister = async (formData) => {
    try {
      const { ...registrationData } = formData;

      const response = await axios.post(
        `${serverURL}/api/auth/register`,
        registrationData
      );

      const { data } = response;
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <RegisterForm onSubmit={handleRegister} />
        <div className="auth-links">
          <p>
            Already have an account?{" "}
            <a href="/login" className="auth-link">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
