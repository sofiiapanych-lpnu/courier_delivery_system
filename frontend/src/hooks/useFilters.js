import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useFilters = (initialState, resetPage) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState(initialState);
  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filtersFromUrl = {};
    searchParams.forEach((value, key) => {
      filtersFromUrl[key] = value;
    });
    setFilters(filtersFromUrl);
    setFormState(prev => ({ ...prev, ...filtersFromUrl }));
  }, [location]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setFormState(prev => ({ ...prev, [name]: value }));
    navigate(`?${new URLSearchParams({ ...filters, [name]: value }).toString()}`);
    if (resetPage) resetPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialState);
    setFormState(initialState);
    navigate('?');
    if (resetPage) resetPage(1);
  };

  return { filters, formState, handleFilterChange, handleClearFilters };
};
