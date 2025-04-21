import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Auth from "../pages/Auth.jsx";
import ProtectedRoute from "./ProtectedRoute";
import UserProfilePage from "../pages/UserProfilePage.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import DeliveriesPage from "../pages/DeliveriesPage.jsx";
import UserPage from "../pages/UserPage.jsx"
import OrdersPage from "../pages/OrdersPage.jsx";
import CourierSchedulePage from "../pages/CourierSchedulePage.jsx";
import WarehousesPage from "../pages/WarehousesPage.jsx";
import VehiclesPage from "../pages/VehiclesPage.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/user" element={<UserProfilePage />}></Route>
        <Route path="/admin" element={<AdminPage />}>
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="courier-schedules" element={<CourierSchedulePage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
        </Route>

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
