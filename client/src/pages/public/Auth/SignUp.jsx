import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { useUser } from '../../../contexts/AuthContext.jsx';
import { Auth } from '../../../app/api.js';   // ✅ use the Auth service we defined in api.js

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useUser();

  const validateForm = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!form.name) errs.name = "Please enter your name";
    if (!form.email || !emailRegex.test(form.email)) errs.email = "Invalid email";
    if (!form.password || !passwordRegex.test(form.password)) {
      errs.password = "Password must be at least 8 chars with uppercase, number, and special char";
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // ✅ use Auth service instead of raw axios
      await Auth.signup(form.name, form.email, form.password);
      await login(form.email, form.password);
      alert("Signed up successfully");
      navigate("/home");
    } catch (err) {
      if (err.message.includes("409")) {
        setErrors({ email: "This email is already registered" });
      } else {
        console.error(err);
        alert("An error occurred during signup");
      }
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange("name")}
          className={`${styles.authInput} ${errors.name ? styles.invalid : ''}`}
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}

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

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          className={`${styles.authInput} ${errors.confirmPassword ? styles.invalid : ''}`}
        />
        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

        <button className={styles.authButton}>Sign Up</button>

        <a href="http://localhost:5000/auth/google" className={styles.socialButton}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className={styles.socialIcon}
          />
          Continue with Google
        </a>

        <Link to="/login" className={styles.authLink}>
          Already have an account? Log in
        </Link>
      </form>
    </div>
  );
}
