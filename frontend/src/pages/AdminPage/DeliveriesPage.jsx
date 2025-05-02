import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useFilters } from '../../hooks/useFilters'
import { deliveryService } from '../../api/deliveryService';
import { warehouseService } from '../../api/warehouseService'
import { addressService } from '../../api/addressService';
import { orderService } from '../../api/orderService'
import { userService } from '../../api/userService'
import { formatDelivery } from '../../utils/formatters';
import { normalizeOrderData, normalizeDeliveryData, normalizeWarehouseData, normalizeAddressData, normalizeUserData } from '../../utils/dataNormalizers'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import DeliveryForm from '../../components/forms/DeliveryForm';
import Pagination from '../../components/Pagination'
import ActionButton from '../../components/ActionButton'
import './filters.css';

const DeliveriesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [refreshKey, setRefreshKey] = useState(0);

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
  const { data: deliveries, setData: setDeliveries, totalPages } = useData(deliveryService, filters, page, limit, refreshKey);
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

      try {
        const normalizedWarehouseAddress = normalizeAddressData(warehouse.address);
        await addressService.update(warehouse.address.address_id, normalizedWarehouseAddress);

        const normalizedWarehouse = normalizeWarehouseData(warehouse);
        await warehouseService.update(warehouse.warehouse_id, normalizedWarehouse)

        const normalizedDeliveryAddress = normalizeAddressData(deliveryAddress);
        await addressService.update(deliveryAddress.address_id, normalizedDeliveryAddress);

        if (order && order.order_id) {
          const normalizedOrder = normalizeOrderData(order);
          await orderService.update(order.order_id, normalizedOrder);
        }

        if (client && client.client_id) {
          const normalizedClient = normalizeUserData(client.user);
          //await clientService.update(client.client_id, client);
          await userService.update(normalizedClient.userId, normalizedClient)
        } else {
          console.log('client is deleted') //якось норм обробити
        }

        if (courier && courier.courier_id) {
          const normalizedCourier = normalizeUserData(courier.user);
          await userService.update(normalizedCourier.userId, normalizedCourier);
        }

        const deliveryPayload = {
          ...cleanDelivery,
          warehouse_id: warehouse?.warehouse_id,
          address_id: deliveryAddress?.address_id,
          client_id: client?.client_id,
          courier_id: courier?.courier_id,
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

  const formattedDeliveries = deliveries.map(formatDelivery);

  const deliveryColumns = [
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
        <div className="actionsWrapper">
          <ActionButton
            variant="edit"
            onClick={() => handleEditDelivery(row.delivery_id)}
          >
            Edit
          </ActionButton>
          <ActionButton
            variant="delete"
            onClick={() => handleDeleteDelivery(row.delivery_id)}
          >
            Delete
          </ActionButton>
        </div>
      )
    }
  ];
  return (
    <div>
      <h1>Deliveries</h1>
      <div className="filters">

        <div className="filter-section">
          <div className="filter-group">
            <label>Delivery Status</label>
            <select name="deliveryStatus" onChange={handleFilterChange} value={formState.deliveryStatus}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Delivery Type</label>
            <select name="deliveryType" onChange={handleFilterChange} value={formState.deliveryType}>
              <option value="">All Types</option>
              <option value="express">Express</option>
              <option value="standard">Standard</option>
              <option value="overnight">Overnight</option>
            </select>
          </div>
        </div>

        <div className='filter-section'>
          <div className="filter-group">
            <label>Payment Method</label>
            <select name="paymentMethod" onChange={handleFilterChange} value={formState.paymentMethod}>
              <option value="">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Order Type</label>
            <input
              name="orderTypeQuery"
              onChange={handleFilterChange}
              placeholder="e.g. Furniture, Electronics"
              value={formState.orderTypeQuery}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Warehouse Address</label>
            <input
              name="warehouseAddressQuery"
              onChange={handleFilterChange}
              placeholder="e.g. 123 Main St, New York"
              value={formState.warehouseAddressQuery}
            />
          </div>

          <div className="filter-group">
            <label>Client Address</label>
            <input
              name="clientAddressQuery"
              onChange={handleFilterChange}
              placeholder="e.g. 456 Oak Ave, Boston"
              value={formState.clientAddressQuery}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Start Time</label>
            <input name="startTime" type="datetime-local" onChange={handleFilterChange} value={formState.startTime} />
          </div>

          <div className="filter-group">
            <label>End Time</label>
            <input name="endTime" type="datetime-local" onChange={handleFilterChange} value={formState.endTime} />
          </div>
        </div>

        <div className="filter-section">
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>

      <Table data={formattedDeliveries} columns={deliveryColumns} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

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

export default DeliveriesPage;
