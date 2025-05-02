import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../context/UserContext';
import { authService } from '../../api/authService';
import { vehicleService } from '../../api/vehicleService';
import styles from './LoginRegister.module.css';
import Select from 'react-select';

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
  const [vehicleSource, setVehicleSource] = useState('own');
  const [companyVehicles, setCompanyVehicles] = useState([]);
  const [message, setMessage] = useState('');
  const userContext = useUser();
  const transportTypes = [
    { label: 'Car', value: 'car' },
    { label: 'Truck', value: 'truck' },
    { label: 'Motorcycle', value: 'motorcycle' },
  ];

  useEffect(() => {
    if (formData.role === 'courier') {
      setFormData((prev) => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          isCompanyOwner: vehicleSource === 'company'
        }
      }));

      if (vehicleSource === 'company') {
        vehicleService.getCompanyVehicles()
          .then(response => {
            setCompanyVehicles(response.data);
          })
          .catch(error => console.error('Error fetching company vehicles:', error));
      }
    }
  }, [vehicleSource, formData.role]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    if (payload.role !== 'courier') {
      delete payload.vehicle;
    }

    try {
      const res = await authService.signup(payload);
      localStorage.setItem('token', res.data.access_token);

      const decoded = jwtDecode(res.data.access_token);
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
    const newVal = !formData.vehicle.isCompanyOwner;
    setFormData((prev) => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        isCompanyOwner: newVal
      }
    }));
    // Якщо вибрав компанійське авто — переключаємо на селект за замовчуванням
    if (newVal) {
      setVehicleSource('company');
    } else {
      setVehicleSource('own');
    }
  };

  const handleVehicleSelect = (selectedOption) => {
    const selectedVehicle = companyVehicles.find(v => v.license_plate === selectedOption.value);
    setFormData((prev) => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        licensePlate: selectedVehicle.license_plate,
        model: selectedVehicle.model,
        transportType: selectedVehicle.transport_type
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`${styles.formWrapper} ${formData.role === 'courier' ? styles.courierActive : ''
          }`}
      >
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+380671234567"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Please enter a valid email address."
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

          <div className={styles.formGroup}>
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="client">Client</option>
              <option value="courier">Courier</option>
            </select>
          </div>
        </div>

        {formData.role === 'courier' && (
          <div className={styles.formSection}>
            {/* <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                Company Owner
                <input
                  type="checkbox"
                  checked={formData.vehicle.isCompanyOwner}
                  onChange={handleCheckboxChange}
                />
              </label>
            </div> */}

            <div className={styles.formGroup}>
              <label>Vehicle Source:</label>
              <select value={vehicleSource} onChange={(e) => setVehicleSource(e.target.value)}>
                <option value="company">Select from company vehicles</option>
                <option value="own">Enter custom vehicle</option>
              </select>
            </div>

            {/* if select company vehicle */}
            {vehicleSource === 'company' && (
              <div className={styles.formGroup}>
                <label>Select Company Vehicle:</label>
                <Select
                  options={companyVehicles.map(v => ({
                    value: v.license_plate,
                    label: `${v.transport_type} — ${v.model} — ${v.license_plate}`
                  }))}
                  onChange={handleVehicleSelect}
                  placeholder="Select a vehicle..."
                  isClearable
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
            )}

            {/* if enter own vehicle */}
            {vehicleSource === 'own' && (
              <>
                <div className={styles.formGroup}>
                  <label>License Plate:</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.vehicle.licensePlate}
                    onChange={handleChange}
                    placeholder="AA1234BB"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Model:</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.vehicle.model}
                    onChange={handleChange}
                    placeholder="Volkswagen Caddy"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Transport Type:</label>
                  <select
                    name="transportType"
                    value={formData.vehicle.transportType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Transport Type</option>
                    {transportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>
        Register
      </button>

      <p className={styles.message}>{message}</p>
    </form>

  );
};

export default RegisterForm;
