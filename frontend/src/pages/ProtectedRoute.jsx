import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  // If no token → redirect login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists → allow access
  return children;
}

export default ProtectedRoute;