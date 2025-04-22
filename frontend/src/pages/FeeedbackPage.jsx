import React, { useState } from 'react';
import Modal from '../components/Modal';
import Table from '../components/Table';
import FeedbackForm from '../components/forms/FeedbackForm';
import { feedbackService } from '../api/feedbackService';
import { useData } from '../hooks/useData';
import { useFilters } from '../hooks/useFilters'
import { formateFeedbacks } from '../utils/formatters'
import { normalizeFeedbackData } from '../utils/dataNormalizers'

const FeedbacksPage = () => {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const limit = 5;
  const initialFormState = {
    courierName: '',
    clientName: '',
    rating: '',
    comment: '',
    hasComment: '',
  }
  const {
    filters,
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(initialFormState, setPage);
  const { data: feedbacks, setData, totalPages } = useData(feedbackService, filters, page, limit, refreshKey);


  const handleEdit = async (id) => {
    try {
      const res = await feedbackService.getById(id);
      setSelectedFeedback(res.data);
      setModalMode('edit');
      setModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    setSelectedFeedback(id);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleModalOK = async () => {
    try {
      if (modalMode === 'edit') {
        const normalized = normalizeFeedbackData(selectedFeedback);
        const updated = await feedbackService.update(selectedFeedback.feedback_id, normalized);
        setData(prev => prev.map(f => f.feedback_id === updated.data.feedback_id ? updated.data : f));
      }

      if (modalMode === 'delete') {
        await feedbackService.delete(selectedFeedback);
        setData(prev => prev.filter(f => f.feedback_id !== selectedFeedback));
      }

      setRefreshKey(prev => prev + 1);
    } catch (e) {
      console.error(e);
    } finally {
      handleModalClose();
    }
  };

  const formatedFeedbacks = feedbacks.map(formateFeedbacks);

  const columns = [
    { header: 'Courier', accessor: 'courier' },
    { header: 'Client', accessor: 'client' },
    { header: 'Rating', accessor: 'rating' },
    { header: 'Comment', accessor: 'comment' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <>
          <button onClick={() => handleEdit(row.feedback_id)}>Edit</button>
          <button onClick={() => handleDelete(row.feedback_id)} style={{ marginLeft: '10px' }}>Delete</button>
        </>
      )
    }
  ];

  return (
    <div>
      <h1>Feedbacks</h1>
      <div className="filters">
        <input
          name="courierName"
          onChange={handleFilterChange}
          value={formState.courierName}
          placeholder="Courier name or surname"
        />
        <input
          name="clientName"
          onChange={handleFilterChange}
          value={formState.clientName}
          placeholder="Courier name or surname"
        />
        <div style={{ marginBottom: '10px' }}>
          <span>Rating: </span>
          {[1, 2, 3, 4, 5].map((r) => (
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
        <div>
          <label>Comment presence:</label>
          <select
            name="hasComment"
            onChange={handleFilterChange}
            value={formState.hasComment}
          >
            <option value="">All</option>
            <option value="true">With comment</option>
            <option value="false">Without comment</option>
          </select>
        </div>


        <input
          name="comment"
          onChange={handleFilterChange}
          placeholder="Comment"
          value={formState.comment}
        />
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>
      <Table data={formatedFeedbacks} columns={columns} />

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Prev</button>
        <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
      </div>

      {modalOpen && (
        <Modal open={modalOpen} onClose={handleModalClose} onOK={handleModalOK}>
          {modalMode === 'edit' ? (
            <FeedbackForm selectedFeedback={selectedFeedback} setSelectedFeedback={setSelectedFeedback} />
          ) : (
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this feedback?</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default FeedbacksPage;
