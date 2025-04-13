import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import VehicleForm from "../components/VehicleForm";
import AddressForm from "../components/AddressForm";
import { useUser } from "../context/UserContext";
import Modal from "../components/Modal";
import LogoutButton from "../components/LogoutButton";
import Table from '../components/Table'
import { format } from 'date-fns';


const UserPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isCourier, setIsCourier] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [deliveries, setDeliveries] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    if (!user || !user?.sub) {
      console.error('User ID is not available.');
      return;
    }

    axios.get(`http://localhost:3000/user/${user?.sub}`)
      .then((response) => {
        const userData = response.data;
        setUserInfo(userData);

        const isCourier = userData.role === 'courier';
        setIsCourier(isCourier);

        if (isCourier && userData.Courier?.courier_id) {
          const courierId = userData.Courier.courier_id;

          axios.get(`http://localhost:3000/courier/${courierId}/deliveries`)
            .then(res => {
              setDeliveries(res.data);
            })
            .catch(err => console.error("Failed to fetch deliveries", err));
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [user]);

  const handleUserUpdate = (updatedData) => {
    axios.put(`http://localhost:3000/user/${user?.sub}`, updatedData)
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });
  };

  const handleEditClick = () => {
    if (isCourier) {
      setModalContent(
        <VehicleForm
          vehicle={userInfo.vehicle}
          onUpdate={handleUserUpdate}
        />
      );
    } else {
      setModalContent(
        <AddressForm
          address={userInfo.address}
          onUpdate={handleUserUpdate}
        />
      );
    }
    setIsModalOpen(true);
  };

  const displayValue = (value) => value || 'Not provided';

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy HH:mm:ss');
  };

  if (!userInfo) return <div>Loading...</div>;
  console.log(userInfo)

  const formattedDeliveries = deliveries.map(delivery => ({
    ...delivery,
    created_at: formatDate(delivery.created_at),
    updated_at: formatDate(delivery.updated_at),
    address: `Address ${delivery.address_id}`, // витягувати норм адресу тут
  }));

  const deliveryColumns = [
    { header: 'ID', accessor: 'delivery_id' },
    { header: 'Address', accessor: 'address' },
    { header: 'Status', accessor: 'delivery_status' },
    { header: 'Delivery Type', accessor: 'delivery_type' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Updated At', accessor: 'updated_at' },
    { header: 'Cost', accessor: 'delivery_cost' },
    { header: 'Payment Method', accessor: 'payment_method' },
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

        {isCourier && (
          <div>
            <h2>Your Deliveries</h2>
            <Table data={formattedDeliveries} columns={deliveryColumns} />
          </div>
        )}

      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} onOK={() => null} okText=" " closeText="Close">
        {modalContent}
      </Modal>
    </div>
  );
};

export default UserPage;
