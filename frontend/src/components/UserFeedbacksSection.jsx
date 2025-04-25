import React, { useEffect, useState } from 'react';
import Table from './Table';
import { useFilters } from '../hooks/useFilters';
import { courierService } from '../api/courierService';
import { clientService } from '../api/clientService';
import { formatFeedbacks } from '../utils/formatters';

const UserFeedbacksSection = ({ userInfo, isCourier }) => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  const feedbackFiltersInitial = {
    courierName: '',
    rating: '',
    comment: '',
    hasComment: '',
  };

  const { filters, formState, handleFilterChange, handleClearFilters } = useFilters(feedbackFiltersInitial, setPage);

  useEffect(() => {
    if (userInfo) fetchFeedbacks();
  }, [userInfo, formState, page]);

  const fetchFeedbacks = () => {
    if (!userInfo) return;

    const id = isCourier ? userInfo.Courier?.courier_id : userInfo.Client?.client_id;
    if (!id) return;

    const fetchFn = isCourier
      ? courierService.getFeedbacks
      : clientService.getFeedbacks;

    fetchFn(id, { ...formState, page, limit })
      .then(res => {
        setFeedbacks(res.data.items);
        setTotalPages(res.data.meta.totalPages);
      })
      .catch(err => console.error("Failed to fetch feedbacks", err));
  };

  const formatedFeedbacks = feedbacks.map(formatFeedbacks);

  const feedbackColumns = [
    { header: isCourier ? 'Client' : 'Courier', accessor: isCourier ? 'client' : 'courier' },
    { header: 'Rating', accessor: 'rating' },
    { header: 'Comment', accessor: 'comment' },
    { header: 'Created At', accessor: 'created_at' },
  ];

  return (
    <div>
      <h2>Your Feedbacks</h2>

      <div className="filters">
        <h2>Filters</h2>
        <input
          name="courierName"
          value={formState.courierName}
          onChange={handleFilterChange}
          placeholder="Courier name"
        />
        <div style={{ marginBottom: '10px' }}>
          <span>Rating: </span>
          {[1, 2, 3, 4, 5].map(r => (
            <button
              key={r}
              onClick={() =>
                handleFilterChange({
                  target: {
                    name: 'rating',
                    value: formState.rating === r.toString() ? '' : r.toString(),
                  },
                })
              }
              style={{
                marginRight: '5px',
                backgroundColor: formState.rating === r.toString() ? '#007bff' : 'transparent',
                color: formState.rating === r.toString() ? '#fff' : 'inherit',
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <select
          name="hasComment"
          onChange={handleFilterChange}
          value={formState.hasComment}
        >
          <option value="">All</option>
          <option value="true">With comment</option>
          <option value="false">Without comment</option>
        </select>
        <input
          name="comment"
          value={formState.comment}
          onChange={handleFilterChange}
          placeholder="Comment text"
        />
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      <Table data={formatedFeedbacks} columns={feedbackColumns} />

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page <= 1}>Prev</button>
        <span style={{ margin: '0 10px' }}>
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages || totalPages === 0}
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default UserFeedbacksSection;
