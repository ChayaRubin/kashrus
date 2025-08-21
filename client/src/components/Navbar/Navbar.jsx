import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = async () => {
    try {
      await logout?.();
    } finally {
      navigate('/login');
    }
  };

  const goContact = (e) => {
    e.preventDefault();
    const doScroll = () => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (location.pathname !== '/') {
      navigate('/#contact');
      setTimeout(doScroll, 0);
    } else {
      doScroll();
    }
  };

  return (
    <header style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 20px', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'#fff', zIndex:10
    }}>
      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
        <NavLink to="/" style={{ textDecoration:'none', fontWeight:700 }}>Kashrus Web</NavLink>
        <nav style={{ display:'flex', gap:12 }}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to='/about'>About Us</NavLink>
          <a href="/#contact" onClick={goContact}>Contact</a>
          <NavLink to="/hechsheirim">Our Hechshirim</NavLink>
          <NavLink to="/rabanim">Our Rabbanim</NavLink>
          <NavLink to='/articles'>Articles </NavLink>
        </nav>
      </div>
      {isAuthenticated ? (
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <NavLink to="/admin">Admin</NavLink>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </header>
  );
}
