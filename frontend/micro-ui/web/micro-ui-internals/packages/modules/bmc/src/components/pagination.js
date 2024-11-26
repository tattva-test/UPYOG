import React from "react";
import { useTranslation } from "react-i18next";

const Pagination = ({ totalRecords, rowsPerPage, currentPage, onPageChange, onRowsPerPageChange }) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((page) => (
      <li
        key={page}
        className={`page-item ${page === currentPage ? "active" : ""} ${totalRecords === 0 ? "disabled" : ""}`}
        onClick={() => handlePageChange(page)}
      >
        <button className="page-link" disabled={page === currentPage}>
          {page}
        </button>
      </li>
    ));
  };

  return (
    <React.Fragment>
      <div className="bmc-pagination-container">
        <div className="bmc-pagination-info">
          {t("Showing")} {(currentPage - 1) * rowsPerPage + 1} {t("to")} {Math.min(currentPage * rowsPerPage, totalRecords)} {t("of")} {totalRecords}{" "}
          {t("records")}
          <span style={{ paddingLeft: "10px" }}>{t("Rows per page")}:</span>
          <select value={rowsPerPage} onChange={(e) => onRowsPerPageChange(Number(e.target.value))}>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
            <option value={60}>60</option>
          </select>
        </div>
        <ul className="bmc-pagination">
          <li className={`page-item ${currentPage === 1 || totalRecords === 0 ? "disabled" : ""}`} onClick={() => handlePageChange(currentPage - 1)}>
            <button className="page-link" aria-label="Previous" disabled={currentPage === 1 || totalRecords === 0}>
              &laquo;
            </button>
          </li>
          {renderPaginationNumbers()}
          <li
            className={`page-item ${currentPage === totalPages || totalRecords === 0 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <button className="page-link" aria-label="Next" disabled={currentPage === totalPages || totalRecords === 0}>
              &raquo;
            </button>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default Pagination;
