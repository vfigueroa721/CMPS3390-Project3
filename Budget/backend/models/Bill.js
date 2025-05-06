const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  added: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Bill', BillSchema);
