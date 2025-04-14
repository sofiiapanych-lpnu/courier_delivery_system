import React, { useState } from 'react';

const AddressForm = ({ address = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    country: address.country || '',
    city: address.city || '',
    street_name: address.street_name || '',
    building_number: address.building_number || '',
    apartment_number: address.apartment_number || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    console.log(formData)

  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Street Name:</label>
        <input
          type="text"
          name="street_name"
          value={formData.street_name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Building Number:</label>
        <input
          type="text"
          name="building_number"
          value={formData.building_number}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Apartment Number (optional):</label>
        <input
          type="text"
          name="apartment_number"
          value={formData.apartment_number}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Save</button>
    </form>
  );
};

export default AddressForm;
