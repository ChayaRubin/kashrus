import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';

export default function PublicLayout() {
  return (
    <div style={{ fontFamily:'system-ui, sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth:1000, margin:'0 auto', padding:20 }}>
        <Outlet />
      </main>
      <footer style={{ textAlign:'center', padding:20, color:'#888' }}>
        © {new Date().getFullYear()} Kashrus Web
      </footer>
    </div>
  );
}
