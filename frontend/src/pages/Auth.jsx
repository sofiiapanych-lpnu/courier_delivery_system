import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import LoginForm from '../components/forms/LoginForm';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      {isRegister ?
        <RegisterForm onSuccess={handleSuccess} />
        : <LoginForm onSuccess={handleSuccess} />
      }

      <button onClick={() => setIsRegister(!isRegister)}>
        Switch to {isRegister ? 'Login' : 'Register'}
      </button>
    </div>
  );
};

export default Auth;
