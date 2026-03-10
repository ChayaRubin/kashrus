import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const Item = ({ to, children }) => (
    <Link
      to={to}
      className={`${styles.item} ${pathname === to ? styles.active : ''}`}
      onClick={() => setOpen(false)}
    >
      {children}
    </Link>
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const mobileMenuContent = (
    <div className={styles.navPortal} role="dialog" aria-label="Menu">
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
    </div>
  );

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <img
            src="https://res.cloudinary.com/djgdnsyyf/image/upload/v1760655805/logoIsrael_zb6ci0.png"
            alt="Kashrus Web"
            width="40"
            height="40"
          />
        </Link>

        <button
          className={styles.burger}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav className={styles.nav}>
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

      {typeof document !== 'undefined' &&
        open &&
        createPortal(mobileMenuContent, document.body)}

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
