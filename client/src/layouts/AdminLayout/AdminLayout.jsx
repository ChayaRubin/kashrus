import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { pathname } = useLocation();

  const Item = ({ to, children }) => (
    <Link
      to={to}
      className={`${styles.item} ${pathname === to ? styles.active : ''}`}
    >
      {children}
    </Link>
  );

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Item to="/admin">Dashboard</Item>
          <Item to="/admin/restaurants">Manage Restaurants</Item>
          <Item to="/admin/users">Manage Users</Item>
          <Item to="/admin/hechsheirim">Manage Hechsheirim</Item>
          <Item to="/admin/articles">Manage Articles</Item>
          <Item to="/admin/rabanim">Manage Rabanim</Item>
          <Item to="/">User Site</Item>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
