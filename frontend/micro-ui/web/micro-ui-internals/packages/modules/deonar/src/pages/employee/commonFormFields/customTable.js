import { SearchField, Table, TextInput, Loader } from "@upyog/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";

const CustomTable = ({
  columns = [],
  data = [],
  currentPage,
  pageSizeLimit,
  manualPagination,
  totalRecords,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
  applyFilters,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
  isPaginationRequired = true, // Default is true
  onAddEmployeeClick,
  config,
  tableClassName = "",
  sortBy = [],
  onSort,
  isLoadingRows = false,
  showSearch = true, // New prop to control search visibility
  showTotalRecords = true, // New prop to control total records visibility
  showPagination = true, // New prop to control pagination visibility
  ...rest
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [sortConfig, setSortConfig] = useState(() => {
    return sortBy.map(sort => {
      const [key, direction] = sort.split(':');
      return { key, direction: direction || 'asc' };
    });
  });

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSort = (key) => {
    const newSortConfig = sortConfig.map(config => {
      if (config.key === key) {
        return { ...config, direction: config.direction === 'asc' ? 'desc' : 'asc' };
      }
      return config;
    });

    if (!newSortConfig.some(config => config.key === key)) {
      newSortConfig.push({ key, direction: 'asc' });
    }

    setSortConfig(newSortConfig);
    if (onSort) {
      onSort(newSortConfig);
    }
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    sortConfig.forEach(({ key, direction }) => {
      sortableItems.sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    });
    return sortableItems;
  }, [filteredData, sortConfig]);

  useEffect(() => {
    let result = data;
    if (searchTerm) {
      result = data.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredData(result);
  }, [data, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const renderElements = () => {
    if (!config || !config.elements || config.elements.length === 0) {
      return null;
    }

    return config.elements.map((element, index) => {
      if (element.type === "p") {
        return (
          <p
            key={index}
            style={element.style}
            onClick={onAddEmployeeClick}
          >
            {element.text}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        {showSearch && (
          <SearchField>
            <TextInput
              value={searchTerm}
              placeholder={searchPlaceholder}
              onChange={handleSearchChange}
              style={{ width: "35%" }}
            />
          </SearchField>
        )}
        {renderElements()}
        {showTotalRecords && (
          <p>Total Records: {sortedData.length}</p>
        )}
      </div>

      <Table
        className={`customTable table-fixed-first-column table-border-style deonar-scrollable-table ${tableClassName}`}
        columns={columns.map(col => ({
          ...col,
          sortFn: col.sortable ? () => handleSort(col.accessor) : undefined,
          isSortable: col.sortable,
          isSorted: col.sortable && sortConfig.some(config => config.key === col.accessor),
          sortOrder: col.sortable ? sortConfig.find(config => config.key === col.accessor)?.direction : undefined
        }))}
        currentPage={currentPage}
        data={isLoadingRows ? [] : sortedData}
        pageSizeLimit={pageSizeLimit}
        disableSort={false}
        manualPagination={manualPagination}
        totalRecords={totalRecords}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onPageSizeChange={onPageSizeChange}
        isPaginationRequired={isPaginationRequired && showPagination} // Pagination visibility control
        styles={{ border: "1px solid #ddd" }}
        getCellProps={(cellInfo) => ({
          style: {
            padding: "5px 5px",
            fontSize: "14px",
          },
        })}
        {...rest}
      />

      {isLoadingRows && (
        <div className="loader-overlay" style={{ position: 'relative' }}>
          <Loader style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
      )}
    </div>
  );
};

export default CustomTable;
