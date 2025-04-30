import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.sidebarHidden : ""}`}>
      <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "←" : "→"}
      </button>
      {isOpen && (
        <>
          <h2 className={styles.menuTitle}>Menu</h2>
          <nav className={styles.navLinks}>
            <Link to="/admin/deliveries">📦 Deliveries</Link>
            <Link to="/admin/users">👥 Users</Link>
            <Link to="/admin/orders">📝 Orders</Link>
            <Link to="/admin/courier-schedules">📅 Courier Schedules</Link>
            <Link to="/admin/warehouses">🏬 Warehouses</Link>
            <Link to="/admin/vehicles">🚗 Vehicles</Link>
            <Link to="/admin/feedbacks">💬 Feedbacks</Link>
            <Link to="/admin/reports">📊 Reports</Link>
          </nav>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
