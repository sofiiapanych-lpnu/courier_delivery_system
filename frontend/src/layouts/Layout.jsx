import Header from "../components/Header";
import "../styles/layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
