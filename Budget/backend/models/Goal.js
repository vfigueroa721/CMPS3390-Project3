const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  saved: {
    type: Number,
    default: 0,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('Goal', goalSchema);
