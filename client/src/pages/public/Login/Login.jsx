import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { useUser } from '../../../../contexts/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser(); 

  const validateForm = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email || !emailRegex.test(form.email)) {
      errs.email = 'יש להזין אימייל תקין';
    }
    if (!form.password) {
      errs.password = 'יש להזין סיסמה';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:3000/auth/login', {
        email: form.email,
        password: form.password
      }, { withCredentials: true });

      await login(); 
      alert("התחברת בהצלחה");
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 401) {
        setGeneralError("אימייל או סיסמה שגויים");
      } else {
        setGeneralError("שגיאה במערכת, נסה שוב מאוחר יותר");
        console.error(err);
      }
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {generalError && <p className={styles.error}>{generalError}</p>}

        <input
          name="email"
          placeholder="אימייל"
          value={form.email}
          onChange={handleChange("email")}
          className={`${styles.authInput} ${errors.email ? styles.invalid : ''}`}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <input
          name="password"
          type="password"
          placeholder="סיסמה"
          value={form.password}
          onChange={handleChange("password")}
          className={`${styles.authInput} ${errors.password ? styles.invalid : ''}`}
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <button className={styles.authButton}>התחבר</button>

        <a href="http://localhost:3000/auth/google" className={styles.socialButton}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className={styles.socialIcon}
          />
          התחברות עם Google
        </a>

        <Link to="/signup" className={styles.authLink}>אין לך חשבון? להרשמה</Link>
      </form>
    </div>
  );
}
