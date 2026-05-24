import { useEffect, useState } from "react";
import api from "../services/api";

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
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      {user ? (
        <div>
          <h2>Welcome {user.username}</h2>
          <p>{user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;