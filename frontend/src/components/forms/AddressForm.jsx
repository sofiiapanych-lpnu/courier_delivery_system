import React from 'react';

const AddressForm = ({ address, onChange }) => {
  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updatedAddress = { ...address };
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

    onChange(updatedAddress);
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

  return (
    <div>
      <h2>Edit Address</h2>
      <div className='address'>
        {renderInput("Country", "country", address?.country)}
        {renderInput("City", "city", address?.city)}
        {renderInput("Street Name", "street_name", address?.street_name)}
        {renderInput("Building Number", "building_number", address?.building_number)}
        {renderInput("Apartment Number (optional)", "apartment_number", address?.apartment_number)}
      </div>
    </div>
  );
};

export default AddressForm;
