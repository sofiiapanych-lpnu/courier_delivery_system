import { useState } from 'react';
import { authService } from '../../api/authService';
import styles from './LoginRegister.module.css';

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
      setMessage('Login successful!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Login
      </button>

      <p className={styles.message}>
        {message && message}
      </p>
    </form>
  );
};

export default LoginForm;
