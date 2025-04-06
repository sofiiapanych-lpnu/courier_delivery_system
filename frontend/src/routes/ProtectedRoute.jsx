import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Перевірка авторизації

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
