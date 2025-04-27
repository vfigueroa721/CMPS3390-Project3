const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // ✅ MUST be here before routes

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Backend is running!');
});

module.exports = app;
