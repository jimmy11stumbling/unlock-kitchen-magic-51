
import { useState, useMemo } from 'react';

export function useSearch<T>(items: T[], searchFields: (keyof T)[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string' || typeof value === 'number') {
          return String(value)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return false;
      });
    });
  }, [items, searchQuery, searchFields]);

  return { searchQuery, setSearchQuery, filteredItems };
}
