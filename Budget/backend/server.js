// server.js
const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    //app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

  })
  .catch((err) => {
    console.error(err);
  });

