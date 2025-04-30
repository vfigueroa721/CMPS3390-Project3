const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Goal', goalSchema);
