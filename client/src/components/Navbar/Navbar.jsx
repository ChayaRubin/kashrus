import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth/auth.jsx';

export default function Navbar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 20px', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'#fff', zIndex:10
    }}>
      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
        <NavLink to="/" style={{ textDecoration:'none', fontWeight:700 }}>Kashrus Web</NavLink>
        <nav style={{ display:'flex', gap:12 }}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/level/FIRST">First</NavLink>
          <NavLink to="/level/SECOND">Second</NavLink>
          <NavLink to="/level/THIRD">Third</NavLink>
        </nav>
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {user ? (
          <>
            <NavLink to="/admin">Admin</NavLink>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={() => nav('/login')}>Login</button>
        )}
      </div>
    </header>
  );
}
