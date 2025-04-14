import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Table from '../components/Table'

const AdminPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/delivery')
      .then(response => setDeliveries(response.data))
      .catch(error => console.error('Error fetching deliveries:', error));
  }, []);

  const handleOpenModal = (delivery) => {
    setCurrentDelivery(delivery);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentDelivery(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDelivery(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios.put(`http://localhost:3000/deliveries/${currentDelivery.id}`, currentDelivery)
      .then(response => {
        setDeliveries(prev => prev.map(delivery =>
          delivery.id === currentDelivery.id ? response.data : delivery
        ));
        handleCloseModal();
      })
      .catch(error => console.error('Error updating delivery:', error));
  };

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
      <h1>Admin - Deliveries</h1>
      <Table data={formattedDeliveries} columns={deliveryColumns} />

    </div>
  );
};

export default AdminPage;
