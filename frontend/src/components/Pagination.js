import React from "react";
import './Pagination.css';

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10, 
  totalItems = 0,
  showInfo = true,
  maxVisiblePages = 5 
}) {
  
  // Tính toán các trang hiển thị
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const sidePages = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - sidePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    // Điều chỉnh nếu không đủ trang ở cuối
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Helper: chuyển trang và scroll lên đầu
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) {
    return null; // Không hiển thị pagination nếu chỉ có 1 trang
  }

  return (
    <div className="pagination-wrapper">
      {/* Thông tin items */}
      {showInfo && totalItems > 0 && (
        <div className="pagination-info">
          Hiển thị {startItem} - {endItem} của {totalItems} sản phẩm
        </div>
      )}

      <div className="pagination-container">
        {/* Nút Previous */}
        <button
          className={`pagination-button pagination-nav ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
        >
          ‹
        </button>

        {/* Trang đầu và dấu ... */}
        {visiblePages[0] > 1 && (
          <>
            <button
              className="pagination-button"
              onClick={() => handlePageClick(1)}
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="pagination-ellipsis">...</span>
            )}
          </>
        )}

        {/* Các trang hiển thị */}
        {visiblePages.map((page) => (
          <button
            key={page}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageClick(page)}
            aria-label={`Trang ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Dấu ... và trang cuối */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              className="pagination-button"
              onClick={() => handlePageClick(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Nút Next */}
        <button
          className={`pagination-button pagination-nav ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Trang tiếp"
        >
          ›
        </button>
      </div>

      {/* Quick jump */}
      {totalPages > 10 && (
        <div className="pagination-jump">
          <label htmlFor="page-jump">Đến trang: </label>
          <input
            id="page-jump"
            type="number"
            min="1"
            max={totalPages}
            className="page-jump-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages && page !== currentPage) {
                  handlePageClick(page);
                  e.target.value = '';
                }
              }
            }}
            placeholder={currentPage}
          />
        </div>
      )}
    </div>
  );
}

export default Pagination;
