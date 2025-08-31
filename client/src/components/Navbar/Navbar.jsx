import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

const handleScrollNav = (hash) => (e) => {
  e.preventDefault();
  const el = document.getElementById(hash.replace('#', ''));
  if (el) {
    const yOffset = -80; // navbar height
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  setOpen(false);
};

  const onLogout = async () => {
    try {
      await logout?.();
    } finally {
      navigate('/login');
    }
  };

  return (
    <header className={styles.wrap}>
      <div className={styles.inner}>
        {/* Left side (brand) */}
        <div className={styles.left}>
          <NavLink to="/" className={styles.brand}>
            <img src="https://res.cloudinary.com/djgdnsyyf/image/upload/v1755995375/KatsefetLogo_mlxooj.jpg" alt="Kashrus Web" width="50" height="50"/>
           </NavLink>
        </div>

        {/* Burger (mobile only) */}
        <button
          className={styles.burger}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Desktop navigation */}
        <nav className={`${styles.nav} ${open ? styles.show : ''}`}>
          <div className={styles.navLeft}>
            <NavLink to="/" end className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            } onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <a href="/#about" onClick={handleScrollNav('#about')} className={styles.link}>
              About Us
            </a>
            <a href="/#contact" onClick={handleScrollNav('#contact')} className={styles.link}>
              Contact
            </a>
            <NavLink to="/hechsheirim" className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            } onClick={() => setOpen(false)}>
              Our Hechshirim
            </NavLink>
            <NavLink to="/rabanim" className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            } onClick={() => setOpen(false)}>
              Our Rabbanim
            </NavLink>
            <NavLink to="/articles" className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            } onClick={() => setOpen(false)}>
              Articles
            </NavLink>
          </div>

          <div className={styles.navRight}>
            {isAuthenticated ? (
              <>
                <NavLink to="/admin" className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                } onClick={() => setOpen(false)}>
                  Admin
                </NavLink>
                <a href="#logout" onClick={(e) => {
                  e.preventDefault();
                  onLogout();
                  setOpen(false);
                }} className={styles.link}>
                  Logout
                </a>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              } onClick={() => setOpen(false)}>
                Login
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
