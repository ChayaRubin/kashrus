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

const handleLogout = () => {
	// Add your logout logic here (e.g., clearing tokens, redirecting)
	// For example:
	localStorage.removeItem('token');
	window.location.href = '/login';
};

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
					   <div className={styles.right}>
				
				<Item to="/">User Site</Item>
				<span
					className={`${styles.item}`}
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
