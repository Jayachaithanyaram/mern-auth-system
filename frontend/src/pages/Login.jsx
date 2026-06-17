import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://mern-auth-backend-rrkc.onrender.com/api/auth/login",
        formData
      );

      // Store token
      localStorage.setItem(
        "token",
        res.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        res.data.refreshToken
      );

      alert(res.data.message);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
  <div className="login-page">
    <div className="login-card">

      <h1 className="login-title">
        Welcome Back
      </h1>

      <p className="login-subtitle">
        Login to your account
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="login-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="login-input"
        />

        <button
          type="submit"
          className="login-btn"
        >
          Login
        </button>

      </form>

      <div className="login-links">

        <Link to="/forgot-password">
          Forgot Password?
        </Link>

        <Link to="/">
          Create Account
        </Link>

      </div>

    </div>
  </div>
);
}

export default Login;