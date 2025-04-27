import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useFilters } from '../../hooks/useFilters';
import { orderService } from '../../api/orderService';
import { clientService } from '../../api/clientService';
import { formatOrder } from '../../utils/formatters';
import { normalizeOrderData } from '../../utils/dataNormalizers';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import OrderForm from '../../components/forms/OrderForm';
import { Slider, Box } from '@mui/material';

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const initialFormState = {
    orderType: '',
    description: '',
    minCost: 0,
    maxCost: 50000,
    minWeight: 0,
    maxWeight: 1000,
    minHeight: 0,
    maxHeight: 1000,
    minLength: 0,
    maxLength: 1000,
    minWidth: 0,
    maxWidth: 1000,
    paymentMethod: '',
    startCreatedAt: '',
    endCreatedAt: '',
    startUpdatedAt: '',
    endUpdatedAt: '',
  };
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    filters,
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(initialFormState, setPage);

  const { data: orders, setData: setOrders, totalPages } = useData(orderService, filters, page, limit, refreshKey);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');

  const handleEditOrder = (id) => {
    orderService.getById(id)
      .then(response => {
        setSelectedOrder(response.data);
        setModalMode('edit');
        setModalOpen(true);
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  const handleDeleteOrder = (orderId) => {
    setSelectedOrder(orderId);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleModalOK = async () => {
    if (modalMode === 'edit') {
      try {
        console.log('selectedOrder', selectedOrder)
        const normalizedOrder = normalizeOrderData(selectedOrder);
        console.log('normalizedOrder', normalizedOrder)

        const { data } = await orderService.update(selectedOrder.order_id, normalizedOrder);

        setOrders(prev => prev.map(o => o.order_id === selectedOrder.order_id ? data : o));
      } catch (err) {
        console.log(err);
      } finally {
        setModalOpen(false);
      }
    }

    if (modalMode === 'delete') {
      try {
        await orderService.delete(selectedOrder);
        const remaining = orders.filter(o => o.order_id !== selectedOrder);
        setOrders(remaining);
        if (orders.length === 1 && page > 1) {
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

  const handleSliderChange = (name, newValue) => {
    handleFilterChange({
      target: {
        name: `min${name}`,
        value: newValue[0],
      },
    });
    handleFilterChange({
      target: {
        name: `max${name}`,
        value: newValue[1],
      },
    });
  };

  console.log(orders)
  const formattedOrders = orders.map(formatOrder);

  const orderColumns = [
    { header: 'Order Type', accessor: 'order_type' },
    { header: 'Order Description', accessor: 'description' },
    { header: 'Cost', accessor: 'cost' },
    { header: 'Weight', accessor: 'weight' },
    { header: 'Height', accessor: 'height' },
    { header: 'Length', accessor: 'length' },
    { header: 'Width', accessor: 'width' },
    { header: 'Payment Method', accessor: 'payment_method' },
    { header: 'Created At', accessor: 'created_at' },
    { header: 'Updated At', accessor: 'updated_at' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <>
          <button onClick={() => handleEditOrder(row.order_id)}>Edit</button>
          <button onClick={() => handleDeleteOrder(row.order_id)} style={{ marginLeft: '10px' }}>Delete</button>
        </>
      )
    }
  ];

  return (
    <div>
      <h1>Admin - Orders</h1>
      <div className='filters'>
        <input
          name="orderType"
          onChange={handleFilterChange}
          placeholder="Order Type"
          value={formState.orderType}
        />
        <input
          name="description"
          onChange={handleFilterChange}
          placeholder="Description"
          value={formState.description}
        />

        <Box sx={{ width: 50, marginTop: 2 }}>
          <label>Cost Range</label>
          <Slider
            value={[formState.minCost, formState.maxCost]}
            onChange={(e, newValue) => handleSliderChange('Cost', newValue)}
            valueLabelDisplay="auto"
            min={initialFormState.minCost}
            max={initialFormState.maxCost}
            sx={{
              '& .MuiSlider-thumb': {
                width: 13,
                height: 13,
                backgroundColor: 'primary.main',
              }
            }}
          />
        </Box>

        <Box sx={{ width: 50, marginTop: 2 }}>
          <label>Weight Range</label>
          <Slider
            value={[formState.minWeight, formState.maxWeight]}
            onChange={(e, newValue) => handleSliderChange('Weight', newValue)}
            valueLabelDisplay="auto"
            min={initialFormState.minWeight}
            max={initialFormState.maxWeight}
            sx={{
              '& .MuiSlider-thumb': {
                width: 13,
                height: 13,
                backgroundColor: 'primary.main',
              }
            }}
          />
        </Box>

        <Box sx={{ width: 50, marginTop: 2 }}>
          <label>Height Range</label>
          <Slider
            value={[formState.minHeight, formState.maxHeight]}
            onChange={(e, newValue) => handleSliderChange('Height', newValue)}
            valueLabelDisplay="auto"
            min={initialFormState.minHeight}
            max={initialFormState.maxHeight}
            sx={{
              '& .MuiSlider-thumb': {
                width: 13,
                height: 13,
                backgroundColor: 'primary.main',
              }
            }}
          />
        </Box>

        <Box sx={{ width: 50, marginTop: 2 }}>
          <label>Length Range</label>
          <Slider
            value={[formState.minLength, formState.maxLength]}
            onChange={(e, newValue) => handleSliderChange('Length', newValue)}
            valueLabelDisplay="auto"
            min={initialFormState.minLength}
            max={initialFormState.maxLength}
            sx={{
              '& .MuiSlider-thumb': {
                width: 13,
                height: 13,
                backgroundColor: 'primary.main',
              }
            }}
          />
        </Box>

        <Box sx={{ width: 50, marginTop: 2 }}>
          <label>Width Range</label>
          <Slider
            value={[formState.minWidth, formState.maxWidth]}
            onChange={(e, newValue) => handleSliderChange('Width', newValue)}
            valueLabelDisplay="auto"
            min={initialFormState.minWidth}
            max={initialFormState.maxWidth}
            sx={{
              '& .MuiSlider-thumb': {
                width: 13,
                height: 13,
                backgroundColor: 'primary.main',
              }
            }}
          />
        </Box>

        <select
          name="paymentMethod"
          onChange={handleFilterChange}
          value={formState.paymentMethod}
        >
          <option value="">All Payment Methods</option>
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
          <option value="online">Online</option>
        </select>

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

      <Table data={formattedOrders} columns={orderColumns} />
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
            <OrderForm selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
          ) : (
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this order?</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default OrdersPage;
