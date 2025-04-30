import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import styles from "./AdminLayout.module.css";
import { useState } from "react";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.contentWithSidebar}>
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main
          className={styles.mainContent}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
