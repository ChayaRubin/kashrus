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

  const renderInput = (field, type = 'text', placeholder = '') => (
    <input
      type={type}
      value={form[field]}
      onChange={(e) => setFormField(field, e.target.value)}
      className={styles.input}
      placeholder={placeholder}
      required
    />
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>User Management</h1>

      <form className={styles.formSection} onSubmit={handleSubmit}>
        {renderInput('name', 'text', 'Full Name')}
        {renderInput('email', 'email', 'Email')}
        <select
          value={form.role}
          onChange={(e) => setFormField('role', e.target.value)}
          className={`${styles.input} ${styles.selectCompact}`}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {!form.id && renderInput('password', 'password', 'Password')}
        <button type="submit" className={styles.saveButton}>
          {form.id ? 'Update' : 'Create User'}
        </button>
      </form>

      {error && <p className={styles.error} style={{ marginBottom: '1rem' }}>{error}</p>}
      {loading && <p className={styles.loading}>Loading users…</p>}
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading && users.map((user) => (
            <tr key={user.id} className={styles.userRow}>
              {['name', 'email'].map((field) => (
                <td key={field}>
                  {editingId === user.id ? (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={editedUser[field]}
                      onChange={(e) => setEditedUser({ ...editedUser, [field]: e.target.value })}
                      className={styles.input}
                    />
                  ) : user[field]}
                </td>
              ))}
              <td>
                {editingId === user.id ? (
                  <select
                    value={editedUser.role}
                    onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                    className={styles.selectCompact}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : user.role}
              </td>
              <td>
                <div className={styles.actions}>
                  {editingId === user.id ? (
                    <>
                      <button onClick={() => handleSave(user.id)} className={styles.saveButton}>Save</button>
                      <button onClick={() => setEditingId(null)} className={styles.cancelButton}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleDelete(user.id)} className={styles.deleteButton}>🗑️</button>
                      <button onClick={() => handleEdit(user)} className={styles.editButton}>✏️</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
