import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { authService } from '../../api/authService';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    role: 'client',
    vehicle: {
      licensePlate: '',
      model: '',
      transportType: '',
      isCompanyOwner: false
    }
  });
  const [message, setMessage] = useState('');
  const userContext = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    if (payload.role !== 'courier') {
      delete payload.vehicle;
    }

    try {
      const res = await authService.signup(payload);
      localStorage.setItem('token', res.data.access_token);

      const decoded = jwt_decode(res.data.access_token);
      if (userContext && userContext.setUser) {
        userContext.setUser({ userId: decoded.sub, email: decoded.email });
      }

      setMessage('Registration successful!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.vehicle) {
      setFormData((prev) => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        isCompanyOwner: !prev.vehicle.isCompanyOwner
      }
    }));
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

      <div>
        <label>First Name:</label><br />
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>

      <div>
        <label>Last Name:</label><br />
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>

      <div>
        <label>Phone Number:</label><br />
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
      </div>

      <div>
        <label>Role:</label><br />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="client">Client</option>
          <option value="courier">Courier</option>
        </select>
      </div>

      {formData.role === 'courier' && (
        <>
          <div>
            <label>License Plate:</label><br />
            <input type="text" name="licensePlate" value={formData.vehicle.licensePlate} onChange={handleChange} required />
          </div>

          <div>
            <label>Model:</label><br />
            <input type="text" name="model" value={formData.vehicle.model} onChange={handleChange} required />
          </div>

          <div>
            <label>Transport Type:</label><br />
            <input type="text" name="transportType" value={formData.vehicle.transportType} onChange={handleChange} required />
          </div>

          <div>
            <label>
              <input type="checkbox" checked={formData.vehicle.isCompanyOwner} onChange={handleCheckboxChange} />
              Company Owner
            </label>
          </div>
        </>
      )}

      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
};

export default RegisterForm;
