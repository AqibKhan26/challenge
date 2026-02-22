import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      {/* Header */}
      <header
        style={{
          padding: '16px 32px',
          background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'Arial, sans-serif' }}>
          Items Catalog
        </h1>
        <nav>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              marginLeft: 24,
              transition: 'color 0.2s',
            }}
            onMouseOver={e => (e.target.style.color = '#ffd700')}
            onMouseOut={e => (e.target.style.color = 'white')}
          >
            Home
          </Link>
          {/* Add more links here if needed */}
        </nav>
      </header>

      {/* Routes */}
      <main style={{ padding: '24px 32px' }}>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </main>
    </DataProvider>
  );
}

export default App;