import { useEffect, useState } from 'react';

export const useData = (service, filters, page, limit, refreshKey) => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const queryParams = { ...filters, page, limit };
    service.getAll(queryParams)
      .then(({ data }) => {
        setData(data.items);
        setTotalPages(data.meta.totalPages);
      })
      .catch(console.error);
  }, [filters, page, service, limit, refreshKey]);
  console.log('filters', filters)
  return { data, setData, totalPages };
};
