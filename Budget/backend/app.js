const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Backend is running!');
});
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: '✅ Backend is alive!' });
});
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});


module.exports = app;
