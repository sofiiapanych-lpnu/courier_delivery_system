import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useFilters } from '../hooks/useFilters';
import { vehicleService } from '../api/vehicleService';
import { courierService } from '../api/courierService'
import { formatVehicle } from '../utils/formatters';
import { normalizeVehicleData, normalizeCourierData } from '../utils/dataNormalizers';
import Table from '../components/Table';
import Modal from '../components/Modal';
import VehicleForm from '../components/forms/VehicleForm';

const VehiclesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const initialFormState = {
    licensePlate: '',
    model: '',
    transportType: '',
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const {
    filters,
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(initialFormState, setPage);

  const { data: vehicles, setData: setVehicles, totalPages } = useData(vehicleService, filters, page, limit, refreshKey);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [couriers, setCouriers] = useState([]);

  const handleEditVehicle = (id) => {
    vehicleService.getById(id)
      .then(response => {
        setSelectedVehicle(response.data);
        setModalMode('edit');
        setModalOpen(true);
      })
      .catch(error => console.error('Error fetching vehicle:', error));
  };
  console.log('selectedVehicle', selectedVehicle)
  const handleDeleteVehicle = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleModalOK = async () => {
    if (modalMode === 'edit') {
      try {
        console.log(selectedVehicle)

        if (!selectedVehicle.Courier && selectedVehicle.courier_id) {
          const courierId = parseInt(selectedVehicle.courier_id, 10);
          selectedVehicle.Courier = couriers.find(c => c.courier_id === courierId);
          console.log('selectedVehicle.Courier', selectedVehicle.Courier);
        }

        if (selectedVehicle?.Courier) {
          const updatedCourier = {
            ...selectedVehicle.Courier,
            vehicle: selectedVehicle
          };

          const normalizedCourier = normalizeCourierData(updatedCourier);
          console.log('normalizedCourier', normalizedCourier)

          try {
            const { data: courierData } = await courierService.update(selectedVehicle.courier_id, normalizedCourier);
            console.log('courierData', courierData);
          } catch (error) {
            console.error('Error updating courier:', error);
          }
        }

        const normalizedVehicle = normalizeVehicleData(selectedVehicle);
        const { data } = await vehicleService.update(selectedVehicle.license_plate, normalizedVehicle);
        console.log('vehicleData', data)


        setVehicles(prev => prev.map(v => v.vehicle_id === selectedVehicle.vehicle_id ? data : v));
        setRefreshKey(prevKey => prevKey + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setModalOpen(false);
      }
    }

    if (modalMode === 'delete') {
      try {
        await vehicleService.delete(selectedVehicle);
        const remaining = vehicles.filter(v => v.vehicle_id !== selectedVehicle);
        setVehicles(remaining);
        if (vehicles.length === 1 && page > 1) {
          setPage(prev => prev - 1);
        } else {
          setRefreshKey(prev => prev + 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setModalOpen(false);
      }
    }

    if (modalMode === 'create') {
      try {
        const normalizedVehicle = normalizeVehicleData(selectedVehicle);
        const { data: newVehicle } = await vehicleService.create(normalizedVehicle);
        setVehicles(prev => [newVehicle, ...prev]);
        setRefreshKey(prev => prev + 1);
      } catch (err) {
        console.error('Error creating vehicle:', err);
      } finally {
        setModalOpen(false);
      }
    }

  };
  console.log('vehicles', vehicles)
  console.log('couriers', couriers)

  const vehicleColumns = [
    { header: 'License Plate', accessor: 'license_plate' },
    { header: 'Model', accessor: 'model' },
    { header: 'Type', accessor: 'transport_type' },
    {
      header: 'Owner',
      accessor: 'is_company_owner',
      cell: ({ row }) => {
        const owner = row.is_company_owner;
        if (owner) {
          return 'Company';
        }
        return row?.Courier?.user.first_name && row?.Courier?.user.last_name ? `${row.Courier.user.first_name} ${row.Courier.user.last_name}` : 'Undefined courier';
      }
    }
    ,
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <>
          <button onClick={() => handleEditVehicle(row.license_plate)}>Edit</button>
          <button onClick={() => handleDeleteVehicle(row.license_plate)} style={{ marginLeft: '10px' }}>Delete</button>
        </>
      )
    }
  ];

  return (
    <div>
      <h1>Admin - Vehicles</h1>
      <div className='filters'>
        <input
          name="licensePlate"
          onChange={handleFilterChange}
          placeholder="License Plate"
          value={formState.licensePlate}
        />
        <input
          name="model"
          onChange={handleFilterChange}
          placeholder="Model"
          value={formState.model}
        />
        <select
          name="transportType"
          onChange={handleFilterChange}
          value={formState.transportType}
        >
          <option value="">Select Transport Type</option>
          <option value="car">Car</option>
          <option value="truck">Truck</option>
          <option value="motorcycle">Motorcycle</option>
        </select>

        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>
      <button
        onClick={() => {
          setSelectedVehicle(null);
          setModalMode('create');
          setModalOpen(true);
        }}
      >
        Add Vehicle
      </button>

      <Table data={vehicles} columns={vehicleColumns} />
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {modalOpen && (
        <Modal open={modalOpen} onClose={handleModalClose} onOK={handleModalOK}>
          {modalMode === 'edit' || modalMode === 'create' ? (
            <VehicleForm selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} mode={modalMode} />
          ) : (
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this vehicle?</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default VehiclesPage;
