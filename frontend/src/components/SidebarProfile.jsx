import { Link, useLocation } from "react-router-dom";
import styles from "./SidebarProfile.module.css";

const SidebarProfile = ({ isOpen, setIsOpen, isCourier }) => {
  const location = useLocation()

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
              to="deliveries"
              onClick={handleLinkClick}
              className={isActive("/user/deliveries") ? styles.activeLink : ""}
            >
              📦 Deliveries
            </Link>
            <Link
              to="feedbacks"
              onClick={handleLinkClick}
              className={isActive("/user/feedbacks") ? styles.activeLink : ""}
            >
              💬 Feedbacks
            </Link>
            {isCourier && (
              <Link
                to="schedule"
                onClick={handleLinkClick}
                className={isActive("/user/schedule") ? styles.activeLink : ""}
              >
                📅 Schedule
              </Link>
            )}
          </nav>
        </>
      )}
    </aside>
  );
};

export default SidebarProfile;
