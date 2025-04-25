import React, { useEffect, useState } from 'react';
import Table from './Table';
import { useFilters } from '../hooks/useFilters';
import { courierService } from '../api/courierService';
import { clientService } from '../api/clientService';
import { formatDelivery } from '../utils/formatters';

const UserDeliveriesSection = ({ userInfo, isCourier }) => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [deliveries, setDeliveries] = useState([]);

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
      <h2>Your Deliveries</h2>

      <div className="filters">
        <h2>Filters</h2>
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
        <select name="paymentMethod" onChange={handleFilterChange} value={formState.paymentMethod}>
          <option value="">All Payment Methods</option>
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
          <option value="online">Online</option>
        </select>
        <input name="startTime" type="datetime-local" onChange={handleFilterChange} value={formState.startTime} />
        <input name="endTime" type="datetime-local" onChange={handleFilterChange} value={formState.endTime} />
        <input name="warehouseAddressQuery" value={formState.warehouseAddressQuery} onChange={handleFilterChange} placeholder="Warehouse Address" />
        <input name="clientAddressQuery" value={formState.clientAddressQuery} onChange={handleFilterChange} placeholder="Client Address" />
        <input name="orderTypeQuery" value={formState.orderTypeQuery} onChange={handleFilterChange} placeholder="Order Type" />
        {isCourier ? (
          <input name="clientNameQuery" value={formState.clientNameQuery} onChange={handleFilterChange} placeholder="Client Name" />
        ) : (
          <input name="courierNameQuery" value={formState.courierNameQuery} onChange={handleFilterChange} placeholder="Courier Name" />
        )}
        <input name="minCost" value={formState.minCost} onChange={handleFilterChange} placeholder="Min Cost" />
        <input name="maxCost" value={formState.maxCost} onChange={handleFilterChange} placeholder="Max Cost" />
        <button onClick={handleClearFilters}>Clear</button>
      </div>

      <Table data={formattedDeliveries} columns={deliveryColumns} />
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Prev</button>
        <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default UserDeliveriesSection;
