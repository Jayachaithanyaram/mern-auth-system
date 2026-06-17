import { useState } from "react";
import api from "../services/api";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/forgot-password",
        { email }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
  <div className="forgot-page">

    <div className="forgot-card">

      <h1 className="forgot-title">
        Forgot Password
      </h1>

      <p className="forgot-subtitle">
        Enter your email and we'll send you a password reset link.
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="forgot-input"
        />

        <button
          type="submit"
          className="forgot-btn"
        >
          Send Reset Email
        </button>

      </form>

    </div>

  </div>
);
}

export default ForgotPassword;