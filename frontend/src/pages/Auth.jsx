import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      {isRegister ? <RegisterForm /> : <LoginForm />}

      <button onClick={() => setIsRegister(!isRegister)}>
        Switch to {isRegister ? 'Login' : 'Register'}
      </button>
    </div>
  );
};

export default Auth;
