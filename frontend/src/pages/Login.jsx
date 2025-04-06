import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSubmit = (data) => {
    if (isLogin) {
      console.log('Login data:', data);
      // Тут буде логіка для логіну (наприклад, API-запит для аутентифікації)
    } else {
      console.log('Registration data:', data);
      // Тут буде логіка для реєстрації (наприклад, API-запит для створення нового користувача)
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <AuthForm onSubmit={handleAuthSubmit} type={isLogin ? 'login' : 'register'} />
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default LoginPage;
