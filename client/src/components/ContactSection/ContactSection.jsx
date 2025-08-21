import React, { useState } from 'react';
import styles from './ContactSection.module.css';
import { api } from '../../app/api.js';

export default function ContactPage() {
  const [mode, setMode] = useState('question'); // 'question' | 'add_restaurant'
  const [formData, setFormData] = useState({
    // common
    name: '',
    email: '',
    // question-specific
    subject: '',
    message: '',
    // add_restaurant-specific
    requesterName: '',
    requesterEmail: '',
    restaurantName: '',
    city: '',
    address: '',
    phone: '',
    website: '',
    kashrus: '',
    details: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      requesterName: '',
      requesterEmail: '',
      restaurantName: '',
      city: '',
      address: '',
      phone: '',
      website: '',
      kashrus: '',
      details: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      if (mode === 'add_restaurant') {
        const payload = {
          type: 'add_restaurant',
          requesterName: formData.requesterName || formData.name,
          requesterEmail: formData.requesterEmail || formData.email,
          restaurantName: formData.restaurantName,
          city: formData.city,
          address: formData.address,
          phone: formData.phone,
          website: formData.website,
          kashrus: formData.kashrus,
          details: formData.details,
        };
        await api.post('/contact', payload);
        setSuccess('Your restaurant request was sent successfully.');
        resetForm();
      } else {
        const payload = {
          type: 'question',
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        };
        await api.post('/contact', payload);
        setSuccess('Your question was sent successfully.');
        resetForm();
      }
    } catch (err) {
      setError('There was a server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className={styles.wrapper}>
      <div className={styles.cardContainer}>
        <div className={styles.infoBox}>
          <h2 className={styles.infoTitle}>Contact Details</h2>
          <p><strong>Phone:</strong> 0504145381</p>
          <p><strong>Email:</strong> 5321745@gmail.com</p>
          <p><strong>Address:</strong> 10 Example St, Tel Aviv</p>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>Choose between sending a question or a restaurant addition request.</p>

          <div className={styles.row} style={{ marginBottom: 16 }}>
            <button
              type="button"
              className={styles.button}
              style={{ opacity: mode === 'question' ? 1 : 0.6 }}
              onClick={() => setMode('question')}
            >
              ❓ Ask a Question
            </button>
            <button
              type="button"
              className={styles.button}
              style={{ opacity: mode === 'add_restaurant' ? 1 : 0.6 }}
              onClick={() => setMode('add_restaurant')}
            >
              📝 Request Restaurant Addition
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {mode === 'question' ? (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="name" className={styles.label}>Full Name</label>
                    <input name="name" id="name" type="text" value={formData.name} onChange={handleChange} required className={styles.input} />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input name="email" id="email" type="email" value={formData.email} onChange={handleChange} required className={styles.input} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="subject" className={styles.label}>Subject</label>
                  <input name="subject" id="subject" type="text" value={formData.subject} onChange={handleChange} className={styles.input} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>Message</label>
                  <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} className={styles.textarea} required />
                </div>
              </>
            ) : (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="requesterName" className={styles.label}>Your Name</label>
                    <input name="requesterName" id="requesterName" type="text" value={formData.requesterName} onChange={handleChange} required className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="requesterEmail" className={styles.label}>Your Email</label>
                    <input name="requesterEmail" id="requesterEmail" type="email" value={formData.requesterEmail} onChange={handleChange} required className={styles.input} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="restaurantName" className={styles.label}>Restaurant Name</label>
                  <input name="restaurantName" id="restaurantName" type="text" value={formData.restaurantName} onChange={handleChange} required className={styles.input} />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="city" className={styles.label}>City</label>
                    <input name="city" id="city" type="text" value={formData.city} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="address" className={styles.label}>Address</label>
                    <input name="address" id="address" type="text" value={formData.address} onChange={handleChange} className={styles.input} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="phone" className={styles.label}>Phone</label>
                    <input name="phone" id="phone" type="text" value={formData.phone} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="website" className={styles.label}>Website</label>
                    <input name="website" id="website" type="url" value={formData.website} onChange={handleChange} className={styles.input} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="kashrus" className={styles.label}>Kashrus</label>
                  <input name="kashrus" id="kashrus" type="text" value={formData.kashrus} onChange={handleChange} className={styles.input} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="details" className={styles.label}>Additional Details</label>
                  <textarea name="details" id="details" rows="5" value={formData.details} onChange={handleChange} className={styles.textarea} />
                </div>
              </>
            )}

            <div className={styles.actions}>
              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Sending…' : 'Send'}
              </button>
            </div>
            {success && <p className={styles.success}>✅ {success}</p>}
            {error && <p className={styles.error}>❌ {error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
