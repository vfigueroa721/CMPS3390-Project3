const User = require('../models/User');

exports.getUserBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.setUserBalance = async (req, res) => {
    const { balance } = req.body;
  
    if (isNaN(balance)) {
      return res.status(400).json({ error: 'Invalid balance value' });
    }
  
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { balance },
        { new: true }
      );
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.json({ balance: user.balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  