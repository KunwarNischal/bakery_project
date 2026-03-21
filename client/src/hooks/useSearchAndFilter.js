/**
 * Hook: useSearchAndFilter
 * Manages search and filtering of list items
 * 
 * @description Handles search term and multiple filters with memoization
 * @param {Array} items - Array of items to filter
 * @param {Function} filterFn - Filter logic function
 * @param {Object} initialFilters - Initial filter values
 * 
 * @returns {Object} { searchTerm, setSearchTerm, filters, setFilter, filteredItems, clearFilters }
 * 
 * @example
 * const { searchTerm, setSearchTerm, filters, setFilter, filteredItems } = 
 *   useSearchAndFilter(products, (item, search, filters) => {
 *     return item.name.includes(search.toLowerCase()) &&
 *            (!filters.category || item.category === filters.category);
 *   });
 */

import { useState, useMemo } from 'react';

export const useSearchAndFilter = (
  items = [],
  filterFn,
  initialFilters = {}
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const filteredItems = useMemo(() => {
    return items.filter(item => filterFn(item, searchTerm, filters));
  }, [items, searchTerm, filters, filterFn]);

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters(initialFilters);
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    filteredItems,
    clearFilters
  };
};
