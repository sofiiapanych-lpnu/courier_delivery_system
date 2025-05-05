import React, { useEffect, useState } from 'react';
import Table from './Table';
import { useFilters } from '../hooks/useFilters';
import { courierService } from '../api/courierService';
import { clientService } from '../api/clientService';
import { formatDelivery } from '../utils/formatters';
import { deliveryService } from '../api/deliveryService';
import Modal from '../components/Modal'
import { normalizeDeliveryData } from '../utils/dataNormalizers';
import Pagination from '../components/Pagination'
import { useUserProfile } from '../context/UserProfileContext'
import './UserDeliveriesSection.module.css'

const UserDeliveriesSection = () => {
  const { userInfo, isCourier } = useUserProfile();
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const deliveryFiltersInitial = {
    deliveryStatus: "",
    deliveryType: "",
    deliveryCost: "",
    paymentMethod: "",
    startTime: "",
    endTime: "",
    warehouseAddressQuery: "",
    clientAddressQuery: "",
    orderTypeQuery: "",
    clientNameQuery: "",
    courierNameQuery: "",
    minCost: "",
    maxCost: ""
  };

  const { filters, formState, handleFilterChange, handleClearFilters } = useFilters(deliveryFiltersInitial, setPage);

  useEffect(() => {
    if (userInfo) fetchDeliveries();
  }, [userInfo, formState, page]);

  const fetchDeliveries = () => {
    if (!userInfo) return;

    const fetchFn = isCourier ? courierService.getDeliveries : clientService.getDeliveries;
    const id = isCourier ? userInfo.Courier?.courier_id : userInfo.Client?.client_id;
    if (!id) return;

    fetchFn(id, { ...formState, page, limit })
      .then(res => {
        setDeliveries(res.data.items)
        setTotalPages(res.data.meta.totalPages)
      })
      .catch(err => console.error("Failed to fetch deliveries", err));
  };

  const handleEditTimes = (delivery) => {
    console.log(delivery)
    setSelectedDelivery(delivery);
    setModalOpen(true);
  };

  const handleSaveTimes = async () => {
    try {
      console.log('selectedDelivery', selectedDelivery)
      const normalizedDelivery = normalizeDeliveryData(selectedDelivery)
      console.log('normalizedDelivery', normalizedDelivery)

      await deliveryService.update(selectedDelivery.delivery_id, normalizedDelivery);
      fetchDeliveries();
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
    }
  };

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

  if (isCourier) {
    deliveryColumns.push({
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <button onClick={() => handleEditTimes(row)}>Edit Times</button>
      )
    });
  }

  const formatDateTimeForInput = (dateString) => {
    if (!dateString || dateString === 'Not available') return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toISOString().slice(0, 16);
  };

  return (
    <div>
      <h2>Your Deliveries</h2>

      <div className="filters">
        <div className="filter-section">
          <div className="filter-group">
            <label>Status</label>
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

          <div className="filter-group">
            <label>Payment</label>
            <select name="paymentMethod" onChange={handleFilterChange} value={formState.paymentMethod}>
              <option value="">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="online">Online</option>
            </select>
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
          <div className="filter-group">
            <label>Warehouse Address</label>
            <input name="warehouseAddressQuery" value={formState.warehouseAddressQuery} onChange={handleFilterChange} placeholder="Warehouse Address" />
          </div>

          <div className="filter-group">
            <label>Client Address</label>
            <input name="clientAddressQuery" value={formState.clientAddressQuery} onChange={handleFilterChange} placeholder="Client Address" />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Order Type</label>
            <input name="orderTypeQuery" value={formState.orderTypeQuery} onChange={handleFilterChange} placeholder="Order Type" />
          </div>
        </div>


        {isCourier ? (
          <div className="filter-group">
            <label>Client Name</label>
            <input name="clientNameQuery" value={formState.clientNameQuery} onChange={handleFilterChange} placeholder="Client Name" />
          </div>
        ) : (
          <div className="filter-group">
            <label>Courier Name</label>
            <input name="courierNameQuery" value={formState.courierNameQuery} onChange={handleFilterChange} placeholder="Courier Name" />
          </div>
        )}

        <div className="filter-section">
          <div className="filter-group">
            <label>Min Cost</label>
            <input name="minCost" value={formState.minCost} onChange={handleFilterChange} placeholder="Min Cost" />
          </div>

          <div className="filter-group">
            <label>Max Cost</label>
            <input name="maxCost" value={formState.maxCost} onChange={handleFilterChange} placeholder="Max Cost" />
          </div>
        </div>

        <button onClick={handleClearFilters}>Clear</button>
      </div>


      <Table data={formattedDeliveries} columns={deliveryColumns} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} onOK={handleSaveTimes}>
          <h3>Edit Delivery Times</h3>
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={formatDateTimeForInput(selectedDelivery.start_time)}
            onChange={(e) =>
              setSelectedDelivery({ ...selectedDelivery, start_time: e.target.value })
            }
          />
          <label>End Time</label>
          <input
            type="datetime-local"
            value={formatDateTimeForInput(selectedDelivery.end_time)}
            onChange={(e) =>
              setSelectedDelivery({ ...selectedDelivery, end_time: e.target.value })
            }
          />
        </Modal>
      )}

    </div>
  );
};

export default UserDeliveriesSection;
