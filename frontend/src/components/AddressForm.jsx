import React, { useState } from "react";

const AddressForm = ({ userId, address, onUpdate }) => {
  const [addressLine, setAddressLine] = useState(address?.address_line || "");
  const [city, setCity] = useState(address?.city || "");
  const [postalCode, setPostalCode] = useState(address?.postal_code || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      address: {
        addressLine,
        city,
        postalCode
      }
    };

    onUpdate(updatedData);
  };

  return (
    <div>
      <h2>Update Address</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Address Line</label>
          <input
            type="text"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label>Postal Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <button type="submit">Update Address</button>
      </form>
    </div>
  );
};

export default AddressForm;
