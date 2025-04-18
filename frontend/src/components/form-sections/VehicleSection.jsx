import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../api/vehicleService';

const VehicleSection = ({ selectedUser, setSelectedUser, renderInput, renderSelect }) => {
  const [vehicleSource, setVehicleSource] = useState(() => {
    if (selectedUser?.Courier?.vehicle?.is_company_owner) {
      return 'courierCompanyVehicle';
    }
    return 'own';
  });
  // 'courierCompanyVehicle' | 'own' | 'company' | 'newVehicle'
  const [companyVehicles, setCompanyVehicles] = useState([]);

  useEffect(() => {
    if (vehicleSource === 'company') {
      vehicleService.getCompanyVehicles()
        .then(response => {
          setCompanyVehicles(response.data);
        })
        .catch(error => console.error('Error fetching company vehicles:', error));
    }
  }, [vehicleSource]);

  return (
    <div className="vehicle-section">
      <h3>Vehicle</h3>
      <div>
        {selectedUser.Courier?.vehicle.is_company_owner ? (
          <>
            <label>
              <input
                type="radio"
                name="vehicleSource"
                value="courierCompanyVehicle"
                checked={vehicleSource === 'courierCompanyVehicle'}
                onChange={() => setVehicleSource('courierCompanyVehicle')}
              />
              Display your company vehicle
            </label>
            <label>
              <input
                type="radio"
                name="vehicleSource"
                value="newVehicle"
                checked={vehicleSource === 'newVehicle'}
                onChange={() => setVehicleSource('newVehicle')}
              />
              Create your vehicle
            </label>
            <label>
              <input
                type="radio"
                name="vehicleSource"
                value="company"
                checked={vehicleSource === 'company'}
                onChange={() => setVehicleSource('company')}
              />
              Choose company vehicle
            </label>
          </>
        ) : (
          <>
            <label>
              <input
                type="radio"
                name="vehicleSource"
                value="own"
                checked={vehicleSource === 'own'}
                onChange={() => setVehicleSource('own')}
              />
              Change your vehicle
            </label>
            <label>
              <input
                type="radio"
                name="vehicleSource"
                value="company"
                checked={vehicleSource === 'company'}
                onChange={() => setVehicleSource('company')}
              />
              Choose company vehicle
            </label>
          </>
        )}

        {(vehicleSource === 'own' || vehicleSource === 'newVehicle') && (
          <>
            {renderInput(
              "License Plate",
              "Courier.vehicle.license_plate",
              vehicleSource === 'newVehicle' ? '' : selectedUser?.Courier?.vehicle?.license_plate,
              val => handleVehicleChange("license_plate", val)
            )}
            {renderInput(
              "Model",
              "Courier.vehicle.model",
              vehicleSource === 'newVehicle' ? '' : selectedUser?.Courier?.vehicle?.model,
              val => handleVehicleChange("model", val)
            )}
            {renderSelect(
              "Transport Type",
              "Courier.vehicle.transport_type",
              vehicleSource === 'newVehicle' ? '' : selectedUser?.Courier?.vehicle?.transport_type,
              ['car', 'motorcycle', 'bicycle', 'truck'],
              val => handleVehicleChange("transport_type", val)
            )}
          </>
        )}
        {(vehicleSource === 'courierCompanyVehicle') && (
          <>
            <p>License Plate: {selectedUser?.Courier?.vehicle?.license_plate}</p>
            <p>Model: {selectedUser?.Courier?.vehicle?.model}</p>
            <p>Transport Type: {selectedUser?.Courier?.vehicle?.transport_type}</p>
            <p>This vehicle is a company vehicle.</p>
          </>
        )}
        {(vehicleSource === 'company') && (
          <>
            <select
              name="licence_plate"
              defaultValue={selectedUser?.Courier?.vehicle?.licence_plate || ''}
              onChange={e => {
                const selectedPlate = e.target.value;
                const selectedVehicle = companyVehicles.find(v => v.license_plate === selectedPlate);
                setSelectedUser(prev => ({
                  ...prev,
                  Courier: {
                    ...prev.Courier,
                    vehicle: {
                      ...selectedVehicle,
                      license_plate: e.target.value,
                      is_company_owner: true
                    }
                  }
                }));
              }}
            >
              <option value="">Select a vehicle</option>
              {companyVehicles.map(vehicle => (
                <option key={vehicle.license_plate} value={vehicle.license_plate}>
                  {vehicle.transport_type} - {vehicle.model} - {vehicle.license_plate}
                </option>
              ))}
            </select>
          </>
        )}

      </div>


    </div>
  );
};

export default VehicleSection;
