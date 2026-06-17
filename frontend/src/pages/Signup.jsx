import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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
        "https://mern-auth-backend-rrkc.onrender.com/api/auth/signup",
        formData
      );

      alert(res.data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

return (
  <div className="auth-page">
    <div className="auth-card">

      <h1 className="auth-title">
        Create Account
      </h1>

      <p className="auth-subtitle">
        Join the MERN Auth System
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="auth-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="auth-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="auth-input"
        />

        <button
          type="submit"
          className="auth-btn"
        >
          Create Account
        </button>

      </form>

      <p className="auth-footer">
        Already have an account?

        <Link to="/login">
          Login
        </Link>
      </p>

    </div>
  </div>
);

}

export default Signup;