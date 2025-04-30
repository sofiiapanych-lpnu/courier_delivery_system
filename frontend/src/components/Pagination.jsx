import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ page, totalPages, setPage }) => {
  const handlePrev = () => {
    setPage(prev => {
      const newPage = Math.max(prev - 1, 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return newPage;
    });
  };

  const handleNext = () => {
    setPage(prev => {
      const newPage = Math.min(prev + 1, totalPages);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return newPage;
    });
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        onClick={handlePrev}
        disabled={page === 1}
      >
        Prev
      </button>

      <span className={styles.pageInfo}>
        Page {page} of {totalPages}
      </span>

      <button
        className={styles.pageButton}
        onClick={handleNext}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
