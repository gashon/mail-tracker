import React from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>LinkedIn Filter</h1>
      <p style={styles.countText}>post</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '300px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    fontSize: '20px',
    color: '#333333',
    margin: '0 0 10px',
    fontWeight: '500',
  },
  countText: {
    fontSize: '16px',
    color: '#666666',
    margin: '0',
  },
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
