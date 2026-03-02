// // import { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import styles from './AuthForm.module.css';
// // import { useUser } from '../../../contexts/AuthContext.jsx';
// // import { Auth } from '../../../app/api.js';   // ✅ use the Auth service we defined in api.js

// // export default function Login() {
// //   const [form, setForm] = useState({ email: '', password: '' });
// //   const [errors, setErrors] = useState({});
// //   const [generalError, setGeneralError] = useState('');
// //   const navigate = useNavigate();
// //   const { login } = useUser();

// //   const validateForm = () => {
// //     const errs = {};
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// //     if (!form.email || !emailRegex.test(form.email)) {
// //       errs.email = 'Please enter a valid email';
// //     }
// //     if (!form.password) {
// //       errs.password = 'Please enter a password';
// //     }

// //     setErrors(errs);
// //     return Object.keys(errs).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setGeneralError('');

// //     if (!validateForm()) return;

// //     try {
// //       await Auth.login(form.email, form.password);   // ✅ use shared api
// //       await login(form.email, form.password);
// //       alert("Logged in successfully");
// //       navigate("/home");
// //     } catch (err) {
// //       if (err.message.includes("401")) {
// //         setGeneralError('Email or Password is incorrect');
// //       } else {
// //         setGeneralError("System error, please try again later");
// //         console.error(err);
// //       }
// //     }
// //   };

// //   const handleChange = (field) => (e) => {
// //     setForm({ ...form, [field]: e.target.value });
// //     if (errors[field]) {
// //       setErrors((prev) => {
// //         const newErrors = { ...prev };
// //         delete newErrors[field];
// //         return newErrors;
// //       });
// //     }
// //   };

// //   return (
// //     <div className={styles.authWrapper}>
// //       <form onSubmit={handleSubmit} className={styles.authForm}>
// //         {generalError && <p className={styles.error}>{generalError}</p>}

// //         <input
// //           name="email"
// //           placeholder="Email"
// //           value={form.email}
// //           onChange={handleChange("email")}
// //           className={`${styles.authInput} ${errors.email ? styles.invalid : ''}`}
// //         />
// //         {errors.email && <p className={styles.error}>{errors.email}</p>}

// //         <input
// //           name="password"
// //           type="password"
// //           placeholder="Password"
// //           value={form.password}
// //           onChange={handleChange("password")}
// //           className={`${styles.authInput} ${errors.password ? styles.invalid : ''}`}
// //         />
// //         {errors.password && <p className={styles.error}>{errors.password}</p>}

// //         <button className={styles.authButton}>Log In</button>

// //         <a href="http://localhost:5000/auth/google" className={styles.socialButton}>
// //           <img
// //             src="https://www.svgrepo.com/show/475656/google-color.svg"
// //             alt="Google"
// //             className={styles.socialIcon}
// //           />
// //           Continue with Google
// //         </a>

// //         <Link to="/signup" className={styles.authLink}>
// //           Don’t have an account? Sign up
// //         </Link>
// //       </form>
// //     </div>
// //   );
// // }
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import styles from './AuthForm.module.css';
// import { useUser } from '../../../contexts/AuthContext.jsx';
// import { Auth } from '../../../app/api.js';   // ✅ use the Auth service

// export default function Login() {
  
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [generalError, setGeneralError] = useState('');
//   const navigate = useNavigate();
//   const { login } = useUser();

//   const validateForm = () => {
//     const errs = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!form.email || !emailRegex.test(form.email)) {
//       errs.email = 'Please enter a valid email';
//     }
//     if (!form.password) {
//       errs.password = 'Please enter a password';
//     }

//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setGeneralError('');

//     if (!validateForm()) return;

//     try {
//       // authenticate via backend
//       await Auth.login(form.email, form.password);
//       // update global auth context
//       await login(form.email, form.password);

//       navigate("/home");
//     } catch (err) {
//       console.error(err);
//       if (err.status === 401) {
//         setGeneralError('Email or password is incorrect');
//       } else {
//         setGeneralError(err.message || "System error, please try again later");
//       }
//     }
//   };

//   const handleChange = (field) => (e) => {
//     setForm({ ...form, [field]: e.target.value });
//     if (errors[field]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   return (
//     <div className={styles.authWrapper}>
//       <form onSubmit={handleSubmit} className={styles.authForm}>
//         {generalError && <p className={styles.error}>{generalError}</p>}

//         <input
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange("email")}
//           className={`${styles.authInput} ${errors.email ? styles.invalid : ''}`}
//         />
//         {errors.email && <p className={styles.error}>{errors.email}</p>}

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange("password")}
//           className={`${styles.authInput} ${errors.password ? styles.invalid : ''}`}
//         />
//         {errors.password && <p className={styles.error}>{errors.password}</p>}

//         <button className={styles.authButton}>Log In</button>

//         <a href="http://localhost:5000/auth/google" className={styles.socialButton}>
//           <img
//             src="https://www.svgrepo.com/show/475656/google-color.svg"
//             alt="Google"
//             className={styles.socialIcon}
//           />
//           Continue with Google
//         </a>

//         <Link to="/signup" className={styles.authLink}>
//           Don’t have an account? Sign up
//         </Link>
//       </form>
//     </div>
//   );
// }
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { useUser } from '../../../contexts/AuthContext.jsx';
import { Auth, API_BASE } from '../../../app/api.js';   // use your Auth service

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  // --- Form validation ---
  const validateForm = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = (form.email || '').trim();

    if (!email || !emailRegex.test(email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!form.password) {
      errs.password = 'Please enter a password';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    const email = (form.email || '').trim();
    const password = form.password;

    try {
      // Authenticate via backend
      await Auth.login(email, password);
      // Update global auth context
      await login(email, password);

      console.log("Login successful");
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      if (err.status === 401) {
        setGeneralError('Email or password is incorrect');
      } else {
        setGeneralError(err.message || "System error, please try again later");
      }
    }
  };

  // --- Handle admin login ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    const email = (form.email || '').trim();
    try {
      await Auth.login(email, form.password);
      await login(email, form.password);
      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err);
      if (err.status === 401) {
        setGeneralError('Email or password is incorrect');
      } else {
        setGeneralError(err.message || "System error, please try again later");
      }
    }
  };

  // --- Handle input changes ---
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
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Welcome back</h1>
          <p className={styles.authSubtitle}>
            Sign in to manage your account and access personalized features.
          </p>
        </div>

        {generalError && <p className={styles.error}>{generalError}</p>}

        <div className={styles.notice}>
          <strong>Admin access:</strong> To access the admin dashboard, you must sign in with an
          account that has admin permissions.
        </div>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange("email")}
          className={`${styles.authInput} ${errors.email ? styles.invalid : ''}`}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <div className={styles.inputWithIcon}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange("password")}
            className={`${styles.authInput} ${errors.password ? styles.invalid : ''}`}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M9.88 5.1A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.16 18.16 0 0 1-3.2 4.35M6.1 6.1C3.7 7.7 2 12 2 12s3 7 10 7a10.94 10.94 0 0 0 4.9-1.1"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <button type="submit" className={styles.authButton}>Log In</button>
        {/* <button type="button" onClick={handleAdminLogin} className={`${styles.authButton} ${styles.adminButton}`}>Admin Login</button> */}

        <div className={styles.divider}>or</div>

        <a href={`${API_BASE}/auth/google`} className={styles.socialButton}>
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

