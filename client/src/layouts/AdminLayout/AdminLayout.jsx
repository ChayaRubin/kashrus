import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';

export default function AdminLayout() {
  return (
    <div style={{ fontFamily:'system-ui, sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth:1100, margin:'0 auto', padding:20 }}>
        <h2 style={{ marginTop:0 }}>Admin</h2>
        <div style={{ display:'flex', gap:16, marginBottom:16 }}>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/restaurants">Restaurants</NavLink>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
