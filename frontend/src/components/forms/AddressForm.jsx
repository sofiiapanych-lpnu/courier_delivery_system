import React from 'react';

const AddressForm = ({ selectedAddress }) => {
  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updatedAddress = { ...selectedAddress };
    let current = updatedAddress;

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
  };

  const renderInput = (label, path, value, required = false) => (
    <div className='input-field'>
      <label>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleChange(path, e.target.value)}
        required={required}
      />
    </div>
  );

  return (
    <div>
      <h2>Edit Address</h2>
      <div className='address'>
        {renderInput("Country", "country", selectedAddress?.country, true)}
        {renderInput("City", "city", selectedAddress?.city, true)}
        {renderInput("Street Name", "street_name", selectedAddress?.street_name, true)}
        {renderInput("Building Number", "building_number", selectedAddress?.building_number, true)}
        {renderInput("Apartment Number (optional)", "apartment_number", selectedAddress?.apartment_number)}
      </div>
    </div>
  );
};

export default AddressForm;
