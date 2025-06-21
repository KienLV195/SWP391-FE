import { useState, useMemo, useCallback } from "react";
import React from "react";

const useSearchAndFilter = (data, options = {}) => {
  const {
    searchFields = ["title", "content"], // Các field để search
    filterField = null, // Field để filter (ví dụ: 'category')
    searchFn = null, // Custom search function
    filterFn = null, // Custom filter function
    debounceMs = 300, // Debounce search
  } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Default search function
  const defaultSearchFn = useCallback(
    (item, term) => {
      if (!term) return true;
      const lowerTerm = term.toLowerCase();

      return searchFields.some((field) => {
        const value = item[field];
        if (!value) return false;

        if (Array.isArray(value)) {
          return value.some((v) => v.toLowerCase().includes(lowerTerm));
        }

        return value.toLowerCase().includes(lowerTerm);
      });
    },
    [searchFields]
  );

  // Default filter function
  const defaultFilterFn = useCallback(
    (item, filterValue) => {
      if (!filterValue || !filterField) return true;
      return item[filterField] === filterValue;
    },
    [filterField]
  );

  // Combined filtering logic
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let result = data;

    // Apply search
    if (debouncedSearchTerm) {
      const searchFunction = searchFn || defaultSearchFn;
      result = result.filter((item) =>
        searchFunction(item, debouncedSearchTerm)
      );
    }

    // Apply filter
    if (filter) {
      const filterFunction = filterFn || defaultFilterFn;
      result = result.filter((item) => filterFunction(item, filter));
    }

    return result;
  }, [
    data,
    debouncedSearchTerm,
    filter,
    searchFn,
    filterFn,
    defaultSearchFn,
    defaultFilterFn,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    filteredData,
    // Utility functions
    clearSearch: () => setSearchTerm(""),
    clearFilter: () => setFilter(null),
    clearAll: () => {
      setSearchTerm("");
      setFilter(null);
    },
  };
};

export default useSearchAndFilter;
