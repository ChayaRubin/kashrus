import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import restaurants from './routes/restaurants.js';
import { errorHandler } from './middleware/error.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api', (_req, res) => res.json({ ok: true }));
app.use('/api/restaurants', restaurants);

// simple login stub (you can swap later)
app.post('/api/login', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Missing email' });
  res.json({ token: 'demo-token', user: { email } });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
