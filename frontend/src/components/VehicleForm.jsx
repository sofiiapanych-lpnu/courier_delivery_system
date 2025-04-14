import React, { useState } from "react";

const VehicleForm = ({ vehicle = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    license_plate: vehicle.license_plate || '',
    model: vehicle.model || '',
    transport_type: vehicle.transport_type || '',
    owned_by_company: vehicle.owned_by_company || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    console.log(formData)

  };

  return (
    <div>
      <h2>Update Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>License Plate</label>
          <input
            type="text"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Transport Type</label>
          <input
            type="text"
            name="transport_type"
            value={formData.transport_type}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="owned_by_company"
              checked={formData.owned_by_company}
              onChange={handleChange}
            />
            Owned by company
          </label>
        </div>
        <button type="submit">Update Vehicle</button>
      </form>
    </div>
  );
};

export default VehicleForm;
