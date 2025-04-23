import React, { useState } from 'react';
import { authService } from '../../api/authService';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await authService.signin(formData);
      localStorage.setItem('token', res.data.access_token);
      setMessage('Login successful!', res.data.access_token);
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label><br />
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div>
        <label>Password:</label><br />
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>

      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
};

export default LoginForm;
