import { useNavigate } from "react-router-dom";
import SignupForm from "../../components/SignupForm/SignupForm";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_API_URL;

  const handleRegister = async (formData) => {
    try {
      const { ...registrationData } = formData;

      const response = await axios.post(
        `${serverURL}/api/auth/signup`,
        registrationData
      );

      const { data } = response;
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
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
        <SignupForm onSubmit={handleRegister} />
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

export default SignupPage;
