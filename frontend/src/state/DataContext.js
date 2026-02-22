import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async ({ q = '', page = 1, limit = 3 } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/items?q=${q}&page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      console.log(data);
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems, loading, error, totalPages }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);