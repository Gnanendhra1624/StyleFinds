import React from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Pagination.module.css';

export const Pagination = () => {
  const { currentPage, totalPages, setCurrentPage } = useApp();

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.paginationButton}
        aria-label="Previous page"
        title="Previous page"
      >
        &lt;
      </button>

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`${styles.paginationButton} ${
            page === currentPage ? styles.paginationButtonActive : ''
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
        aria-label="Next page"
        title="Next page"
      >
        &gt;
      </button>
    </div>
  );
};
