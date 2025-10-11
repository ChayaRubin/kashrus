import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);


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
            <a href="/#about" className={styles.link} onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              const hash = '#about';
              if (window.location.pathname === '/' || window.location.pathname === '/home') {
                // Already on home page, just scroll
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                  const yOffset = -80;
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                  // Update the URL hash without triggering a reload
                  window.history.pushState(null, '', hash);
                }
              } else {
                // On different page, navigate to home with hash
                navigate(`/${hash}`);
              }
            }}>
              About Us
            </a>
            <a href="/#contact" className={styles.link} onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              const hash = '#contact';
              if (window.location.pathname === '/' || window.location.pathname === '/home') {
                // Already on home page, just scroll
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                  const yOffset = -80;
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                  // Update the URL hash without triggering a reload
                  window.history.pushState(null, '', hash);
                }
              } else {
                // On different page, navigate to home with hash
                navigate(`/${hash}`);
              }
            }}>
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
