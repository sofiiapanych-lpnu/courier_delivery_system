import { useEffect, useState } from 'react';
import { deliveryService } from '../api/deliveryServise';

export const useDeliveries = (filters, page, limit) => {
  const [deliveries, setDeliveries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const queryParams = { ...filters, page, limit };
    deliveryService.getAll(queryParams)
      .then(({ data }) => {
        setDeliveries(data.items); //response.data
        setTotalPages(data.meta.totalPages);
      })
      .catch(console.error);
  }, [filters, page]);

  return { deliveries, setDeliveries, totalPages };
};
