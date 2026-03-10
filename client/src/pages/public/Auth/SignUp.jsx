// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import styles from './AuthForm.module.css';
// import { useUser } from '../../../contexts/AuthContext.jsx';
// import { Auth } from '../../../app/api.js';   // ✅ use the Auth service we defined in api.js

// export default function SignUp() {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const { login } = useUser();

//   const validateForm = () => {
//     const errs = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

//     if (!form.name) errs.name = "Please enter your name";
//     if (!form.email || !emailRegex.test(form.email)) errs.email = "Invalid email";
//     if (!form.password || !passwordRegex.test(form.password)) {
//       errs.password = "Password must be at least 8 chars with uppercase, number, and special char";
//     }
//     if (form.password !== form.confirmPassword) {
//       errs.confirmPassword = "Passwords do not match";
//     }

//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleChange = (field) => (e) => {
//     const value = e.target.value;
//     setForm(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       // ✅ use Auth service instead of raw axios
//       await Auth.signup(form.name, form.email, form.password);
//       await login(form.email, form.password);
//       alert("Signed up successfully");
//       navigate("/home");
//     } catch (err) {
//       if (err.message.includes("409")) {
//         setErrors({ email: "This email is already registered" });
//       } else {
//         console.error(err);
//         alert("An error occurred during signup");
//       }
//     }
//   };

//   return (
//     <div className={styles.authWrapper}>
//       <form onSubmit={handleSubmit} className={styles.authForm}>
//         <input
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange("name")}
//           className={`${styles.authInput} ${errors.name ? styles.invalid : ''}`}
//         />
//         {errors.name && <p className={styles.error}>{errors.name}</p>}

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

//         <input
//           name="confirmPassword"
//           type="password"
//           placeholder="Confirm Password"
//           value={form.confirmPassword}
//           onChange={handleChange("confirmPassword")}
//           className={`${styles.authInput} ${errors.confirmPassword ? styles.invalid : ''}`}
//         />
//         {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

//         <button className={styles.authButton}>Sign Up</button>

//         <a href="http://localhost:5000/auth/google" className={styles.socialButton}>
//           <img
//             src="https://www.svgrepo.com/show/475656/google-color.svg"
//             alt="Google"
//             className={styles.socialIcon}
//           />
//           Continue with Google
//         </a>

//         <Link to="/login" className={styles.authLink}>
//           Already have an account? Log in
//         </Link>
//       </form>
//     </div>
//   );
// }
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { useUser } from '../../../contexts/AuthContext.jsx';
import { Auth, API_BASE } from '../../../app/api.js';

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const validateForm = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!form.name) errs.name = 'Please enter your name';
    if (!form.email || !emailRegex.test(form.email)) errs.email = 'Invalid email';
    if (!form.password || !passwordRegex.test(form.password)) {
      errs.password =
        'Password must be at least 8 chars with uppercase, number, and special char';
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    try {
      await Auth.signup(form.name, form.email, form.password);
      await login(form.email, form.password);

      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err.status === 409) {
        setErrors({ email: 'This email is already registered' });
      } else {
        setGeneralError(err.message || 'An error occurred during signup');
      }
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Create your account</h1>
          <p className={styles.authSubtitle}>
            Sign up in seconds. You can also use Google to continue.
          </p>
        </div>

        {generalError && <p className={styles.error}>{generalError}</p>}

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange('name')}
          className={`${styles.authInput} ${errors.name ? styles.invalid : ''}`}
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange('email')}
          className={`${styles.authInput} ${errors.email ? styles.invalid : ''}`}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <div className={styles.inputWithIcon}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange('password')}
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

        <div className={styles.inputWithIcon}>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            className={`${styles.authInput} ${errors.confirmPassword ? styles.invalid : ''}`}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? (
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
        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

        <button className={styles.authButton}>Sign Up</button>

        <div className={styles.divider}>or</div>

        <a href={`${API_BASE}/auth/google`} className={styles.socialButton}>
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
