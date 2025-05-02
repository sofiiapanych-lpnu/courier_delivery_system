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
import Pagination from '../../components/Pagination'
import ActionButton from '../../components/ActionButton'
import './filters.css';

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
        const normalizedOrder = normalizeOrderData(selectedOrder);

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

  const handleInputChange = (name, value) => {
    handleFilterChange({
      target: {
        name,
        value: Number(value),
      },
    });
  };

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
        <div className="actionsWrapper">
          <ActionButton
            variant="edit"
            onClick={() => handleEditOrder(row.order_id)}
          >
            Edit
          </ActionButton>
          <ActionButton
            variant="delete"
            onClick={() => handleDeleteOrder(row.order_id)}
          >
            Delete
          </ActionButton>
        </div>
      )
    }
  ];

  return (
    <div>
      <h1>Orders</h1>
      <div className="filters">
        <div className="filter-section">
          <div className="filter-group">
            <label>Order Type</label>
            <input
              name="orderType"
              onChange={handleFilterChange}
              placeholder="e.g. Electronics, Furniture"
              value={formState.orderType}
            />
          </div>

          <div className="filter-group">
            <label>Description</label>
            <input
              name="description"
              onChange={handleFilterChange}
              placeholder="e.g. Fragile items, Large package"
              value={formState.description}
            />
          </div>

          <div className="filter-group">
            <label>Payment Method</label>
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
          </div>
        </div>

        <div className='filter-section'>
          <div className="filter-group">
            <label>Cost Range</label>
            <div className="slider-input-container">
              <input
                type="number"
                value={formState.minCost}
                onChange={(e) => handleInputChange('minCost', e.target.value)}
                placeholder="Min"
              />
              <Box sx={{ width: 100, marginTop: 2 }}>
                <Slider
                  value={[formState.minCost, formState.maxCost]}
                  onChange={(e, newValue) => handleSliderChange('Cost', newValue)}
                  valueLabelDisplay="auto"
                  min={initialFormState.minCost}
                  max={initialFormState.maxCost}
                  sx={{
                    flex: 1,
                    '& .MuiSlider-thumb': {
                      width: 13,
                      height: 13,
                      backgroundColor: 'primary.main',
                    }
                  }}
                />
              </Box>
              <input
                type="number"
                value={formState.maxCost}
                onChange={(e) => handleInputChange('maxCost', e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Weight Range</label>
            <div className="slider-input-container">
              <input
                type="number"
                value={formState.minWeight}
                onChange={(e) => handleInputChange('minWeight', e.target.value)}
                placeholder="Min"
              />
              <Slider
                value={[formState.minWeight, formState.maxWeight]}
                onChange={(e, newValue) => handleSliderChange('Weight', newValue)}
                valueLabelDisplay="auto"
                min={initialFormState.minWeight}
                max={initialFormState.maxWeight}
                sx={{
                  flex: 1,
                  '& .MuiSlider-thumb': {
                    width: 13,
                    height: 13,
                    backgroundColor: 'primary.main',
                  }
                }}
              />
              <input
                type="number"
                value={formState.maxWeight}
                onChange={(e) => handleInputChange('maxWeight', e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Height Range</label>
            <div className="slider-input-container">
              <input
                type="number"
                value={formState.minHeight}
                onChange={(e) => handleInputChange('minHeight', e.target.value)}
                placeholder="Min"
              />
              <Box sx={{ width: 100, marginTop: 2 }}>
                <Slider
                  value={[formState.minHeight, formState.maxHeight]}
                  onChange={(e, newValue) => handleSliderChange('Height', newValue)}
                  valueLabelDisplay="auto"
                  min={initialFormState.minHeight}
                  max={initialFormState.maxHeight}
                  sx={{
                    flex: 1,
                    '& .MuiSlider-thumb': {
                      width: 13,
                      height: 13,
                      backgroundColor: 'primary.main',
                    }
                  }}
                />
              </Box>
              <input
                type="number"
                value={formState.maxHeight}
                onChange={(e) => handleInputChange('maxHeight', e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Length Range</label>
            <div className="slider-input-container">
              <input
                type="number"
                value={formState.minLength}
                onChange={(e) => handleInputChange('minLength', e.target.value)}
                placeholder="Min"
              />
              <Slider
                value={[formState.minLength, formState.maxLength]}
                onChange={(e, newValue) => handleSliderChange('Length', newValue)}
                valueLabelDisplay="auto"
                min={initialFormState.minLength}
                max={initialFormState.maxLength}
                sx={{
                  flex: 1,
                  '& .MuiSlider-thumb': {
                    width: 13,
                    height: 13,
                    backgroundColor: 'primary.main',
                  }
                }}
              />
              <input
                type="number"
                value={formState.maxLength}
                onChange={(e) => handleInputChange('maxLength', e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Width Range</label>
            <div className="slider-input-container">
              <input
                type="number"
                value={formState.minWidth}
                onChange={(e) => handleInputChange('minWidth', e.target.value)}
                placeholder="Min"
              />
              <Slider
                value={[formState.minWidth, formState.maxWidth]}
                onChange={(e, newValue) => handleSliderChange('Width', newValue)}
                valueLabelDisplay="auto"
                min={initialFormState.minWidth}
                max={initialFormState.maxWidth}
                sx={{
                  flex: 1,
                  '& .MuiSlider-thumb': {
                    width: 13,
                    height: 13,
                    backgroundColor: 'primary.main',
                  }
                }}
              />
              <input
                type="number"
                value={formState.maxWidth}
                onChange={(e) => handleInputChange('maxWidth', e.target.value)}
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Created At (Start)</label>
            <input
              name="startCreatedAt"
              type="datetime-local"
              onChange={handleFilterChange}
              value={formState.startCreatedAt}
            />
          </div>
          <div className="filter-group">
            <label>Created At (End)</label>
            <input
              name="endCreatedAt"
              type="datetime-local"
              onChange={handleFilterChange}
              value={formState.endCreatedAt}
            />
          </div>
        </div>
        <div className="filter-section">
          <div className="filter-group">
            <label>Updated At (Start)</label>
            <input
              name="startUpdatedAt"
              type="datetime-local"
              onChange={handleFilterChange}
              value={formState.startUpdatedAt}
            />
          </div>
          <div className="filter-group">
            <label>Updated At (End)</label>
            <input
              name="endUpdatedAt"
              type="datetime-local"
              onChange={handleFilterChange}
              value={formState.endUpdatedAt}
            />
          </div>
        </div>

        <div className="filter-section">
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>


      <Table data={formattedOrders} columns={orderColumns} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />


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
