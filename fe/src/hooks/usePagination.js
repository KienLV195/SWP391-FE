import { useState, useMemo } from "react";

const usePagination = (data, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return (data || []).slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const total = data ? data.length : 0;

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize: () => {},
    paginatedData,
    total,
  };
};

export default usePagination;
