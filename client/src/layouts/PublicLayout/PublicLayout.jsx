import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  return (
    <div className={styles.wrap}>
      <Navbar />

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Kashrus Web
      </footer>
    </div>
  );
}
