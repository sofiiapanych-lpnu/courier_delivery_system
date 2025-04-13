import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Auth from "../pages/Auth.jsx";
import ProtectedRoute from "./ProtectedRoute";
import UserPage from "../pages/UserPage.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/user" element={<UserPage />}></Route>
        {/* Захищений маршрут, доступний тільки для авторизованих користувачів */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
