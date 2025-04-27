import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import { useFilters } from '../hooks/useFilters'
import { useData } from '../hooks/useData'
import { warehouseService } from '../api/warehouseService'
import { formatWarehouse } from '../utils/formatters'

const WarehousesListPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const initialFormState = {
    name: '',
    address: '',
    contactNumber: '',
  };

  const {
    filters,
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(initialFormState, setPage);

  const { data: warehouses, setData: setWarehouses, totalPages } = useData(warehouseService, filters, page, limit);

  const navigate = useNavigate();

  const handleSelectWarehouse = (warehouse) => {
    console.log('navigate', warehouse)
    navigate(`/warehouses/${warehouse.warehouse_id}/create-order`);
  };

  const formattedWarehouses = warehouses.map(formatWarehouse);
  console.log('warehouses', warehouses, formattedWarehouses)


  return (
    <div>
      <h1>Warehouses</h1>
      <div className='filters'>
        <input
          name="name"
          onChange={handleFilterChange}
          placeholder="Warehouse Name"
          value={formState.name}
        />
        <input
          name="address"
          onChange={handleFilterChange}
          placeholder="Address"
          value={formState.address}
        />
        <input
          name="contactNumber"
          onChange={handleFilterChange}
          placeholder="Contact number"
          value={formState.contactNumber}
        />
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>
      <div>
        {formattedWarehouses.map((warehouse) => (
          <Card
            key={warehouse.warehouse_id}
            title={warehouse.name}
            description="тут може бути те, що пропонує склад"
            details={{
              "Address": warehouse.address,
              "Contact number": warehouse.contact_number
            }}
            buttonText="Order here"
            onButtonClick={() => handleSelectWarehouse(warehouse)}
          />
        ))}
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
      </div>
    </div>
  );
};

export default WarehousesListPage;
