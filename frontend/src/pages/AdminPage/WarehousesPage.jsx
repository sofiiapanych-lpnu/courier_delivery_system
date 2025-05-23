import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useFilters } from '../../hooks/useFilters';
import { warehouseService } from '../../api/warehouseService';
import { addressService } from '../../api/addressService'
import { formatWarehouse } from '../../utils/formatters';
import { normalizeWarehouseData, normalizeAddressData } from '../../utils/dataNormalizers';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import WarehouseForm from '../../components/forms/WarehouseForm';
import Pagination from '../../components/Pagination'
import ActionButton from '../../components/ActionButton'
import './filters.css';

const WarehousesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const initialFormState = {
    name: '',
    address: '',
    contactNumber: '',
  };
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    filters,
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(initialFormState, setPage);

  const { data: warehouses, setData: setWarehouses, totalPages } = useData(warehouseService, filters, page, limit, refreshKey);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');

  const handleEditWarehouse = (id) => {
    warehouseService.getById(id)
      .then(response => {
        setSelectedWarehouse(response.data);
        setModalMode('edit');
        setModalOpen(true);
      })
      .catch(error => console.error('Error fetching warehouses:', error));
  };

  const handleDeleteWarehouse = (warehouseId) => {
    setSelectedWarehouse(warehouseId);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedWarehouse(null);
  };

  const handleModalOK = async () => {
    if (modalMode === 'edit') {
      try {
        const normalizedAddress = normalizeAddressData(selectedWarehouse.address);
        const { data: dataAddress } = await addressService.update(selectedWarehouse.address.address_id, normalizedAddress);

        selectedWarehouse.address = dataAddress;
        const normalizedWarehouse = normalizeWarehouseData(selectedWarehouse);

        const { data } = await warehouseService.update(selectedWarehouse.warehouse_id, normalizedWarehouse);
        setWarehouses(prev => prev.map(w => w.warehouse_id === selectedWarehouse.warehouse_id ? data : w));
        setRefreshKey(prevKey => prevKey + 1);
      } catch (err) {
        console.log(err);
      } finally {
        setModalOpen(false);
      }
    }

    if (modalMode === 'delete') {
      try {
        await warehouseService.delete(selectedWarehouse);
        const remaining = warehouses.filter(w => w.warehouse_id !== selectedWarehouse);
        setWarehouses(remaining);
        if (warehouses.length === 1 && page > 1) {
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
        const normalizedAddress = normalizeAddressData(selectedWarehouse.address);
        const { data: newAddress } = await addressService.create(normalizedAddress);

        const newWarehouse = {
          ...selectedWarehouse,
          address: newAddress
        };
        console.log('newWarehouse', newWarehouse)
        const normalizedWarehouse = normalizeWarehouseData(newWarehouse);
        console.log('normalizedWarehouse', normalizedWarehouse)

        const { data } = await warehouseService.create(normalizedWarehouse);

        setWarehouses(prev => [...prev, data]);
        setRefreshKey(prev => prev + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setModalOpen(false);
      }
    }
  };

  const formattedWarehouses = warehouses.map(formatWarehouse);

  const warehouseColumns = [
    { header: 'Warehouse name', accessor: 'name' },
    { header: 'Address', accessor: 'address' },
    { header: 'Contact number', accessor: 'contact_number' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <div className="actionsWrapper">
          <ActionButton
            variant="edit"
            onClick={() => handleEditWarehouse(row.warehouse_id)}
          >
            Edit
          </ActionButton>
          <ActionButton
            variant="delete"
            onClick={() => handleDeleteWarehouse(row.warehouse_id)}
          >
            Delete
          </ActionButton>
        </div>
      )
    }
  ];
  console.log(warehouses)

  console.log(selectedWarehouse)
  return (
    <div>
      <h1>Warehouse</h1>
      <div className='filters'>
        <div className="filter-group">
          <label htmlFor="name">Warehouse Name</label>
          <input
            id="name"
            name="name"
            onChange={handleFilterChange}
            placeholder="e.g. Central Warehouse"
            value={formState.name}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            onChange={handleFilterChange}
            placeholder="e.g. 123 Main St, City"
            value={formState.address}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            id="contactNumber"
            name="contactNumber"
            onChange={handleFilterChange}
            placeholder="e.g. +380123456789"
            value={formState.contactNumber}
          />
        </div>

        <div className="filter-section">
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>

      <button
        className="create-btn"
        onClick={() => {
          setSelectedWarehouse({
            name: '',
            contact_number: '',
            address: {
              country: '',
              city: '',
              street_name: '',
              building_number: '',
              apartment_number: ''
            }
          });
          setModalMode('create');
          setModalOpen(true);
        }}>
        Create Warehouse
      </button>

      <Table data={formattedWarehouses} columns={warehouseColumns} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {modalOpen && (
        <Modal open={modalOpen} onClose={handleModalClose} onOK={handleModalOK}>
          {modalMode === 'edit' || modalMode === 'create' ? (
            <WarehouseForm selectedWarehouse={selectedWarehouse} setSelectedWarehouse={setSelectedWarehouse} />
          ) : (
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this warehouse?</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default WarehousesPage;
