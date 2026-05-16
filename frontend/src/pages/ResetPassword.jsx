import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      alert(res.data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;