import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import Pagination from '../components/Pagination'
import { useFilters } from '../hooks/useFilters'
import { useData } from '../hooks/useData'
import { warehouseService } from '../api/warehouseService'
import { formatWarehouse } from '../utils/formatters'
import styles from './WarehousesListPage.module.css';

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
    <div className={styles.container}>
      <h1 className={styles.title}>Warehouses</h1>
      <div className={styles.filters}>
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
            details={{
              "Address": warehouse.address,
              "Contact number": warehouse.contact_number
            }}
            buttonText="Order here"
            onButtonClick={() => handleSelectWarehouse(warehouse)}
          />
        ))}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default WarehousesListPage;
