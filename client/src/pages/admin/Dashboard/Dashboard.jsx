import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { UsersAPI } from '../../../app/api.js';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth() || {};
  const [resolvedName, setResolvedName] = useState('');

  useEffect(() => {
    if (!user) {
      setResolvedName('');
      return;
    }

    // Prefer any name fields already on the auth user object
    const directName =
      user.name?.trim?.() ||
      user.fullName?.trim?.() ||
      user.username?.trim?.();

    if (directName) {
      setResolvedName(directName);
      return;
    }

    // If we have an email, look up the matching user record to get the name
    if (user.email) {
      UsersAPI.list()
        .then((list) => {
          const match = Array.isArray(list)
            ? list.find((u) => u.email === user.email)
            : null;
          if (match?.name) {
            setResolvedName(match.name);
          }
        })
        .catch(() => {
          // ignore lookup errors – we'll fall back gracefully
        });
    }
  }, [user]);

  const displayName = resolvedName || 'Admin';

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome back, {displayName}!</h1>
        <p className={styles.subtitle}>
          Use the shortcuts below to quickly jump into the most common admin tasks.
        </p>
      </section>

      <section className={styles.grid}>
        <Link to="/admin/restaurants" className={styles.card}>
          <h2>Manage Restaurants</h2>
          <p>Update details, add new listings, and keep information fresh.</p>
        </Link>

        <Link to="/admin/articles" className={styles.card}>
          <h2>Manage Articles</h2>
          <p>Write, edit, and publish new content for your users.</p>
        </Link>

        <Link to="/admin/feedback" className={styles.card}>
          <h2>View Feedback</h2>
          <p>See what users are saying and track issues in one place.</p>
        </Link>

        <Link to="/admin/home" className={styles.card}>
          <h2>Home Page</h2>
          <p>Fine‑tune the texts and hero section visitors see first.</p>
        </Link>
      </section>
    </div>
  );
}
