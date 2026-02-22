import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../state/DataContext';
import { Virtuoso } from 'react-virtuoso';

function Items() {
  const { items = [], fetchItems, loading, error, totalPages = 1 } = useData();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState(''); // preserve search for pagination

  // Fetch items whenever page or query changes
  useEffect(() => {
    fetchItems({ q: currentQuery, page: currentPage });
  }, [fetchItems, currentQuery, currentPage]);

  // Triggered when user clicks Search
  const handleSearch = () => {
    setCurrentPage(1);       // reset to first page
    setCurrentQuery(search);  // update current query to fetch
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Items Catalog</h1>

      {/* Search Bar */}
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: 12,
            padding: '12px 24px',
            fontSize: 16,
            borderRadius: 4,
            border: 'none',
            backgroundColor: '#007BFF',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {/* Loading/Error/Empty */}
      {loading && <p>Loading items...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !items.length && <p>No items found</p>}

      {/* Virtualized List */}
      <Virtuoso
        style={{ height: 500 }}
        totalCount={items.length}
        itemContent={(index) => {
          const item = items[index];
          return (
            <div
              style={{
                padding: 16,
                marginBottom: 8,
                borderRadius: 6,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                boxSizing: 'border-box',
              }}
            >
              <Link
                to={`/items/${item.id}`}
                style={{ textDecoration: 'none', color: '#007BFF', fontWeight: 'bold', fontSize: 18 }}
              >
                {item.name} - ${item.price}
              </Link>
              <p style={{ margin: '4px 0', color: '#555' }}>{item.category}</p>
            </div>
          );
        }}
      />

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            style={{
              fontWeight: i + 1 === currentPage ? 'bold' : 'normal',
              textDecoration: i + 1 === currentPage ? 'underline' : 'none',
            }}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Items;