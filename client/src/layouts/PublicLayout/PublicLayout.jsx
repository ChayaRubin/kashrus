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
        <a 
          href="https://pixel-perfect-2b1f2fe2.base44.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          © 2025 Created and Designed By CT websites
        </a>
      </footer>
    </div>
  );
}
