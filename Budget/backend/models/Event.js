const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
