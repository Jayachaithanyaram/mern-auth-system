import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying email...");

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );

        setMessage(res.data.message);

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } catch (error) {
        setMessage(
          error.response?.data?.message ||
          "Verification failed"
        );
      }
    };

    verifyUserEmail();
  }, [token, navigate]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Email Verification</h1>

      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;