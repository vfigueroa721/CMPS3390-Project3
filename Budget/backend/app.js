const express = require('express');
const cors = require('cors');
const app = express();

// Example route to test if it's working
app.get('/', (req, res) => {
  res.send('🚀 Backend is running!');
});

app.use(cors());
app.use(express.json());

module.exports = app;
