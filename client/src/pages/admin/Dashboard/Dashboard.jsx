import React from 'react';
import { useAuth } from '../../../app/auth/auth.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <p>Use the sidebar to manage restaurants.</p>
    </div>
  );
}
