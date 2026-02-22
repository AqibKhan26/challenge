import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/items/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch item');
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <p>Loading item...</p>;
  if (notFound) return <p>Item not found</p>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        padding: 24,
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginBottom: 16, color: '#333' }}>{item.name}</h2>
      <p style={{ margin: 8, fontSize: 16, color: '#555' }}>
        <strong>Category:</strong> {item.category}
      </p>
      <p style={{ margin: 8, fontSize: 18, color: '#007BFF', fontWeight: 'bold' }}>
        ${item.price}
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: 24,
          padding: '10px 20px',
          borderRadius: 6,
          backgroundColor: '#007BFF',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'background 0.2s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}
      >
        &larr; Back to Items
      </Link>
    </div>
  );
}

export default ItemDetail;