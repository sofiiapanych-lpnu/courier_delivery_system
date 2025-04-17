import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Table from '../components/Table'
import Modal from '../components/Modal'

const AdminPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [filters, setFilters] = useState({});
  const [formState, setFormState] = useState({
    deliveryStatus: '',
    deliveryType: '',
    orderTypeQuery: '',
    warehouseAddressQuery: '',
    clientAddressQuery: '',
    paymentMethod: '',
    startTime: '',
    endTime: '',
  });
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [warehouses, setWarehouses] = useState([]);


  const fetchDeliveries = () => {
    const queryParams = new URLSearchParams({
      ...filters,
      page,
      limit
    }).toString();

    axios.get(`http://localhost:3000/delivery?${queryParams}`)
      .then(response => {
        setDeliveries(response.data.items);
        setPage(response.data.meta.currentPage);
        setTotalPages(response.data.meta.totalPages);
      })
      .catch(error => console.error('Error fetching deliveries:', error));
  };

  useEffect(() => {
    fetchDeliveries();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setFormState((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleEditDelivery = (id) => {
    axios.get(`http://localhost:3000/delivery/${id}`)
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

  const handleModalOK = () => {
    if (modalMode === 'edit') {
      const deliveryId = selectedDelivery.delivery_id;
      const warehouse = selectedDelivery.warehouse;
      const warehouseAddress = warehouse.address;

      console.log('Editing delivery:', selectedDelivery);
      axios.put(`http://localhost:3000/address/${warehouseAddress.address_id}`, warehouseAddress)
        .then(() => {
          return axios.put(`http://localhost:3000/warehouse/${warehouse.warehouse_id}`, {
            name: warehouse.name,
            address_id: warehouseAddress.address_id
          });
        })
        .then(() => {
          const deliveryPayload = {
            ...selectedDelivery,
            warehouse_id: warehouse.warehouse_id,
            address_id: selectedDelivery.Address?.address_id,
          };

          delete deliveryPayload.warehouse;
          delete deliveryPayload.Address;

          return axios.put(`http://localhost:3000/delivery/${deliveryId}`, deliveryPayload);
        })
        .then(response => {
          setDeliveries(deliveries.map(d => d.delivery_id === deliveryId ? response.data : d));
          setModalOpen(false);
        })
        .catch(error => console.error('Error updating warehouse/address/delivery:', error));
    }

    if (modalMode === 'delete') {
      console.log('Deleting delivery:', selectedDelivery);
      axios.delete(`http://localhost:3000/delivery/${selectedDelivery}`)
        .then(() => {
          setDeliveries(deliveries.filter(d => d.delivery_id !== selectedDelivery));
          setModalOpen(false);

          if (deliveries.length === 1 && page > 1) {
            setPage(prev => prev - 1);
          } else {
            fetchDeliveries();
          }
        })
        .catch(error => console.error('Error deleting delivery:', error));
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy HH:mm:ss');
  };

  const formatAddress = (address) => {
    if (!address) return 'No address';
    const { street_name, building_number, apartment_number, city, country } = address;

    const base = `${street_name} ${building_number}`;
    const apartment = apartment_number ? `, Apt. ${apartment_number}` : '';

    return `${base}${apartment}, ${city}, ${country}`;
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatPerson = (person) => {
    if (!person || !person.user) return 'No name';

    const { first_name, last_name } = person.user;

    return `${first_name} ${last_name}`;
  };

  console.log(deliveries)
  const formattedDeliveries = deliveries.map(delivery => ({
    ...delivery,
    created_at: formatDate(delivery.created_at),
    updated_at: formatDate(delivery.updated_at),
    start_time: formatDate(delivery.start_time),
    end_time: formatDate(delivery.end_time),
    address: formatAddress(delivery.Address),
    warehouse: <>
      <b>{delivery.warehouse.name}</b><br />
      {formatAddress(delivery.warehouse.address)}
    </>,
    delivery_status: formatStatus(delivery.delivery_status),
    order: delivery.order.order_type,
    client: formatPerson(delivery.Client),
    courier: formatPerson(delivery.courier)
  }));

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
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DELIVERED">Delivered</option>
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

        <button onClick={() => {
          setFilters({});
          setFormState({
            deliveryStatus: '',
            deliveryType: '',
            orderTypeQuery: '',
            warehouseAddressQuery: '',
            clientAddressQuery: '',
            paymentMethod: '',
            startTime: '',
            endTime: '',
          });
        }}>Clear Filters</button>
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
            <div>
              <h2>Edit Delivery</h2>
              {
                console.log('selectedDelivery', selectedDelivery)}
              <div className='warehouse'>
                <input
                  type="text"
                  value={selectedDelivery?.warehouse.name || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    warehouse: {
                      ...selectedDelivery?.warehouse,
                      name: e.target.value
                    }
                  })}
                />
                <input
                  type="text"
                  value={selectedDelivery?.warehouse.address.country || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    warehouse: {
                      ...selectedDelivery?.warehouse,
                      address: {
                        ...selectedDelivery?.warehouse.address,
                        country: e.target.value
                      }
                    }
                  })}
                />
                <input
                  type="text"
                  value={selectedDelivery?.warehouse.address.city || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    warehouse: {
                      ...selectedDelivery?.warehouse,
                      address: {
                        ...selectedDelivery?.warehouse.address,
                        city: e.target.value
                      }
                    }
                  })}
                />
                <input
                  type="text"
                  value={selectedDelivery?.warehouse.address.building_number || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    warehouse: {
                      ...selectedDelivery?.warehouse,
                      address: {
                        ...selectedDelivery?.warehouse.address,
                        building_number: e.target.value
                      }
                    }
                  })}
                />
                <input
                  type="text"
                  value={selectedDelivery?.warehouse.address.apartment_number || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    warehouse: {
                      ...selectedDelivery?.warehouse,
                      address: {
                        ...selectedDelivery?.warehouse.address,
                        apartment_number: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div className='address'>
                <input
                  type="text"
                  value={selectedDelivery?.Address.country || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    address: {
                      ...selectedDelivery?.Address,
                      country: e.target.value
                    }
                  })}
                />
                <input
                  type="text"
                  value={selectedDelivery?.Address.city || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    address: {
                      ...selectedDelivery?.Address,
                      city: e.target.value
                    }
                  })}
                />
                <input
                  type="text"
                  value={selectedDelivery?.Address.street_name || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    address: {
                      ...selectedDelivery?.Address,
                      street_name: e.target.value
                    }
                  })}
                />
                <input
                  type="text"
                  value={selectedDelivery?.Address.building_number || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    address: {
                      ...selectedDelivery?.Address,
                      building_number: e.target.value
                    }
                  })}
                />
                <input
                  type="text"
                  value={selectedDelivery?.Address.apartment_number || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    address: {
                      ...selectedDelivery?.Address,
                      apartment_number: e.target.value
                    }
                  })}
                />
              </div>
              <div className='order'>
                <input
                  type="text"
                  value={selectedDelivery?.order?.order_type || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    order: {
                      ...selectedDelivery?.order,
                      order_type: e.target.value
                    }
                  })}
                />

                <input
                  type="text"
                  value={selectedDelivery?.order?.description || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    order: {
                      ...selectedDelivery?.order,
                      description: e.target.value
                    }
                  })}
                />

                <input
                  type="text"
                  value={selectedDelivery?.order?.cost || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    order: {
                      ...selectedDelivery?.order,
                      cost: e.target.value
                    }
                  })}
                />

                <input
                  type="text"
                  value={selectedDelivery?.order?.weight || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    order: {
                      ...selectedDelivery?.order,
                      weight: e.target.value
                    }
                  })}
                />

                <input
                  type="text"
                  value={selectedDelivery?.order?.height || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    order: {
                      ...selectedDelivery?.order,
                      height: e.target.value
                    }
                  })}
                />

                <input
                  type="text"
                  value={selectedDelivery?.order?.length || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    order: {
                      ...selectedDelivery?.order,
                      length: e.target.value
                    }
                  })}
                />

                <input
                  type="text"
                  value={selectedDelivery?.order?.width || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    order: {
                      ...selectedDelivery?.order,
                      width: e.target.value
                    }
                  })}
                />

                <input
                  type="text"
                  value={selectedDelivery?.order?.payment_method || ''}
                  onChange={(e) => setSelectedDelivery({
                    ...selectedDelivery,
                    order: {
                      ...selectedDelivery?.order,
                      payment_method: e.target.value
                    }
                  })}
                />
              </div>
              <div className='delivery'>
                <input type="text" value={selectedDelivery?.delivery_type || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, delivery_type: e.target.value })} />
                <input type="text" value={selectedDelivery?.delivery_status || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, delivery_status: e.target.value })} />
                <input type="text" value={selectedDelivery?.delivery_cost || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, delivery_cost: e.target.value })} />
                <input type="text" value={selectedDelivery?.desired_duration || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, desired_duration: e.target.value })} />
              </div>
              <div className='client'>
                <input type="text" value={selectedDelivery?.Client?.user?.first_name || ''} onChange={(e) => setSelectedDelivery({
                  ...selectedDelivery,
                  client: {
                    ...selectedDelivery?.client,
                    user: {
                      ...selectedDelivery?.client?.user,
                      first_name: e.target.value
                    }
                  }
                })} />
                <input type="text" value={selectedDelivery?.Client?.user?.last_name || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, client: { ...selectedDelivery?.client, user: { ...selectedDelivery?.client?.user, last_name: e.target.value } } })} />
                <input type="text" value={selectedDelivery?.Client?.user?.email || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, client: { ...selectedDelivery?.client, user: { ...selectedDelivery?.client?.user, email: e.target.value } } })} />
                <input type="text" value={selectedDelivery?.Client?.user?.phone_number || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, client: { ...selectedDelivery?.client, user: { ...selectedDelivery?.client?.user, phone_number: e.target.value } } })} />
              </div>

              <div className='courier'>
                <input type="text" value={selectedDelivery?.courier?.license_plate || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, courier: { ...selectedDelivery?.courier, license_plate: e.target.value } })} />
                <input type="text" value={selectedDelivery?.courier?.user?.first_name || ''} onChange={(e) => setSelectedDelivery({
                  ...selectedDelivery,
                  courier: {
                    ...selectedDelivery?.courier,
                    user: {
                      ...selectedDelivery?.courier?.user,
                      first_name: e.target.value
                    }
                  }
                })} />
                <input type="text" value={selectedDelivery?.courier?.user?.last_name || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, courier: { ...selectedDelivery?.courier, user: { ...selectedDelivery?.courier?.user, last_name: e.target.value } } })} />
                <input type="text" value={selectedDelivery?.courier?.user?.email || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, courier: { ...selectedDelivery?.courier, user: { ...selectedDelivery?.courier?.user, email: e.target.value } } })} />
                <input type="text" value={selectedDelivery?.courier?.user?.phone_number || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, courier: { ...selectedDelivery?.courier, user: { ...selectedDelivery?.courier?.user, phone_number: e.target.value } } })} />
              </div>
              <div className='warehouse'>
                <input type="text" value={selectedDelivery?.warehouse?.name || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, warehouse: { ...selectedDelivery?.warehouse, name: e.target.value } })} />
                <input type="text" value={selectedDelivery?.warehouse?.contact_number || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, warehouse: { ...selectedDelivery?.warehouse, contact_number: e.target.value } })} />
                <input type="text" value={selectedDelivery?.warehouse?.address?.street_name || ''} onChange={(e) => setSelectedDelivery({ ...selectedDelivery, warehouse: { ...selectedDelivery?.warehouse, address: { ...selectedDelivery?.warehouse?.address, street_name: e.target.value } } })} />
              </div>

              <input
                type="text"
                value={selectedDelivery?.delivery_status || ''}
                onChange={(e) => setSelectedDelivery({ ...selectedDelivery, delivery_status: e.target.value })}
              />
            </div>
          ) : (
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this delivery?</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;
