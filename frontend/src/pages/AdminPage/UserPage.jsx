import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useFilters } from '../../hooks/useFilters';
import { userService } from '../../api/userService';
import { formatUsers } from '../../utils/formatters';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import UserForm from '../../components/forms/UserForm';
import { addressService } from '../../api/addressService';
import { normalizeAddressData, normalizeUserData, normalizeVehicleData } from '../../utils/dataNormalizers';
import { clientService } from '../../api/clientService';
import { vehicleService } from '../../api/vehicleService';
import { courierService } from '../../api/courierService';

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [refreshKey, setRefreshKey] = useState(0);

  const initialFormState = {
    name: '',
    email: '',
    role: '',
    addressQuery: '',
    vehicleQuery: '',
    startCreatedAt: '',
    endCreatedAt: '',
    startUpdatedAt: '',
    endUpdatedAt: '',
  };

  const {
    filters,
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(initialFormState, setPage);

  const { data: users, setData: setUsers, totalPages } = useData(userService, filters, page, limit, refreshKey);
  const [selectedUser, setSelectedUser] = useState(null);
  const [originalLicensePlate, setOriginalLicensePlate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');

  const handleEditUser = (id) => {
    userService.getById(id)
      .then(response => {
        setSelectedUser(response.data);
        const vehicle = response.data?.Courier?.vehicle;
        if (vehicle?.license_plate && !vehicle?.is_company_owner) {
          setOriginalLicensePlate(vehicle.license_plate);
        }
        setModalMode('edit');
        setModalOpen(true);
      })
      .catch(error => console.error('Error fetching user:', error));
  };

  const handleDeleteUser = (userId) => {
    setSelectedUser(userId);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalOK = async () => {
    if (modalMode === 'edit') {
      try {
        if (selectedUser.role === "client") {
          const addressData = selectedUser.Client.address;
          if (addressData) {
            if (!addressData?.address_id) {
              const normalizedAddress = normalizeAddressData(addressData);

              const { data: createdAddress } = await addressService.create(normalizedAddress);

              await clientService.update(selectedUser.Client.client_id, {
                addressId: createdAddress.address_id,
              });

              const { data: updatedUser } = await userService.getById(selectedUser.user_id);
              setSelectedUser(updatedUser);
            } else if (addressData?.address_id) {
              const normalizedAddress = normalizeAddressData(addressData);

              await addressService.update(addressData.address_id, normalizedAddress);
            }
          }
        } else if (selectedUser.role === "courier") {
          const vehicleData = selectedUser.Courier.vehicle;
          console.log('vehicleData', vehicleData)
          if (vehicleData) {
            if (vehicleData?.is_company_owner) {
              const normalizedVehicle = normalizeVehicleData(vehicleData);
              console.log('selectedUser.Courier.courier_id', selectedUser.Courier.courier_id, normalizedVehicle.licensePlate)

              const { data } = await courierService.update(selectedUser.Courier.courier_id, {
                vehicle: {
                  licensePlate: normalizedVehicle.licensePlate
                }
              });
              console.log('data', data)

              const { data: updatedUser } = await userService.getById(selectedUser.user_id);
              setSelectedUser(updatedUser);
            } else {
              const normalizedVehicle = normalizeVehicleData(vehicleData);
              console.log('normalizedVehicle', normalizedVehicle)
              console.log('originalLicensePlate', originalLicensePlate)

              const { data } = await vehicleService.update(originalLicensePlate, normalizedVehicle);
              console.log('vdata', data)
              await courierService.update(selectedUser.Courier.courier_id, {
                vehicle: {
                  normalizedVehicle
                }
              });
            }
          }
        }
        const normalizedUser = normalizeUserData(selectedUser);

        await userService.update(normalizedUser.userId, normalizedUser);

        const { data: finalUpdatedUser } = await userService.getById(selectedUser.user_id);
        setSelectedUser(finalUpdatedUser);
        setUsers(prev => prev.map(u => u.user_id === finalUpdatedUser.user_id ? finalUpdatedUser : u));
      } catch (err) {
        console.error(err);
      } finally {
        setModalOpen(false);
      }
    }

    if (modalMode === 'delete') {
      try {
        await userService.delete(selectedUser);
        const { data: updatedUsers } = await userService.getAll(filters, page, limit);
        setUsers(updatedUsers.items);

        if (updatedUsers.length === 0 && page > 1) {
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
  };

  //console.log('users', users)

  const formatedUsers = users.map(formatUsers);

  const userColumns = [
    { header: 'Full Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone Number', accessor: 'phone_number' },
    { header: 'Role', accessor: 'role' },
    { header: 'Address', accessor: 'address' },
    { header: 'Vehicle', accessor: 'vehicle' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Updated At', accessor: 'updated_at' },
    {
      header: 'Actions', accessor: 'actions', cell: ({ row }) => (
        <>
          <button onClick={() => handleEditUser(row.user_id)}>Edit</button>
          <button onClick={() => handleDeleteUser(row.user_id)} style={{ marginLeft: '10px' }}>Delete</button>
        </>
      )
    }
  ];
  //console.log('selectedUser ___', selectedUser)

  return (
    <div>
      <h1>Admin - Users</h1>
      <div className='filters'>
        <input
          name="name"
          onChange={handleFilterChange}
          placeholder="User Name"
          value={formState.name}
        />
        <input
          name="email"
          onChange={handleFilterChange}
          placeholder="Email"
          value={formState.email}
        />
        <select
          name="role"
          onChange={handleFilterChange}
          value={formState.role}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="courier">Courier</option>
          <option value="client">Client</option>
        </select>

        <input
          name="addressQuery"
          onChange={handleFilterChange}
          placeholder="Address"
          value={formState.addressQuery}
        />

        <input
          name="vehicleQuery"
          onChange={handleFilterChange}
          placeholder="Vehicle License Plate"
          value={formState.vehicleQuery}
        />

        <input
          name="startCreatedAt"
          type="datetime-local"
          onChange={handleFilterChange}
          value={formState.startCreatedAt}
        />
        <input
          name="endCreatedAt"
          type="datetime-local"
          onChange={handleFilterChange}
          value={formState.endCreatedAt}
        />

        <input
          name="startUpdatedAt"
          type="datetime-local"
          onChange={handleFilterChange}
          value={formState.startUpdatedAt}
        />
        <input
          name="endUpdatedAt"
          type="datetime-local"
          onChange={handleFilterChange}
          value={formState.endUpdatedAt}
        />

        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      <Table data={formatedUsers} columns={userColumns} />
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
          {modalMode === 'edit' ? (
            <UserForm selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          ) : (
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this user?</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
