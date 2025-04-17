import React, { useState } from 'react';
import { useDeliveries } from '../hooks/useDeliveries';
import { useFilters } from '../hooks/useFilters'
import { deliveryService } from '../api/deliveryServise';
import { warehouseService } from '../api/warehouseService'
import { addressService } from '../api/addressService';
import { clientService } from '../api/clientService'
import { courierService } from '../api/courierService'
import { orderService } from '../api/orderService'
import { formatDelivery } from '../utils/formatters';
import { normalizeOrderData, normalizeDeliveryData } from '../utils/dataNormalizers'
import Table from '../components/Table'
import Modal from '../components/Modal'
import DeliveryForm from '../components/forms/DeliveryForm';

const AdminPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const initialFormState = {
    deliveryStatus: '',
    deliveryType: '',
    orderTypeQuery: '',
    warehouseAddressQuery: '',
    clientAddressQuery: '',
    paymentMethod: '',
    startTime: '',
    endTime: '',
  };
  const {
    filters,
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(initialFormState, setPage);
  const { deliveries, setDeliveries, totalPages } = useDeliveries(filters, page, limit);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');

  const handleEditDelivery = (id) => {
    deliveryService.getById(id)
      .then(response => {
        setSelectedDelivery(response.data);
        setModalMode('edit');
        setModalOpen(true);
      })
      .catch(error => console.error('Error fetching deliveries:', error));
  };

  const handleDeleteDelivery = (deliveryId) => {
    setSelectedDelivery(deliveryId);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDelivery(null);
  };

  const handleModalOK = async () => {
    if (modalMode === 'edit') {
      const {
        delivery_id,
        warehouse,
        Address: deliveryAddress,
        order,
        Client: client,
        courier,
        ...cleanDelivery
      } = selectedDelivery;

      console.log('warehouse', warehouse, 'deliveryAddress', deliveryAddress, 'delivery_id', delivery_id, 'order', order, 'client', client, 'courier', courier)

      try {
        await addressService.update(warehouse.address.address_id, warehouse.address);

        await warehouseService.update(warehouse.warehouse_id, {
          name: warehouse.name,
          address_id: deliveryAddress.address_id
        })

        await addressService.update(deliveryAddress.address_id, deliveryAddress);

        if (order && order.order_id) {
          console.log('Updating order:', order);
          const normalizedOrder = normalizeOrderData(order);
          await orderService.update(order.order_id, normalizedOrder);

        }

        if (client && client.client_id) {
          await clientService.update(client.client_id, client);
        }

        if (courier && courier.courier_id) {
          await courierService.update(courier.courier_id, courier);
        }

        const deliveryPayload = {
          ...cleanDelivery,
          warehouse_id: warehouse.warehouse_id,
          address_id: Address?.address_id,
          client_id: client.client_id,
          courier_id: courier.courier_id,
          order_id: order.order_id,
        };

        const normalizedDelivery = normalizeDeliveryData(deliveryPayload);

        const { data } = await deliveryService.update(delivery_id, normalizedDelivery);

        setDeliveries(prev => prev.map(d => d.delivery_id === delivery_id ? data : d));
      } catch (err) {
        console.log(err);
      } finally {
        setModalOpen(false);
      }
    }

    if (modalMode === 'delete') {
      try {
        await deliveryService.delete(selectedDelivery);
        const remaining = deliveries.filter(d => d.delivery_id !== selectedDelivery);
        setDeliveries(remaining);
        if (deliveries.length === 1 && page > 1) {
          setPage(prev => prev - 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setModalOpen(false);
      }
    }
  };

  console.log(deliveries)
  const formattedDeliveries = deliveries.map(formatDelivery);

  const deliveryColumns = [
    { header: 'ID', accessor: 'delivery_id' },
    { header: 'Warehouse', accessor: 'warehouse' },
    { header: 'Address', accessor: 'address' },
    { header: 'Order Type', accessor: 'order' },
    { header: 'Start Time', accessor: 'start_time' },
    { header: 'End Time', accessor: 'end_time' },
    { header: 'Desired Duration', accessor: 'desired_duration' },
    { header: 'Status', accessor: 'delivery_status' },
    { header: 'Delivery Type', accessor: 'delivery_type' },
    { header: 'Cost', accessor: 'delivery_cost' },
    { header: 'Payment Method', accessor: 'payment_method' },
    { header: 'Client', accessor: 'client' },
    { header: 'Courier', accessor: 'courier' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Updated At', accessor: 'updated_at' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <>
          <button onClick={() => handleEditDelivery(row.delivery_id)}>Edit</button>
          <button onClick={() => handleDeleteDelivery(row.delivery_id)} style={{ marginLeft: '10px' }}>Delete</button>
        </>
      )
    }

  ];
  console.log('selectedDelivery', selectedDelivery)
  return (
    <div>
      <h1>Admin - Deliveries</h1>
      <div className='filters'>
        <select name="deliveryStatus" onChange={handleFilterChange} value={formState.deliveryStatus}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="delivered">Delivered</option>
        </select>
        <select name="deliveryType" onChange={handleFilterChange} value={formState.deliveryType}>
          <option value="">All Types</option>
          <option value="express">Express</option>
          <option value="standard">Standard</option>
          <option value="overnight">Overnight</option>
        </select>
        <input name="orderTypeQuery" onChange={handleFilterChange} placeholder="Order Type" value={formState.orderTypeQuery} />
        <input name="warehouseAddressQuery" onChange={handleFilterChange} placeholder="Warehouse Address" value={formState.warehouseAddressQuery} />
        <input name="clientAddressQuery" onChange={handleFilterChange} placeholder="Client Address" value={formState.clientAddressQuery} />
        <select name="paymentMethod" onChange={handleFilterChange} value={formState.paymentMethod}>
          <option value="">All Payment Methods</option>
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
          <option value="online">Online</option>
        </select>
        <input name="startTime" type="datetime-local" onChange={handleFilterChange} value={formState.startTime} />
        <input name="endTime" type="datetime-local" onChange={handleFilterChange} value={formState.endTime} />

        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      <Table data={formattedDeliveries} columns={deliveryColumns} />
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
            <DeliveryForm selectedDelivery={selectedDelivery} setSelectedDelivery={setSelectedDelivery} />
          ) : (
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this delivery?</p>
            </div>
          )
          }
        </Modal >
      )}
    </div >
  );
};

export default AdminPage;
