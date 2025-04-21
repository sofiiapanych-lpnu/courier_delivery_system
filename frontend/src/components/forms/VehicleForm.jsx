import React, { useEffect } from 'react';

const VehicleForm = ({ selectedVehicle, setSelectedVehicle, mode = 'edit' }) => {
  const transportTypes = [
    { label: 'Car', value: 'car' },
    { label: 'Truck', value: 'truck' },
    { label: 'Motorcycle', value: 'motorcycle' },
  ];

  useEffect(() => {
    if (mode === 'create' && !selectedVehicle?.hasOwnProperty('is_company_owner')) {
      setSelectedVehicle(prev => ({
        ...prev,
        is_company_owner: true,
      }));
    }
  }, [mode, selectedVehicle, setSelectedVehicle]);

  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updatedVehicle = { ...selectedVehicle };
    let current = updatedVehicle;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    });

    setSelectedVehicle(updatedVehicle);
  };

  const renderInput = (label, path, value) => (
    <div className='input-field'>
      <label>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleChange(path, e.target.value)}
      />
    </div>
  );

  const renderSelect = (label, path, value, options) => (
    <div className='input-field'>
      <label>{label}</label>
      <select
        value={value || ''}
        onChange={(e) => handleChange(path, e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderCheckbox = (label, path, value) => (
    <div className='input-field'>
      <label>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => handleChange(path, e.target.checked)}
        />
        {label}
      </label>
    </div>
  );

  return (
    <div>
      <h2>Edit Vehicle</h2>
      <div className='vehicle'>
        {renderInput("License Plate", "license_plate", selectedVehicle?.license_plate)}
        {renderInput("Model", "model", selectedVehicle?.model)}
        {renderSelect("Transport Type", "transport_type", selectedVehicle?.transport_type, transportTypes)}
        {mode === 'edit' &&
          renderCheckbox("Owned by Company", "is_company_owner", selectedVehicle?.is_company_owner)}

      </div>
    </div>
  );
};

export default VehicleForm;
