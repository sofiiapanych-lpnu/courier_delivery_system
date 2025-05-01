import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.sidebarHidden : ""}`}>
      <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "←" : "→"}
      </button>
      {isOpen && (
        <>
          <h2 className={styles.menuTitle}>Menu</h2>
          <nav className={styles.navLinks}>
            <Link
              to="/admin/deliveries"
              onClick={handleLinkClick}
              className={isActive("/admin/deliveries") ? styles.activeLink : ""}
            >
              📦 Deliveries
            </Link>
            <Link
              to="/admin/users"
              onClick={handleLinkClick}
              className={isActive("/admin/users") ? styles.activeLink : ""}
            >
              👥 Users
            </Link>
            <Link
              to="/admin/orders"
              onClick={handleLinkClick}
              className={isActive("/admin/orders") ? styles.activeLink : ""}
            >
              📝 Orders
            </Link>
            <Link
              to="/admin/courier-schedules"
              onClick={handleLinkClick}
              className={isActive("/admin/courier-schedules") ? styles.activeLink : ""}
            >
              📅 Courier Schedules
            </Link>
            <Link
              to="/admin/warehouses"
              onClick={handleLinkClick}
              className={isActive("/admin/warehouses") ? styles.activeLink : ""}
            >
              🏬 Warehouses
            </Link>
            <Link
              to="/admin/vehicles"
              onClick={handleLinkClick}
              className={isActive("/admin/vehicles") ? styles.activeLink : ""}
            >
              🚗 Vehicles
            </Link>
            <Link
              to="/admin/feedbacks"
              onClick={handleLinkClick}
              className={isActive("/admin/feedbacks") ? styles.activeLink : ""}
            >
              💬 Feedbacks
            </Link>
            <Link
              to="/admin/reports"
              onClick={handleLinkClick}
              className={isActive("/admin/reports") ? styles.activeLink : ""}
            >
              📊 Reports
            </Link>
          </nav>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
