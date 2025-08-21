// src/layouts/AdminLayout/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
	const { pathname } = useLocation();
	const Item = ({ to, children }) => (
		<Link to={to} style={{
			padding: '8px 10px',
			borderRadius: 8,
			background: pathname === to ? '#eef4ff' : 'transparent',
			textDecoration: 'none'
		}}>{children}</Link>
	);

	return (
		<div>
			<header style={{
				display: 'flex', alignItems: 'center', justifyContent: 'space-between',
				padding: 16, borderBottom: '1px solid #eee', background: '#fff', position: 'sticky', top: 0, zIndex: 10
			}}>
				<h3 style={{ margin: 0 }}>Admin</h3>
				<nav style={{ display: 'flex', gap: 8 }}>
					<Item to="/admin">Dashboard</Item>
					<Item to="/admin/restaurants">Restaurants</Item>
					<Item to="/admin/users">Manage Users</Item>
				</nav>
			</header>
			<main style={{ padding: 20 }}>
				<Outlet />
			</main>
		</div>
	);
}
