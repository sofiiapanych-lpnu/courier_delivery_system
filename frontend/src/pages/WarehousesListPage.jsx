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
    navigate(`/warehouses/${warehouse.warehouse_id}/${warehouse.name}/create-order`);
  };

  const formattedWarehouses = warehouses.map(formatWarehouse);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Warehouses</h1>
      <div className={styles.filters}>
        <div className={styles.inputField}>
          <label htmlFor="name">Warehouse Name</label>
          <input
            id="name"
            name="name"
            onChange={handleFilterChange}
            placeholder="e.g. Central Storage"
            value={formState.name}
          />
        </div>

        <div className={styles.inputField}>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            onChange={handleFilterChange}
            placeholder="e.g. 123 Main St, Springfield"
            value={formState.address}
          />
        </div>

        <div className={styles.inputField}>
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            id="contactNumber"
            name="contactNumber"
            onChange={handleFilterChange}
            placeholder="e.g. +380971234567"
            value={formState.contactNumber}
          />
        </div>

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
