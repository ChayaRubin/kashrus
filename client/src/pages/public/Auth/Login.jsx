import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { useUser } from '../../../contexts/AuthContext.jsx';
import { Auth } from '../../../app/api.js';   // ✅ use the Auth service we defined in api.js

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
      errs.email = 'Please enter a valid email';
    }
    if (!form.password) {
      errs.password = 'Please enter a password';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    try {
      await Auth.login(form.email, form.password);   // ✅ use shared api
      await login(form.email, form.password);
      alert("Logged in successfully");
      navigate("/home");
    } catch (err) {
      if (err.message.includes("401")) {
        setGeneralError('Email or Password is incorrect');
      } else {
        setGeneralError("System error, please try again later");
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
          placeholder="Email"
          value={form.email}
          onChange={handleChange("email")}
          className={`${styles.authInput} ${errors.email ? styles.invalid : ''}`}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange("password")}
          className={`${styles.authInput} ${errors.password ? styles.invalid : ''}`}
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <button className={styles.authButton}>Log In</button>

        <a href="http://localhost:5000/auth/google" className={styles.socialButton}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className={styles.socialIcon}
          />
          Continue with Google
        </a>

        <Link to="/signup" className={styles.authLink}>
          Don’t have an account? Sign up
        </Link>
      </form>
    </div>
  );
}
