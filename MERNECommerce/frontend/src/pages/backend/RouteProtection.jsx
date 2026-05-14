import { Navigate } from "react-router-dom";

function RouteProtection({ children }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default RouteProtection;
