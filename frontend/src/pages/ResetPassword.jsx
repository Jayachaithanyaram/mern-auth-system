import { useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(
        `/auth/reset-password/${token}`,
        { password }
      );

      alert(res.data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
  <div className="reset-page">

    <div className="reset-card">

      <h1 className="reset-title">
        Reset Password
      </h1>

      <p className="reset-subtitle">
        Create a strong new password for your account.
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="reset-input"
        />

        <button
          type="submit"
          className="reset-btn"
        >
          Reset Password
        </button>

      </form>

    </div>

  </div>
);
}

export default ResetPassword;