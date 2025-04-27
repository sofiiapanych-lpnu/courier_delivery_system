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
        <>
          <button onClick={() => handleEditWarehouse(row.warehouse_id)}>Edit</button>
          <button onClick={() => handleDeleteWarehouse(row.warehouse_id)} style={{ marginLeft: '10px' }}>Delete</button>
        </>
      )
    }
  ];
  console.log(warehouses)

  console.log(selectedWarehouse)
  return (
    <div>
      <h1>Admin - Warehouse</h1>
      <div className='filters'>
        <input
          name="name"
          onChange={handleFilterChange}
          placeholder="Warehouse Name"
          value={formState.name}
        />
        <input
          name="address"
          onChange={handleFilterChange}
          placeholder="Address"
          value={formState.address}
        />
        <input
          name="contactNumber"
          onChange={handleFilterChange}
          placeholder="Contact number"
          value={formState.contactNumber}
        />
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>
      <button onClick={() => {
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
