import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
