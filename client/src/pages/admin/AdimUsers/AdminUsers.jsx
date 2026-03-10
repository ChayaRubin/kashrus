import { useEffect, useState } from 'react';
import styles from './AdminUsers.module.css';
import { UsersAPI } from '../../../app/api.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    role: 'user',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await UsersAPI.list();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err?.message || 'Failed to load users. If you see "too many connections", close Prisma Studio and try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  function setFormField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    try {
      await UsersAPI.create(payload);
      setForm({ id: null, name: '', email: '', role: 'user', password: '' });
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditedUser({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    });
  };

  const handleSave = async (id) => {
    try {
      await UsersAPI.update(id, editedUser);
      setEditingId(null);
      setEditedUser({});
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await UsersAPI.remove(id);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const renderInput = (field, type = 'text', placeholder = '', label) => (
    <div className={styles.field} key={field}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        value={form[field]}
        onChange={(e) => setFormField(field, e.target.value)}
        className={styles.input}
        placeholder={placeholder}
        required
        aria-label={label || placeholder}
      />
    </div>
  );

  const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
  const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.sectionTitle}>User Management</h1>
        <p className={styles.subtitle}>Add users and manage roles.</p>
      </header>

      <section className={styles.formCard}>
        <h2 className={styles.cardTitle}>Add new user</h2>
        <form className={styles.formSection} onSubmit={handleSubmit}>
          {renderInput('name', 'text', 'e.g. Jane Doe', 'Full name')}
          {renderInput('email', 'email', 'e.g. jane@example.com', 'Email')}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="role">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setFormField('role', e.target.value)}
              className={styles.select}
              aria-label="Role"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {!form.id && renderInput('password', 'password', 'Min 6 characters', 'Password')}
          <div className={styles.fieldSubmit}>
            <button type="submit" className={styles.primaryButton}>
              {form.id ? 'Update user' : 'Create user'}
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className={styles.error} role="alert">
          {error}
          <button type="button" onClick={() => { setError(null); fetchUsers(); }} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}
      {loading && <p className={styles.loading}>Loading users…</p>}

      <section className={styles.tableCard}>
        <h2 className={styles.cardTitle}>Users</h2>
        <div className={styles.tableWrap}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.emptyState}>
                    {error ? 'Could not load users. Use Retry above.' : 'No users yet. Add one using the form above.'}
                  </td>
                </tr>
              )}
              {!loading && users.map((user) => (
                <tr key={user.id} className={styles.userRow}>
                  {['name', 'email'].map((field) => (
                    <td key={field} data-label={field === 'name' ? 'Name' : 'Email'}>
                      {editingId === user.id ? (
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          value={editedUser[field]}
                          onChange={(e) => setEditedUser({ ...editedUser, [field]: e.target.value })}
                          className={styles.cellInput}
                          aria-label={field}
                        />
                      ) : (
                        <span className={styles.cellText}>{user[field]}</span>
                      )}
                    </td>
                  ))}
                  <td data-label="Role">
                    {editingId === user.id ? (
                      <select
                        value={editedUser.role}
                        onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                        className={styles.cellSelect}
                        aria-label="Role"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={styles.roleBadge} data-role={user.role}>{user.role}</span>
                    )}
                  </td>
                  <td data-label="Actions">
                    <div className={styles.actions}>
                      {editingId === user.id ? (
                        <>
                          <button type="button" onClick={() => handleSave(user.id)} className={styles.btnSave}>Save</button>
                          <button type="button" onClick={() => setEditingId(null)} className={styles.btnCancel}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => handleDelete(user.id)} className={styles.btnIconDanger} title="Delete" aria-label="Delete user"><IconTrash /></button>
                          <button type="button" onClick={() => handleEdit(user)} className={styles.btnIconDefault} title="Edit" aria-label="Edit user"><IconEdit /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
