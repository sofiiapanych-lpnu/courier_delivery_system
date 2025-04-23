import React, { useState, useEffect } from "react";
import UserForm from "../components/forms/UserForm";
import { useUser } from "../context/UserContext";
import Modal from "../components/Modal";
import LogoutButton from "../components/LogoutButton";
import Table from '../components/Table'
import { formatDelivery } from "../utils/formatters";
import { userService } from '../api/userService'
import { courierService } from "../api/courierService";
import { clientService } from "../api/clientService";
import { normalizeAddressData, normalizeUserData, normalizeVehicleData } from "../utils/dataNormalizers";

const UserProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isCourier, setIsCourier] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [editDraft, setEditDraft] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user?.sub) {
      console.error('User ID is not available.');
      return;
    }

    userService.getById(user?.sub)
      .then((response) => {
        const userData = response.data;
        setUserInfo(userData);

        const isCourier = userData.role === 'courier';
        setIsCourier(isCourier);

        if (isCourier && userData.Courier?.courier_id) {
          const courierId = userData.Courier.courier_id;
          courierService.getDeliveries(courierId)
            .then(res => {
              setDeliveries(res.data);
            })
            .catch(err => console.error("Failed to fetch deliveries", err));
        } else if (userData.role === 'client' && userData.Client?.client_id) {
          const clientId = userData.Client.client_id;
          clientService.getDeliveries(clientId)
            .then(res => setDeliveries(res.data))
            .catch(err => console.error("Failed to fetch client deliveries", err));
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [user]);

  const handleUserUpdate = () => {
    const normalizedUser = normalizeUserData(editDraft)

    userService.update(user?.sub, normalizedUser)
      .then(response => {
        setUserInfo(response.data);
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });

    if (isCourier) {
      const courierId = userInfo?.Courier?.courier_id;
      if (!courierId) return;

      const normalizedVehicle = normalizeVehicleData(editDraft.Courier.vehicle);

      courierService.update(courierId, {
        vehicle: normalizedVehicle
      })
        .then(response => {
          console.log('Response from backend:', response.data);
          setUserInfo(prev => ({
            ...prev,
            Courier: {
              ...prev.Courier,
              vehicle: response.data.vehicle,
            },
          }));
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error('Error updating courier data:', error);
        });
    } else {
      const clientId = userInfo.Client?.client_id;
      if (!clientId) return;

      const normalizedAddress = normalizeAddressData(editDraft.Client.address)

      clientService.updateAddress(clientId, normalizedAddress)
        .then(response => {
          setUserInfo(prev => ({
            ...prev,
            Client: {
              ...prev.Client,
              address: response.data,
            },
          }));
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error('Error updating client address:', error);
        });
    }
  };

  const handleEditClick = () => {
    setEditDraft(JSON.parse(JSON.stringify(userInfo)));
    setIsModalOpen(true);
  };

  const displayValue = (value) => value || 'Not provided';


  if (!userInfo) return <div>Loading...</div>;

  const formattedDeliveries = deliveries.map(formatDelivery);

  const deliveryColumns = [
    { header: 'Warehouse', accessor: 'warehouse' },
    { header: 'Address', accessor: 'address' },
    { header: 'Order Type', accessor: 'order' },
    { header: 'Start Time', accessor: 'start_time' },
    { header: 'End Time', accessor: 'end_time' },
    { header: 'Status', accessor: 'delivery_status' },
    { header: 'Delivery Type', accessor: 'delivery_type' },
    { header: 'Cost', accessor: 'delivery_cost' },
    { header: 'Payment Method', accessor: 'payment_method' },
    { header: isCourier ? 'Client' : 'Courier', accessor: isCourier ? 'client' : 'courier' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Updated At', accessor: 'updated_at' },
  ];

  return (
    <div>
      <LogoutButton></LogoutButton>
      <h1>User Profile</h1>
      <div>
        <h2>Basic Info</h2>
        <div>Email: {userInfo.email}</div>
        <div>First Name: {userInfo.first_name}</div>
        <div>Last Name: {userInfo.last_name}</div>
        <div>Phone Number: {userInfo.phone_number}</div>
      </div>

      <div>
        <h2>{isCourier ? "Vehicle Info" : "Address Info"}</h2>
        {isCourier ? (
          <>
            <div>License Plate: {userInfo.Courier?.vehicle.license_plate}</div>
            <div>Model: {userInfo.Courier?.vehicle.model}</div>
            <div>Transport Type: {userInfo.Courier?.vehicle.transport_type}</div>
            <div>Company Owned: {userInfo.Courier?.vehicle.is_company_owner ? "Yes" : "No"}</div>
          </>
        ) : (
          <>
            <div>Country: {displayValue(userInfo.Client?.address?.country)}</div>
            <div>City: {displayValue(userInfo.Client?.address?.city)}</div>
            <div>Street: {displayValue(userInfo.Client?.address?.street_name)}</div>
            <div>Building: {displayValue(userInfo.Client?.address?.building_number)}</div>
            <div>Apartment: {displayValue(userInfo.Client?.address?.apartment_number)}</div>
          </>

        )}
        <button onClick={handleEditClick}>Edit</button>

        <div>
          <h2>Your Deliveries</h2>
          <Table data={formattedDeliveries} columns={deliveryColumns} />
        </div>

      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} onOK={handleUserUpdate}>
        <UserForm selectedUser={editDraft} setSelectedUser={setEditDraft} />
      </Modal>
    </div>
  );
};

export default UserProfilePage;
