// import React, { useEffect, useState } from 'react';
// import styles from './Slideshow.module.css';

// export default function Slideshow({
//   images,
//   height = '360px',
//   interval = 3000,
//   fullScreen = false,
//     overlayText = ""   // 👈 new prop

// }) {
//   const [idx, setIdx] = useState(0);
//   const [openForm, setOpenForm] = useState(false);
//   const [form, setForm] = useState({ name: '', email: '', message: '' });
//   const [sent, setSent] = useState(false);

//   useEffect(() => {
//     if (!images?.length) return;

//     const t = setInterval(() => {
//       setIdx((i) => (i + 1) % images.length);
//     }, interval);

//     return () => clearInterval(t);
//   }, [images, interval]);

//   if (!images?.length) return null;

//   const handleChange = (field) => (e) => {
//     setForm({ ...form, [field]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // 👉 Call your backend email API
//       await fetch('http://localhost:5000/contact', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });
//       setSent(true);
//     } catch (err) {
//       console.error('Error sending email', err);
//     }
//   };

//   const handleClose = () => {
//     // reset everything when modal closes
//     setOpenForm(false);
//     setSent(false);
//     setForm({ name: '', email: '', message: '' });
//   };

//   return (
//     <>
//     <div
//   className={`${styles.container} ${fullScreen ? styles.fullScreen : ''}`}
//   style={{ height: fullScreen ? '100vh' : height }}
//   onClick={() => setOpenForm(true)}
// >
//   {/* overlay text */}
//   <div className={styles.info}>
//     <p>Explore our slideshow to discover exciting advertising opportunities!</p>
//   </div>

//   {/* images */}
//   {images.map((src, i) => (
//     <img
//       key={i}
//       src={src}
//       alt="Advertisement"
//       className={`${styles.image} ${i === idx ? styles.imageVisible : ''}`}
//     />
//   ))}
// </div>



//       {/* ✅ Contact form modal */}
//       {openForm && (
//         <div className={styles.modalOverlay} onClick={handleClose}>
//           <div
//             className={styles.modal}
//             onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//           >
//             {!sent ? (
//               <form onSubmit={handleSubmit} className={styles.form}>
//   <h2>Advertise With Us</h2>
//   <input
//     type="text"
//     placeholder="Your Name / Business"
//     value={form.name}
//     onChange={handleChange('name')}
//     required
//   />
//   <input
//     type="email"
//     placeholder="Your Email"
//     value={form.email}
//     onChange={handleChange('email')}
//     required
//   />
//   <textarea
//     placeholder="What would you like to advertise?"
//     rows={4}
//     value={form.message}
//     onChange={handleChange('message')}
//     required
//   />
//   <div className={styles.actions}>
//     <button type="submit">Send Request</button>
//     <button type="button" onClick={handleClose}>Cancel</button>
//   </div>
// </form>

//             ) : (
//              <div className={styles.thankyou}>
//   <p>✅ Thank you! Your advertising request has been sent.</p>
//   <button onClick={handleClose}>Close</button>
// </div>

//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
// src/components/Slideshow/Slideshow.jsx
import React, { useEffect, useState } from 'react';
import styles from './Slideshow.module.css';

export default function Slideshow({
  images,
  height = '360px',
  interval = 3000,
  fullScreen = false,
  overlayText = ""   // ✅ dynamic text from DB
}) {
  const [idx, setIdx] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!images?.length) return;

    const t = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, interval);

    return () => clearInterval(t);
  }, [images, interval]);

  if (!images?.length) return null;

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch (err) {
      console.error('Error sending email', err);
    }
  };

  const handleClose = () => {
    setOpenForm(false);
    setSent(false);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <div
        className={`${styles.container} ${fullScreen ? styles.fullScreen : ''}`}
        style={{ height: fullScreen ? '100vh' : height }}
        onClick={() => setOpenForm(true)}
      >
        {/* ✅ overlay text from DB */}
        {overlayText && (
          <div className={styles.info}>
            <p>{overlayText}</p>
          </div>
        )}

        {/* images */}
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Advertisement"
            className={`${styles.image} ${i === idx ? styles.imageVisible : ''}`}
          />
        ))}
      </div>

      {/* Contact form modal */}
      {openForm && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {!sent ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Advertise With Us</h2>
                <input
                  type="text"
                  placeholder="Your Name / Business"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                />
                <textarea
                  placeholder="What would you like to advertise?"
                  rows={4}
                  value={form.message}
                  onChange={handleChange('message')}
                  required
                />
                <div className={styles.actions}>
                  <button type="submit">Send Request</button>
                  <button type="button" onClick={handleClose}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className={styles.thankyou}>
                <p>✅ Thank you! Your advertising request has been sent.</p>
                <button onClick={handleClose}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
