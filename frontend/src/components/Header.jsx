import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/layout.css";

const Header = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header>
      <Link to="/">Courier Delivery System</Link>

      <nav>
        <Link to="/warehouses">🏬 Warehouses</Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin/deliveries">📊 Admin Panel</Link>
            )}
            <Link to="/user">👤 {user.username}</Link>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <Link to="/login">🔐 Log In</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
