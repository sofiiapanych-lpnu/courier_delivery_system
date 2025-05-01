import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useFilters } from '../../hooks/useFilters';
import { vehicleService } from '../../api/vehicleService';
import { courierService } from '../../api/courierService'
import { formatVehicle } from '../../utils/formatters';
import { normalizeVehicleData, normalizeCourierData } from '../../utils/dataNormalizers';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import VehicleForm from '../../components/forms/VehicleForm';
import Pagination from '../../components/Pagination'
import ActionButton from '../../components/ActionButton'
import './filters.css';

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
        <div className="actionsWrapper">
          <ActionButton
            variant="edit"
            onClick={() => handleEditVehicle(row.license_plate)}
          >
            Edit
          </ActionButton>
          <ActionButton
            variant="delete"
            onClick={() => handleDeleteVehicle(row.license_plate)}>
            Delete
          </ActionButton>
        </div>
      )
    }
  ];

  return (
    <div>
      <h1>Vehicles</h1>
      <div className='filters'>
        <div className="filter-group">
          <label htmlFor="licensePlate">License Plate</label>
          <input
            id="licensePlate"
            name="licensePlate"
            onChange={handleFilterChange}
            placeholder="e.g. ABC-1234"
            value={formState.licensePlate}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="model">Model</label>
          <input
            id="model"
            name="model"
            onChange={handleFilterChange}
            placeholder="e.g. Toyota Corolla"
            value={formState.model}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="transportType">Transport Type</label>
          <select
            id="transportType"
            name="transportType"
            onChange={handleFilterChange}
            value={formState.transportType}
          >
            <option value="">Select Transport Type</option>
            <option value="car">Car</option>
            <option value="truck">Truck</option>
            <option value="motorcycle">Motorcycle</option>
          </select>
        </div>

        <div className="filter-section">
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>

      <button
        className="create-btn"
        onClick={() => {
          setSelectedVehicle(null);
          setModalMode('create');
          setModalOpen(true);
        }}
      >
        Create Vehicle
      </button>

      <Table data={vehicles} columns={vehicleColumns} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

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
