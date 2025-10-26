import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Management System API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
