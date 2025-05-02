import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../api/vehicleService';
import Select from 'react-select';

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
    <div className="section">
      <h3>Vehicle</h3>
      {selectedUser.Courier?.vehicle.is_company_owner ? (
        <div className='row'>
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
        </div>
      ) : (
        <div className='row'>
          <label>
            <input
              type="radio"
              name="vehicleSource"
              value="own"
              checked={vehicleSource === 'own'}
              onChange={() => setVehicleSource('own')}
            />
            Change vehicle
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
        </div>
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
          <Select
            name="license_plate"
            options={companyVehicles.map(vehicle => ({
              value: vehicle.license_plate,
              label: `${vehicle.transport_type} - ${vehicle.model} - ${vehicle.license_plate}`
            }))}
            value={companyVehicles
              .map(vehicle => ({
                value: vehicle.license_plate,
                label: `${vehicle.transport_type} - ${vehicle.model} - ${vehicle.license_plate}`
              }))
              .find(option => option.value === selectedUser?.Courier?.vehicle?.license_plate) || null}
            onChange={(selectedOption) => {
              const selectedVehicle = companyVehicles.find(v => v.license_plate === selectedOption?.value);
              setSelectedUser(prev => ({
                ...prev,
                Courier: {
                  ...prev.Courier,
                  vehicle: {
                    ...selectedVehicle,
                    license_plate: selectedOption?.value,
                    is_company_owner: true
                  }
                }
              }));
            }}
            placeholder="Select a vehicle..."
            isClearable
            menuPortalTarget={document.modal}
            styles={{
              ...customSelectStyles,
              menuPortal: base => ({ ...base, zIndex: 9999 })
            }}
          />
        </>
      )}
    </div>
  );
};

export default VehicleSection;

const customSelectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (provided) => ({
    ...provided,
    maxHeight: '150px',
    overflowY: 'auto',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '150px',
    overflowY: 'auto',
  }),
};


