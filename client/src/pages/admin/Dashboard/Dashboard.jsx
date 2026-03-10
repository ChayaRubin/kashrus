import React from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth() || {};

  return (
    <div style={{ display:'grid', gap:16 }}>
      <p>Welcome, {user?.email}</p>
      <p>Use the sidebar to navigate between admin sections.</p>
    </div>
  );
}
