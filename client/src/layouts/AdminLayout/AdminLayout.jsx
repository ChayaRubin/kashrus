import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const Item = ({ to, children }) => (
    <Link
      to={to}
      className={`${styles.item} ${pathname === to ? styles.active : ''}`}
      onClick={() => setOpen(false)}   // close menu after click
    >
      {children}
    </Link>
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        {/* Logo / brand */}
        <Link to="/" className={styles.brand}>
          <img
            src="https://res.cloudinary.com/djgdnsyyf/image/upload/v1760655805/logoIsrael_zb6ci0.png"
            alt="Kashrus Web"
            width="40"
            height="40"
          />
        </Link>

        {/* Burger button */}
        <button
          className={styles.burger}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Navigation (mirrors public navbar layout) */}
        <nav className={`${styles.nav} ${open ? styles.show : ''}`}>
          <div className={styles.navLeft}>
            <Item to="/admin">Dashboard</Item>
            <Item to="/admin/restaurants">Manage Restaurants</Item>
            <Item to="/admin/users">Manage Users</Item>
            <Item to="/admin/hechsheirim">Manage Hechsheirim</Item>
            <Item to="/admin/articles">Manage Articles</Item>
            <Item to="/admin/rabanim">Manage Rabanim</Item>
            <Item to="/admin/slideshow">Manage Slideshow</Item>
            <Item to="/admin/feedback">Manage Feedback</Item>
            <Item to="/admin/home">Manage Home Page</Item>
          </div>

          <div className={styles.navRight}>
            <Item to="/">User Site</Item>
            <span
              className={styles.item}
              style={{ cursor: 'pointer' }}
              onClick={handleLogout}
            >
              Logout
            </span>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
