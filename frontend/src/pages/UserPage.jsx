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
        } else if (userData.role === 'client' && userData.Client?.client_id) {
          const clientId = userData.Client.client_id;

          axios.get(`http://localhost:3000/client/${clientId}/deliveries`)
            .then(res => setDeliveries(res.data))
            .catch(err => console.error("Failed to fetch client deliveries", err));
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [user]);

  const handleUserUpdate = (updatedData) => {
    if (isCourier) {
      const courierId = userInfo?.Courier?.courier_id;
      if (!courierId) return;

      const cleanedData = {
        vehicle: {
          licensePlate: updatedData.license_plate,
          model: updatedData.model,
          transportType: updatedData.transport_type,
          isCompanyOwner: Boolean(updatedData.owned_by_company),
        },
      };

      console.log('cleanedData', cleanedData)

      axios.put(`http://localhost:3000/courier/${courierId}`, cleanedData)
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

      const cleanedData = {
        country: updatedData.country,
        city: updatedData.city,
        streetName: updatedData.street_name,
        buildingNumber: Number(updatedData.building_number),
        apartmentNumber: updatedData.apartment_number
          ? Number(updatedData.apartment_number)
          : null,
      };


      axios.put(`http://localhost:3000/client/${clientId}/address`, cleanedData)
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
    if (isCourier) {
      const vehicle = userInfo.Courier?.vehicle || {};
      setModalContent(
        <VehicleForm
          vehicle={vehicle}
          onUpdate={handleUserUpdate}
        />
      );
    } else {
      const address = userInfo.Client?.address || {};
      setModalContent(
        <AddressForm
          address={address}
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

  const formatAddress = (address) => {
    if (!address) return 'No address';
    const { street_name, building_number, apartment_number, city } = address;

    const base = `${street_name} ${building_number}`;
    const apartment = apartment_number ? `, Apt. ${apartment_number}` : '';

    return `${base}${apartment}, ${city}`;
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };


  if (!userInfo) return <div>Loading...</div>;
  console.log(userInfo)
  console.log(deliveries)

  const formattedDeliveries = deliveries.map(delivery => ({
    ...delivery,
    created_at: formatDate(delivery.created_at),
    updated_at: formatDate(delivery.updated_at),
    address: formatAddress(delivery.Address),
    warehouse: <>
      <b>{delivery.warehouse.name}</b><br />
      {formatAddress(delivery.warehouse.address)}
    </>,
    delivery_status: formatStatus(delivery.delivery_status),
    order: delivery.order.order_type,
  }));

  const deliveryColumns = [
    { header: 'ID', accessor: 'delivery_id' },
    { header: 'Warehouse', accessor: 'warehouse' },
    { header: 'Address', accessor: 'address' },
    { header: 'Order Type', accessor: 'order' },
    { header: 'Status', accessor: 'delivery_status' },
    { header: 'Delivery Type', accessor: 'delivery_type' },
    { header: 'Cost', accessor: 'delivery_cost' },
    { header: 'Payment Method', accessor: 'payment_method' },
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

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} onOK={() => null} okText=" " closeText="Close">
        {modalContent}
      </Modal>
    </div>
  );
};

export default UserPage;
