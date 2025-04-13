import React, { useState } from "react";

const VehicleForm = ({ vehicle = {}, onUpdate }) => {
  const [licensePlate, setLicensePlate] = useState(vehicle.license_plate || "");
  const [model, setModel] = useState(vehicle.model || "");
  const [transportType, setTransportType] = useState(vehicle.transport_type || "");
  const [ownedByCompany, setOwnedByCompany] = useState(vehicle.owned_by_company || false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      vehicle: {
        license_plate: licensePlate,
        model: model,
        transport_type: transportType,
        owned_by_company: ownedByCompany
      }
    };

    onUpdate(updatedData);
  };

  return (
    <div>
      <h2>Update Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>License Plate</label>
          <input
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </div>
        <div>
          <label>Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
        <div>
          <label>Transport Type</label>
          <input
            type="text"
            value={transportType}
            onChange={(e) => setTransportType(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={ownedByCompany}
              onChange={(e) => setOwnedByCompany(e.target.checked)}
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
