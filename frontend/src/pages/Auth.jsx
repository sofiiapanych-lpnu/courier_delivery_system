import styles from './Auth.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      {isRegister ? (
        <RegisterForm onSuccess={handleSuccess} />
      ) : (
        <LoginForm onSuccess={handleSuccess} />
      )}

      <button
        className={styles.switchButton}
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Already have an account? Log in"
          : "Don't have an account? Create one"}
      </button>

    </div>
  );
};

export default Auth;
