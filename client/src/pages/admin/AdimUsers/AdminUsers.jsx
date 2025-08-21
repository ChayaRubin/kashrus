import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AdminUsers.module.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', can_self_book: 0, password: '', id: null });
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/users', { withCredentials: true });
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('שגיאה בשליפת משתמשים:', err);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = { ...form };
  try {
    await axios.post('http://localhost:5000/users', payload, { withCredentials: true });
    setForm({ name: '', email: '', role: 'user', can_self_book: 0, password: '', id: null });
    fetchUsers();
  } catch (err) {
    console.error('שגיאה ביצירה:', err);
  }
};


  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditedUser({ name: user.name, email: user.email, role: user.role || 'user', can_self_book: user.can_self_book });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/users/${id}`, editedUser, { withCredentials: true });
      setEditingId(null);
      setEditedUser({});
      fetchUsers();
    } catch (err) {
      console.error('שגיאה בעדכון:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      console.error('שגיאה במחיקה:', err);
    }
  };
  // All Hebrew strings translated to English
  // Error messages
  // 'שגיאה בשליפת משתמשים:' => 'Error fetching users:'
  // 'שגיאה ביצירה:' => 'Error creating user:'
  // 'שגיאה בעדכון:' => 'Error updating user:'
  // 'שגיאה במחיקה:' => 'Error deleting user:'

  // Replace error logs
  // (already done in the code above, just update the strings in the catch blocks)
  const renderInput = (field, type = 'text', placeholder = '') => (
    <input
      type={type}
      value={form[field]}
      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
      className={styles.input}
      placeholder={placeholder}
      required
    />
  );

  const renderSelect = (field, options) => (
    <select
      value={form[field]}
      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
      className={`${styles.input} ${styles.selectCompact}`}
    >
      {options.map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>User Management</h2>

      <form className={styles.formSection} onSubmit={handleSubmit}>
        {renderInput('name', 'text', 'Full Name')}
        {renderInput('email', 'email', 'Email')}
        {renderSelect('role', [['user', 'User'], ['admin', 'Admin']])}
        {renderSelect('can_self_book', [['0', 'No'], ['1', 'Yes']])}
        {!form.id && renderInput('password', 'password', 'Password')}
        <button type="submit" className={styles.saveButton}>{form.id ? 'Update' : 'Create User'}</button>
      </form>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Can Self Book</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
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
                {editingId === user.id ? (
                  <select
                    value={editedUser.can_self_book}
                    onChange={(e) => setEditedUser({ ...editedUser, can_self_book: e.target.value })}
                    className={styles.selectCompact}
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                ) : user.can_self_book ? '✔️' : '❌'}
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
