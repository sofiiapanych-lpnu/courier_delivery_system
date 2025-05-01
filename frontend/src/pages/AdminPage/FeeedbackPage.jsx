import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import FeedbackForm from '../../components/forms/FeedbackForm';
import { feedbackService } from '../../api/feedbackService';
import { useData } from '../../hooks/useData';
import { useFilters } from '../../hooks/useFilters'
import { formatFeedbacks } from '../../utils/formatters'
import { normalizeFeedbackData } from '../../utils/dataNormalizers'
import Pagination from '../../components/Pagination'
import ActionButton from '../../components/ActionButton'
import './filters.css';

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

  const formatedFeedbacks = feedbacks.map(formatFeedbacks);

  const columns = [
    { header: 'Courier', accessor: 'courier' },
    { header: 'Client', accessor: 'client' },
    { header: 'Rating', accessor: 'rating' },
    { header: 'Comment', accessor: 'comment' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <div className="actionsWrapper">
          <ActionButton
            variant="edit"
            onClick={() => handleEdit(row.feedback_id)}>
            Edit
          </ActionButton>
          <ActionButton
            variant="delete"
            onClick={() => handleDelete(row.feedback_id)}>
            Delete
          </ActionButton>
        </div>
      )
    }
  ];

  return (
    <div>
      <h1>Feedbacks</h1>
      <div className="filters">
        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="courierName">Courier Name</label>
            <input
              id="courierName"
              name="courierName"
              onChange={handleFilterChange}
              placeholder="e.g. John Doe"
              value={formState.courierName}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="clientName">Client Name</label>
            <input
              id="clientName"
              name="clientName"
              onChange={handleFilterChange}
              placeholder="e.g. Jane Smith"
              value={formState.clientName}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Rating:</label>
            <div className="rating-buttons">
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
                  className={`rating-button ${formState.rating === r.toString() ? 'active' : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="hasComment">Comment Presence</label>
            <select
              id="hasComment"
              name="hasComment"
              onChange={handleFilterChange}
              value={formState.hasComment}
            >
              <option value="">All</option>
              <option value="true">With Comment</option>
              <option value="false">Without Comment</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="comment">Comment</label>
            <input
              id="comment"
              name="comment"
              onChange={handleFilterChange}
              placeholder="e.g. Everything alright"
              value={formState.comment}
            />
          </div>
        </div>

        <div className="filter-section">
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>


      <Table data={formatedFeedbacks} columns={columns} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

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
