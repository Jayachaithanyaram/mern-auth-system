import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const res = await api.get("/auth/me");

        setUser(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    window.location.href = "/login";
  };

  return (
  <div className="dashboard-page">

    <div className="dashboard-navbar">

      <h1 className="dashboard-logo">
        MERN Auth System
      </h1>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>

    {user ? (

      <div className="profile-card">

        <div className="profile-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <h2>
          Welcome Back 👋
        </h2>

        <h3>
          {user.username}
        </h3>

        <p>
          {user.email}
        </p>

        <div className="status-badge">
          Active User
        </div>

      </div>

    ) : (

      <p className="loading-text">
        Loading...
      </p>

    )}

  </div>
);
}

export default Dashboard;