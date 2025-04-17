import { useEffect, useState } from 'react';

export const useData = (service, filters, page, limit) => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const queryParams = { ...filters, page, limit };
    service.getAll(queryParams)
      .then(({ data }) => {
        console.log('data', data.items)
        setData(data.items);
        setTotalPages(data.meta.totalPages);
      })
      .catch(console.error);
  }, [filters, page, service, limit]);
  console.log(filters)
  return { data, setData, totalPages };
};
