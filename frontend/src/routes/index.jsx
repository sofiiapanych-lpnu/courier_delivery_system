import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Auth from "../pages/Auth.jsx";
import ProtectedRoute from "./ProtectedRoute";
import UserProfilePage from "../pages/UserProfilePage.jsx";
import AdminPage from "../pages/AdminPage/AdminPage.jsx";
import DeliveriesPage from "../pages/AdminPage/DeliveriesPage.jsx";
import UserPage from "../pages/AdminPage/UserPage.jsx"
import OrdersPage from "../pages/AdminPage/OrdersPage.jsx";
import CourierSchedulePage from "../pages/AdminPage/CourierSchedulePage.jsx";
import WarehousesPage from "../pages/AdminPage/WarehousesPage.jsx";
import VehiclesPage from "../pages/AdminPage/VehiclesPage.jsx";
import FeedbacksPage from "../pages/AdminPage/FeeedbackPage.jsx";
import ReportPage from "../pages/AdminPage/ReportPage.jsx";
import WarehousesListPage from "../pages/WarehousesListPage.jsx";
import CreateOrderPage from "../pages/CreateOrderPage.jsx";
import Layout from '../layouts/Layout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Auth />} />
        <Route path="/user" element={<Layout><UserProfilePage /></Layout>}></Route>
        <Route path="/admin" element={<AdminLayout><AdminPage /></AdminLayout>}>
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="courier-schedules" element={<CourierSchedulePage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="feedbacks" element={<FeedbacksPage />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>
        <Route path="/warehouses" element={<Layout><WarehousesListPage /></Layout>}></Route>
        <Route path="/warehouses/:warehouseId/:warehouseName/create-order" element={<Layout><CreateOrderPage /></Layout>} />

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
